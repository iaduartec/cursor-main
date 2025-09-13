import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const cwd = path.resolve(__dirname, '../../intranet-scaffold');

export default async function globalSetup() {
  // Ensure tests run against the in-memory DB by default
  process.env.USE_IN_MEMORY_DB = '1';
  process.env.SKIP_CONTENTLAYER = '1';

  // Start Next dev as a child process so Playwright can hit the running server
  const nextBin = path.resolve(cwd, 'node_modules/.bin/next');
  const child = spawn(nextBin, ['dev'], { cwd, env: process.env, stdio: 'inherit', shell: true });

  // Store PID so teardown can kill it
  fs.writeFileSync(path.resolve(cwd, '.playwright-dev.pid'), String(child.pid));

  // Wait for readiness endpoint with retries
  const max = 30;
  for (let i = 0; i < max; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/_debug/ready');
      if (res.ok) {
        return;
      }
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Dev server did not become ready in time');
}
