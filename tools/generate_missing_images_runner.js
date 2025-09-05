#!/usr/bin/env node
// Lightweight wrapper to run the Python placeholder generator when available.
// On environments without Python (e.g., Vercel build), it logs a warning and exits 0.

const { spawnSync } = require('child_process');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const repoRoot = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const scriptPath = path.join(repoRoot, 'tools', 'generate_missing_images.py');

// Default args if none provided
const userArgs = process.argv.slice(2);
const defaultArgs = ['--only-missing', '--min-bytes', '1000'];
const args = [scriptPath, ...(userArgs.length ? userArgs : defaultArgs)];

function tryRun(interpreter) {
  try {
    const res = spawnSync(interpreter, args, { stdio: 'inherit' });
    if (res.error && res.error.code === 'ENOENT') return { ran: false };
    // Non-zero exit: on Vercel, do not fail the build; otherwise bubble up
    if (typeof res.status === 'number' && res.status !== 0) {
      const msg = `generate_missing_images failed with code ${res.status} using ${interpreter}`;
      if (isVercel) {
        console.warn(`[WARN] ${msg} — skipping on Vercel.`);
        return { ran: true, skipped: true };
      }
      process.exit(res.status);
    }
    return { ran: true };
  } catch (e) {
    if (e && e.code === 'ENOENT') return { ran: false };
    // Any other unexpected error: do not break Vercel builds
    console.warn(`[WARN] Unexpected error running ${interpreter}: ${e && e.message}`);
    if (!isVercel) process.exit(1);
    return { ran: false, skipped: true };
  }
}

let result = tryRun('python');
if (!result.ran) result = tryRun('python3');

if (!result.ran) {
  console.warn('[WARN] Python not found. Skipping placeholder generation.');
}

process.exit(0);

