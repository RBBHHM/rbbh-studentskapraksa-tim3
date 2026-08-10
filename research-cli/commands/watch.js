#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  });
}

const { bold, green, blue, dim, cyan, yellow, red } = require('../lib/colors');

const ACTIVITY_FILE = path.resolve(__dirname, '../../.research/logs/activity.jsonl');
const WATCH_DIR     = path.resolve(__dirname, '../..');

// Fajlovi/folderi koje ignorišemo
const IGNORE = [
  /(^|[/\\])\.git([/\\]|$)/,
  /(^|[/\\])node_modules([/\\]|$)/,
  /(^|[/\\])\.research([/\\]|$)/,
  /(^|[/\\])bin([/\\]|$)/,
  /(^|[/\\])obj([/\\]|$)/,
  /\.tmp$/, /\.swp$/, /\.log$/,
  /AssemblyInfo/, /GlobalUsings\.g\.cs$/,
];

const debounceMap  = {};
const loggedFiles  = new Set(); // fajlovi već zabilježeni u ovoj sesiji
let changeCount    = 0;

function logActivity(entry) {
  const dir = path.dirname(ACTIVITY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(ACTIVITY_FILE, JSON.stringify(entry) + '\n', 'utf8');
}

function onFileChange(eventType, filename) {
  if (!filename) return;
  if (IGNORE.some(r => r.test(filename))) return;

  const normalized = filename.replace(/\\/g, '/');

  // Preskoči ako je isti fajl već logovan u ovoj sesiji
  if (loggedFiles.has(normalized)) return;

  const key = filename;
  if (debounceMap[key]) clearTimeout(debounceMap[key]);
  debounceMap[key] = setTimeout(() => {
    delete debounceMap[key];
    if (loggedFiles.has(normalized)) return; // provjera nakon debounce-a
    loggedFiles.add(normalized);
    changeCount++;
    const entry = {
      timestamp: new Date().toISOString(),
      type:      'file_change',
      event:     eventType,
      file:      normalized,
    };
    logActivity(entry);
    const time = entry.timestamp.split('T')[1].slice(0, 8);
    process.stdout.write(`  ${dim(time)}  ${blue(filename)}\n`);
  }, 500);
}

// Pokreni sesiju
const sessionId = Date.now().toString(36);
logActivity({ timestamp: new Date().toISOString(), type: 'session_start', sessionId });

if (!fs.existsSync(WATCH_DIR)) {
  console.error(red(`Greška: folder src/ ne postoji na putanji: ${WATCH_DIR}`));
  process.exit(1);
}

fs.watch(WATCH_DIR, { recursive: true }, onFileChange);

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`${bold(cyan('   RESEARCH WATCH — aktivan'))}`);
console.log(`${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`  ${dim('Pratim:')}  ${blue('cijeli projekat (src/, docker/, research-cli/, ...)')}`);
console.log(`  ${dim('Zaustavi:')} Ctrl+C\n`);
console.log(`  ${bold('UPUTA ZA AI AGENTA (Copilot/Claude):')}`);
console.log(`  ${dim('Nakon svake pomoći pokreni:')}`);
console.log(`  ${cyan('  node research-cli/commands/log-ai.js --tool=copilot --category=KATEGORIJA --time-saved=MINUTE')}`);
console.log(`  ${dim('Kategorije: code_generation | debugging | testing | learning | code_review | optimization')}\n`);
console.log(`  ${dim('Izmjene fajlova:')}`);

// Zaustavljanje
process.on('SIGINT', () => {
  logActivity({ timestamp: new Date().toISOString(), type: 'session_end', sessionId, changes: changeCount });
  console.log(`\n\n  ${green('✓')} Sesija završena — ${green(String(changeCount))} izmjena zabilježeno.`);
  console.log(`  ${dim('Pošalji logove:')} npm run research:upload -- --student=${process.env.STUDENT_ID || '12345'}\n`);
  process.exit(0);
});
