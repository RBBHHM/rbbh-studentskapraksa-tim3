#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const storage = require('../lib/storage');
const { bold, green, yellow, dim, red } = require('../lib/colors');

const taskName = process.argv.slice(2).join(' ').trim();

if (!taskName) {
  console.error(red('Greška: naziv zadatka je obavezan.'));
  console.error('Upotreba: node start-task.js "Naziv zadatka"');
  process.exit(1);
}

const existing = storage.getActiveTask();
if (existing) {
  console.log(yellow(`\nUpozorenje: već postoji aktivan zadatak: "${existing.name}"`));
  console.log(dim('Završite ga s: node research-cli/commands/end-task.js\n'));
  process.exit(1);
}

const task = {
  id: crypto.randomBytes(4).toString('hex'),
  name: taskName,
  startedAt: new Date().toISOString(),
};

storage.setActiveTask(task);

console.log(`\n${green('▶')} ${bold('Task tracker pokrenut!')}`);
console.log(`  ${dim('Zadatak:')} ${bold(taskName)}`);
console.log(`  ${dim('ID:')}      ${dim(task.id)}`);
console.log(`  ${dim('Start:')}   ${dim(new Date().toLocaleString())}\n`);
