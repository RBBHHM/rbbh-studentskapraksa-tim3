'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../.research');
const LOGS_DIR = path.join(ROOT, 'logs');
const TASKS_DIR = path.join(ROOT, 'tasks');
const COMPLETED_DIR = path.join(TASKS_DIR, 'completed');
const LOG_FILE = path.join(LOGS_DIR, 'ai-interactions.jsonl');
const ACTIVE_TASK_FILE = path.join(TASKS_DIR, 'active-task.json');

function ensureDirs() {
  [ROOT, LOGS_DIR, TASKS_DIR, COMPLETED_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function appendLog(entry) {
  ensureDirs();
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
}

function readLogs() {
  ensureDirs();
  if (!fs.existsSync(LOG_FILE)) return [];
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  return content.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
}

function getTodayLogs() {
  const today = new Date().toISOString().split('T')[0];
  return readLogs().filter(e => e.timestamp.startsWith(today));
}

function getActiveTask() {
  if (!fs.existsSync(ACTIVE_TASK_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(ACTIVE_TASK_FILE, 'utf8')); }
  catch { return null; }
}

function setActiveTask(task) {
  ensureDirs();
  fs.writeFileSync(ACTIVE_TASK_FILE, JSON.stringify(task, null, 2), 'utf8');
}

function clearActiveTask() {
  if (fs.existsSync(ACTIVE_TASK_FILE)) fs.unlinkSync(ACTIVE_TASK_FILE);
}

function saveCompletedTask(task) {
  ensureDirs();
  const date = new Date().toISOString().split('T')[0];
  const safeName = (task.name || 'task').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 40);
  const file = path.join(COMPLETED_DIR, `${date}-${safeName}.json`);
  fs.writeFileSync(file, JSON.stringify(task, null, 2), 'utf8');
}

function readCompletedTasks() {
  ensureDirs();
  if (!fs.existsSync(COMPLETED_DIR)) return [];
  return fs.readdirSync(COMPLETED_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(COMPLETED_DIR, f), 'utf8')); }
      catch { return null; }
    })
    .filter(Boolean);
}

module.exports = {
  appendLog, readLogs, getTodayLogs,
  getActiveTask, setActiveTask, clearActiveTask,
  saveCompletedTask, readCompletedTasks,
  ACTIVE_TASK_FILE, LOG_FILE,
};
