#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { bold, green, yellow, dim } = require('../lib/colors');

const envFile = path.resolve(__dirname, '../../.env');

let content = '';
if (fs.existsSync(envFile)) {
  content = fs.readFileSync(envFile, 'utf8');
}

if (/^RESEARCH_MODE\s*=/m.test(content)) {
  content = content.replace(/^RESEARCH_MODE\s*=.*/m, 'RESEARCH_MODE=active');
} else {
  content = content.trimEnd() + (content ? '\n' : '') + 'RESEARCH_MODE=active\n';
}

fs.writeFileSync(envFile, content, 'utf8');

console.log(`\n${green('✓')} ${bold('Research agent aktiviran!')}`);
console.log(`  ${dim('RESEARCH_MODE=active je postavljen u .env')}\n`);
