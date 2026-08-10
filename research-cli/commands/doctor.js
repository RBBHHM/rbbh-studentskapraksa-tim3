#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const storage = require('../lib/storage');
const { bold, green, red, yellow, dim, cyan } = require('../lib/colors');

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`${bold(cyan('   RESEARCH AGENT – HEALTH CHECK'))}`);
console.log(`${bold(cyan('═══════════════════════════════════════'))}\n`);

let allOk = true;

function check(label, ok, hint) {
  if (ok) {
    console.log(`  ${green('✓')} ${label}`);
  } else {
    console.log(`  ${red('✗')} ${label}`);
    if (hint) console.log(`    ${dim('→ ' + hint)}`);
    allOk = false;
  }
}

const root = path.resolve(__dirname, '../../');
const researchDir = path.join(root, '.research');
const logsDir = path.join(researchDir, 'logs');
const tasksDir = path.join(researchDir, 'tasks');
const logFile = path.join(logsDir, 'ai-interactions.jsonl');
const envFile = path.join(root, '.env');

check(
  '.research/ direktorij postoji',
  fs.existsSync(researchDir),
  'mkdir -p .research/logs .research/tasks/completed'
);

check(
  '.research/logs/ postoji',
  fs.existsSync(logsDir),
  'mkdir -p .research/logs'
);

check(
  '.research/tasks/ postoji',
  fs.existsSync(tasksDir),
  'mkdir -p .research/tasks/completed'
);

check(
  '.env fajl postoji',
  fs.existsSync(envFile),
  'cp .env.example .env'
);

let researchMode = false;
if (fs.existsSync(envFile)) {
  const env = fs.readFileSync(envFile, 'utf8');
  researchMode = /RESEARCH_MODE\s*=\s*active/i.test(env);
}
check(
  'RESEARCH_MODE=active je postavljen',
  researchMode,
  'node research-cli/maintenance/enable.js'
);

const logs = storage.readLogs();
check(
  `Log fajl čitljiv (${logs.length} unosa)`,
  true
);

const todayLogs = storage.getTodayLogs();
const lastLog = logs[logs.length - 1];
check(
  lastLog ? `Zadnji log: ${lastLog.timestamp.split('T')[0]}` : 'Još nema logova',
  true
);

const activeTask = storage.getActiveTask();
if (activeTask) {
  const elapsed = Math.round((Date.now() - new Date(activeTask.startedAt)) / 60000);
  check(`Aktivan zadatak: "${activeTask.name}" (${elapsed} min)`, true);
} else {
  console.log(`  ${dim('ℹ  Nema aktivnog zadatka')}`);
}

const completedTasks = storage.readCompletedTasks();
console.log(`  ${dim('ℹ  Završenih zadataka: ' + completedTasks.length)}`);
console.log(`  ${dim('ℹ  Interakcija danas: ' + todayLogs.length)}`);

console.log();
if (allOk) {
  console.log(`  ${green(bold('Sve je u redu! Research agent je aktivan.'))}`);
} else {
  console.log(`  ${yellow(bold('Postoje problemi. Slijedite gornje upute.'))}`);
}
console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
