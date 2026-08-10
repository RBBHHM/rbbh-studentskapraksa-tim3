#!/usr/bin/env node
'use strict';

const storage = require('../lib/storage');
const { bold, green, blue, dim, cyan } = require('../lib/colors');

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

const { monday, sunday } = getWeekRange();
const allLogs = storage.readLogs();
const weekLogs = allLogs.filter(e => {
  const t = new Date(e.timestamp);
  return t >= monday && t <= sunday;
});

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`${bold(cyan('   SEDMIČNI IZVJEŠTAJ'))}`);
console.log(`${bold(cyan('═══════════════════════════════════════'))}\n`);

const weekStr = `${monday.toLocaleDateString()} – ${sunday.toLocaleDateString()}`;
console.log(`  ${dim('Sedmica:')} ${blue(weekStr)}\n`);

if (weekLogs.length === 0) {
  console.log(`  ${yellow('Nema podataka za ovu sedmicu.')}\n`);
  process.exit(0);
}

const totalTime = weekLogs.reduce((s, e) => s + (e.timeSaved || 0), 0);
const byCategory = {};
weekLogs.forEach(e => {
  if (!byCategory[e.category]) byCategory[e.category] = { count: 0, time: 0 };
  byCategory[e.category].count++;
  byCategory[e.category].time += e.timeSaved || 0;
});

const completedThisWeek = storage.readCompletedTasks().filter(t => {
  const ended = new Date(t.endedAt || t.startedAt);
  return ended >= monday && ended <= sunday;
});

const payload = {
  week: monday.toISOString().split('T')[0],
  totalInteractions: weekLogs.length,
  totalTimeSavedMin: totalTime,
  byCategory,
  completedTasks: completedThisWeek.length,
  generatedAt: new Date().toISOString(),
};

console.log(`${bold('  TJEDNI SAŽETAK')}`);
console.log(`  ${dim('Interakcija:')}  ${green(String(weekLogs.length))}`);
console.log(`  ${dim('Ušteđeno:')}    ${green(totalTime + ' min')} ${dim('(' + (totalTime / 60).toFixed(1) + ' h)')}`);
console.log(`  ${dim('Zadataka:')}    ${green(String(completedThisWeek.length))}\n`);

console.log(`${bold('  PO KATEGORIJI')}`);
Object.entries(byCategory).sort((a, b) => b[1].time - a[1].time).forEach(([cat, s]) => {
  console.log(`  ${blue(cat.padEnd(20))} ${dim(s.count + 'x')}  ${green(s.time + ' min')}`);
});

console.log(`\n  ${dim('Za slanje mentoru:')}`);
console.log(`  ${cyan('npm run research:upload -- --student=12345')}`);

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
