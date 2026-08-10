#!/usr/bin/env node
'use strict';

const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const storage = require('../lib/storage');
const { bold, green, blue, dim, cyan, yellow, red } = require('../lib/colors');

// ── Učitaj .env ──────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  });
}

function parseArgs() {
  const result = {};
  process.argv.slice(2).forEach(arg => {
    const m = arg.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) result[m[1]] = m[2] !== undefined ? m[2] : true;
  });
  return result;
}

// ── GitHub API helper ─────────────────────────────────────────────────────────
function githubRequest(method, apiPath, token, body) {
  return new Promise((resolve, reject) => {
    const bodyBuf = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const headers = {
      'Authorization': `token ${token}`,
      'User-Agent':    'studentskapraksa-research-cli',
      'Accept':        'application/vnd.github+json',
      'Content-Type':  'application/json',
    };
    if (bodyBuf) headers['Content-Length'] = bodyBuf.length;

    const req = https.request({
      hostname: 'api.github.com',
      path:     '/repos/' + apiPath,
      method,
      headers,
    }, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try   { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args      = parseArgs();
  const studentId = args['student'] || process.env.STUDENT_ID || null;
  const token     = process.env.GITHUB_TOKEN;
  const repo      = process.env.GITHUB_REPO; // npr. "mentor-username/istrazivanje-logs"

  if (!studentId) {
    console.error(red('Greška: šifra studenta je obavezna.'));
    console.error('Upotreba: npm run research:upload -- --student=12345');
    console.error(dim('Ili postavi STUDENT_ID=12345 u .env fajl.'));
    process.exit(1);
  }
  if (!token) {
    console.error(red('Greška: GITHUB_TOKEN nije postavljen u .env fajlu.'));
    console.error(dim('GitHub.com → Settings → Developer settings → Personal access tokens → New (scope: repo)'));
    process.exit(1);
  }
  if (!repo) {
    console.error(red('Greška: GITHUB_REPO nije postavljen u .env fajlu.'));
    console.error(dim('Format: GITHUB_REPO=mentor-username/naziv-repoa'));
    process.exit(1);
  }

  // ── Zadnji upload (inkrementalni filter) ────────────────────────────────
  const LAST_UPLOAD_FILE = path.resolve(__dirname, '../../.research/logs/last-upload.json');
  let lastUploadTime = null;
  if (fs.existsSync(LAST_UPLOAD_FILE)) {
    try { lastUploadTime = JSON.parse(fs.readFileSync(LAST_UPLOAD_FILE, 'utf8')).timestamp; }
    catch { /* ignoriši */ }
  }

  // ── AI interakcije (ručno logovane) ──────────────────────────────────────
  const allLogs = storage.readLogs();
  const newLogs = lastUploadTime
    ? allLogs.filter(e => e.timestamp > lastUploadTime)
    : allLogs;

  // ── Aktivnost fajlova (automatski praćena) ────────────────────────────────
  const ACTIVITY_FILE = path.resolve(__dirname, '../../.research/logs/activity.jsonl');
  let activityLogs = [];
  if (fs.existsSync(ACTIVITY_FILE)) {
    activityLogs = fs.readFileSync(ACTIVITY_FILE, 'utf8')
      .split('\n').filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean)
      .filter(e => !lastUploadTime || e.timestamp > lastUploadTime);
  }

  if (newLogs.length === 0 && activityLogs.length === 0) {
    console.log(`\n${yellow('\u2139  Nema novih logova od zadnjeg uploada.')}`);
    if (lastUploadTime) console.log(dim(`   Zadnji upload: ${lastUploadTime.split('T')[0]}`));
    console.log('');
    process.exit(0);
  }

  // ── Pripremi payload ──────────────────────────────────────────────────────
  const now             = new Date();
  const totalTimeSaved  = newLogs.reduce((s, e) => s + (e.timeSaved  || 0), 0);
  const totalDuration   = newLogs.reduce((s, e) => s + (e.duration   || 0), 0);
  const byCategory      = {};
  newLogs.forEach(e => {
    if (!byCategory[e.category]) byCategory[e.category] = { count: 0, timeSaved: 0, duration: 0 };
    byCategory[e.category].count++;
    byCategory[e.category].timeSaved += e.timeSaved || 0;
    byCategory[e.category].duration  += e.duration  || 0;
  });

  const fileChanges = activityLogs.filter(e => e.type === 'file_change');
  const sessions    = activityLogs.filter(e => e.type === 'session_start' || e.type === 'session_end');

  const allTimestamps = [
    ...newLogs.map(e => e.timestamp),
    ...activityLogs.map(e => e.timestamp),
  ].sort();

  const payload  = {
    studentId,
    generatedAt:       now.toISOString(),
    periodStart:       lastUploadTime || allTimestamps[0] || now.toISOString(),
    periodEnd:         allTimestamps[allTimestamps.length - 1] || now.toISOString(),
    totalInteractions:  newLogs.length,
    totalDurationMin:   totalDuration,
    totalTimeSavedMin:  totalTimeSaved,
    byCategory,
    fileChangesCount:  fileChanges.length,
    sessions:          sessions.length / 2 | 0,
    aiLogs:            newLogs,
    fileActivity:      fileChanges,
  };
  const dateStr  = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const filename = `${studentId}-${dateStr}.json`;
  const filePath = `students/${studentId}/${filename}`;

  // ── Upload na GitHub ──────────────────────────────────────────────────────
  console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
  console.log(`${bold(cyan('   GITHUB UPLOAD'))}`);
  console.log(`${bold(cyan('═══════════════════════════════════════'))}\n`);
  console.log(`  ${dim('Repo:')}  ${blue(repo)}`);
  console.log(`  ${dim('Fajl:')}  ${blue(filePath)} ${dim('...')}`);

  const content    = Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64');
  const uploadRes  = await githubRequest(
    'PUT',
    `${repo}/contents/${filePath}`,
    token,
    {
      message: `logs: ${studentId} ${dateStr}`,
      content,
    }
  );

  if (uploadRes.status !== 201 && uploadRes.status !== 200) {
    throw new Error(`HTTP ${uploadRes.status}: ${JSON.stringify(uploadRes.body)}`);
  }

  const logsDir = path.dirname(LAST_UPLOAD_FILE);
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  fs.writeFileSync(LAST_UPLOAD_FILE, JSON.stringify({ timestamp: now.toISOString() }, null, 2), 'utf8');

  console.log(`  ${green('✓')} ${bold('Logovi uspješno poslani!')}\n`);
  console.log(`  ${dim('Student:')}         ${blue(studentId)}`);
  console.log(`  ${dim('AI interakcija:')}  ${green(String(newLogs.length))}`);
  console.log(`  ${dim('Trajanje ukupno:')} ${green(totalDuration + ' min')}`);
  console.log(`  ${dim('Izmjena fajlova:')} ${green(String(fileChanges.length))}`);
  console.log(`  ${dim('Ušteđeno:')}        ${green(totalTimeSaved + ' min')}\n`);

  console.log(`${bold('  PO KATEGORIJI')}`);
  Object.entries(byCategory)
    .sort((a, b) => b[1].timeSaved - a[1].timeSaved)
    .forEach(([cat, s]) => {
      const dur = s.duration ? ` ${dim('(' + s.duration + ' min')}${dim(')')}` : '';
      console.log(`  ${blue(cat.padEnd(20))} ${dim(s.count + 'x')}  ${green(s.timeSaved + ' min')}${dur}`);
    });

  console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
}

main().catch(err => {
  console.error(red(`\n  ✗ Greška: ${err.message}`));
  console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
  process.exit(1);
});
