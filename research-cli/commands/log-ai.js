#!/usr/bin/env node
'use strict';

const storage = require('../lib/storage');
const { bold, green, blue, dim, red } = require('../lib/colors');

const VALID_CATEGORIES = [
  'code_generation', 'debugging', 'testing', 'documentation',
  'code_review', 'optimization', 'learning', 'infra_setup', 'api_design', 'other',
];

// Poznati AI agenti — prihvata se bilo koji string, ovo je samo za autocomplete/upozorenje
const KNOWN_TOOLS = [
  'copilot',      // GitHub Copilot
  'claude_code',  // Claude (Anthropic)
  'chatgpt',      // ChatGPT
  'cursor',       // Cursor AI
  'gemini',       // Google Gemini
  'windsurf',     // Windsurf / Codeium
  'tabnine',      // TabNine
  'other',        // ostali
];

const VALID_PROJECTS = ['backend', 'frontend', 'infra', 'testing', 'other'];

function parseArgs() {
  const result = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const m = args[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (m) result[m[1]] = m[2] !== undefined ? m[2] : args[++i];
  }
  return result;
}

const args = parseArgs();
const tool = args['tool'];
const category = args['category'];
const project = args['project'] || null;
const notes = args['notes'] || null;
const taskArg = args['task'] || null;
const promptArg = args['prompt'] || null; // originalni prompt poslan AI agentu
const duration = args['duration'] ? parseInt(args['duration'], 10) : null;

// time-saved je opcionalan — default po kategoriji ako nije naveden
const CATEGORY_DEFAULTS = {
  code_generation: 20, debugging: 30, testing: 20, documentation: 10,
  code_review: 15, optimization: 20, learning: 10, infra_setup: 30,
  api_design: 20, other: 10,
};
const timeSaved = args['time-saved'] ? parseInt(args['time-saved'], 10) : (CATEGORY_DEFAULTS[category] || 10);

if (!tool || !category) {
  console.error(red('Greška: --tool i --category su obavezni.'));
  console.error('Upotreba: node log-ai.js --tool=ALAT --category=KATEGORIJA [--time-saved=MINUTE] [--task="opis"] [--prompt="originalni prompt"]');
  console.error('Poznati alati: ' + KNOWN_TOOLS.join(', '));
  console.error('Kategorije: ' + VALID_CATEGORIES.join(', '));
  process.exit(1);
}

if (!KNOWN_TOOLS.includes(tool)) {
  // Soft upozorenje — ne blokira, ali bilježi nepoznati alat
  process.stderr.write(`Upozorenje: nepoznati alat "${tool}" — bit će zabilježen kao-jest.\n`);
}

if (!VALID_CATEGORIES.includes(category)) {
  console.error(red(`Neispravna kategorija: "${category}"`));
  console.error('Dostupne kategorije: ' + VALID_CATEGORIES.join(', '));
  process.exit(1);
}

if (project && !VALID_PROJECTS.includes(project)) {
  console.error(red(`Neispravni projekt: "${project}"`));
  console.error('Dostupni: ' + VALID_PROJECTS.join(', '));
  process.exit(1);
}

const activeTask = storage.getActiveTask();

// task ime: prvo --task argument, pa aktivni zadatak, pa null
const resolvedTaskName = taskArg || (activeTask ? activeTask.name : null);

const entry = {
  timestamp: new Date().toISOString(),
  tool,
  category,
  timeSaved,
  ...(duration !== null && { duration }),
  taskId: activeTask ? activeTask.id : null,
  taskName: resolvedTaskName,
  ...(promptArg && { prompt: promptArg }),
  ...(project && { project }),
  ...(notes && { notes }),
};

storage.appendLog(entry);

console.log(`\n${green('✓')} ${bold('AI interakcija zabilježena!')}`);
console.log(`  ${dim('Alat:')}       ${blue(tool)}`);
console.log(`  ${dim('Kategorija:')} ${blue(category)}`);
if (duration !== null) console.log(`  ${dim('Trajanje:')}   ${blue(duration + ' min')}`);
console.log(`  ${dim('Ušteđeno:')}   ${green(timeSaved + ' min')}`);
if (project) console.log(`  ${dim('Projekt:')}    ${blue(project)}`);
if (notes)   console.log(`  ${dim('Napomena:')}   ${dim(notes)}`);
if (activeTask) console.log(`  ${dim('Zadatak:')}    ${dim(resolvedTaskName)}`);
  else if (resolvedTaskName) console.log(`  ${dim('Zadatak:')}    ${dim(resolvedTaskName)}`);
if (promptArg) console.log(`  ${dim('Prompt:')}     ${dim(promptArg.length > 80 ? promptArg.slice(0, 80) + '...' : promptArg)}`);
console.log(`  ${dim('Vrijeme:')}    ${dim(new Date().toLocaleString())}\n`);
