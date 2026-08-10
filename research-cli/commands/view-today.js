#!/usr/bin/env node
'use strict';

const storage = require('../lib/storage');
const { bold, green, blue, dim, cyan, magenta, yellow } = require('../lib/colors');

const logs = storage.getTodayLogs();
const today = new Date().toLocaleDateString('hr-HR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`${bold(cyan('   ISTRAŽIVAČKI AGENT – STATISTIKE DANAS'))}`);
console.log(`${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`   ${dim(today)}\n`);

if (logs.length === 0) {
  console.log(`   ${yellow('Nema zabilježenih AI interakcija danas.')}\n`);
  process.exit(0);
}

const totalTime = logs.reduce((sum, e) => sum + (e.timeSaved || 0), 0);
const byCategory = {};
const byTool = {};

logs.forEach(e => {
  byCategory[e.category] = (byCategory[e.category] || 0) + (e.timeSaved || 0);
  byTool[e.tool] = (byTool[e.tool] || 0) + 1;
});

console.log(`${bold('  UKUPNO')}`);
console.log(`  ${dim('AI interakcije:')} ${green(String(logs.length))}`);
console.log(`  ${dim('Ušteđeno vremena:')} ${green(totalTime + ' min')} ${dim('(' + (totalTime / 60).toFixed(1) + ' h)')}\n`);

console.log(`${bold('  PO KATEGORIJI')}`);
const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
sortedCats.forEach(([cat, mins]) => {
  const bar = '█'.repeat(Math.ceil(mins / 5));
  console.log(`  ${blue(cat.padEnd(20))} ${green(bar)} ${dim(mins + ' min')}`);
});

console.log(`\n${bold('  PO ALATU')}`);
Object.entries(byTool).sort((a, b) => b[1] - a[1]).forEach(([tool, count]) => {
  console.log(`  ${magenta(tool.padEnd(20))} ${dim(count + 'x')}`);
});

const activeTask = storage.getActiveTask();
if (activeTask) {
  const elapsedMin = Math.round((Date.now() - new Date(activeTask.startedAt)) / 60000);
  console.log(`\n${bold('  AKTIVAN ZADATAK')}`);
  console.log(`  ${dim('Naziv:')}   ${blue(activeTask.name)}`);
  console.log(`  ${dim('Traje:')}   ${green(elapsedMin + ' min')}`);
}

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
