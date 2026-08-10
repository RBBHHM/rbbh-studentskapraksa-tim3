#!/usr/bin/env node
'use strict';

const storage = require('../lib/storage');
const { bold, green, yellow, dim, red } = require('../lib/colors');

const activeTask = storage.getActiveTask();

if (!activeTask) {
  console.log(yellow('\nNema aktivnog zadatka.\n'));
  process.exit(0);
}

const endedAt = new Date().toISOString();
const durationMs = new Date(endedAt) - new Date(activeTask.startedAt);
const durationMin = Math.round(durationMs / 60000);

const todayLogs = storage.getTodayLogs().filter(e => e.taskId === activeTask.id);
const totalTimeSaved = todayLogs.reduce((sum, e) => sum + (e.timeSaved || 0), 0);
const aiInteractions = todayLogs.length;

const completedTask = {
  ...activeTask,
  endedAt,
  durationMin,
  aiInteractions,
  totalTimeSaved,
};

storage.saveCompletedTask(completedTask);
storage.clearActiveTask();

console.log(`\n${green('■')} ${bold('Zadatak završen!')}`);
console.log(`  ${dim('Naziv:')}          ${bold(activeTask.name)}`);
console.log(`  ${dim('Trajanje:')}       ${green(durationMin + ' min')}`);
console.log(`  ${dim('AI interakcije:')} ${green(String(aiInteractions))}`);
console.log(`  ${dim('Ušteđeno:')}       ${green(totalTimeSaved + ' min')}\n`);
