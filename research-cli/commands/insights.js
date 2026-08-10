#!/usr/bin/env node
'use strict';

const storage = require('../lib/storage');
const { bold, green, blue, dim, cyan, yellow, magenta } = require('../lib/colors');

const allLogs = storage.readLogs();

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}`);
console.log(`${bold(cyan('   PERSONALNI UVIDI'))}`);
console.log(`${bold(cyan('═══════════════════════════════════════'))}\n`);

if (allLogs.length === 0) {
  console.log(`   ${yellow('Nema dovoljno podataka za uvide.')}`);
  console.log(`   ${dim('Počnite koristiti AI alate i logujte interakcije!\n')}`);
  process.exit(0);
}

const totalTimeSaved = allLogs.reduce((sum, e) => sum + (e.timeSaved || 0), 0);
const totalInteractions = allLogs.length;

const byCategory = {};
allLogs.forEach(e => {
  if (!byCategory[e.category]) byCategory[e.category] = { count: 0, time: 0 };
  byCategory[e.category].count++;
  byCategory[e.category].time += e.timeSaved || 0;
});

const topCategory = Object.entries(byCategory).sort((a, b) => b[1].time - a[1].time)[0];

const byDay = {};
allLogs.forEach(e => {
  const day = e.timestamp.split('T')[0];
  if (!byDay[day]) byDay[day] = { count: 0, time: 0 };
  byDay[day].count++;
  byDay[day].time += e.timeSaved || 0;
});

const days = Object.keys(byDay).sort();
const firstDay = days[0];
const avgPerDay = totalTimeSaved / days.length;

const completedTasks = storage.readCompletedTasks();
const avgTaskDuration = completedTasks.length > 0
  ? Math.round(completedTasks.reduce((s, t) => s + (t.durationMin || 0), 0) / completedTasks.length)
  : null;

console.log(`${bold('  SVEUKUPNO')}`);
console.log(`  ${dim('Ukupno interakcija:')}   ${green(String(totalInteractions))}`);
console.log(`  ${dim('Ukupno ušteđeno:')}     ${green(totalTimeSaved + ' min')} ${dim('(' + (totalTimeSaved / 60).toFixed(1) + ' h)')}`);
console.log(`  ${dim('Praćeno od:')}          ${dim(firstDay)}`);
console.log(`  ${dim('Prosjek/dan:')}         ${green(avgPerDay.toFixed(0) + ' min')}\n`);

console.log(`${bold('  KATEGORIJE')}`);
Object.entries(byCategory)
  .sort((a, b) => b[1].time - a[1].time)
  .forEach(([cat, stats]) => {
    const pct = Math.round((stats.time / totalTimeSaved) * 100);
    console.log(`  ${blue(cat.padEnd(20))} ${dim(stats.count + 'x')}  ${green(stats.time + ' min')}  ${dim(pct + '%')}`);
  });

if (topCategory) {
  console.log(`\n${bold('  UVID')}`);
  console.log(`  Najviše koristiš AI za ${cyan(topCategory[0])} ${dim('('+topCategory[1].time+' min ušteđeno)')}`);
}

if (avgTaskDuration !== null) {
  console.log(`  Prosječan zadatak traje ${cyan(avgTaskDuration + ' min')}`);
}

console.log(`\n${bold('  DNEVNI TREND')}`);
const recentDays = days.slice(-7);
recentDays.forEach(day => {
  const d = byDay[day];
  const bar = '▪'.repeat(Math.min(Math.ceil(d.time / 10), 30));
  console.log(`  ${dim(day)}  ${green(bar)} ${dim(d.time + 'min')}`);
});

console.log(`\n${bold(cyan('═══════════════════════════════════════'))}\n`);
