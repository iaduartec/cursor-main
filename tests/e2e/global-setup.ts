import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = path.resolve(__dirname, '../../intranet-scaffold');
const require = createRequire(import.meta.url);

export default async function globalSetup() {
  // Ensure tests run against the in-memory DB by default
  process.env.USE_IN_MEMORY_DB = '1';
  process.env.SKIP_CONTENTLAYER = '1';

  // Provide a known debug token for endpoints that require it in dev
  process.env.INTRANET_DEBUG_TOKEN = 'test-token-123';

  // Start Next dev as a child process so Playwright can hit the running server
  // Resolve next's actual JS entry in a cross-platform way
  const nextBin = require.resolve('next/dist/bin/next');
  const child = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', '3000'], {
    cwd,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    // don't use shell on Windows to avoid "C:\Program Files" splitting
    shell: false,
  });

  // Store PID so teardown can kill it
  fs.writeFileSync(path.resolve(cwd, '.playwright-dev.pid'), String(child.pid));

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  let signaledReady = false;
  child.stdout.on('data', (d: string) => {
    process.stdout.write(`[next] ${d}`);
    if (!signaledReady && /Ready/.test(d)) {
      signaledReady = true;
    }
  });
  child.stderr.on('data', (_d: string) => process.stderr.write(`[next-err] ${_d}`));

  // Wait up to 40s for Next to emit Ready
  const start = Date.now();
  while (!signaledReady && Date.now() - start < 40000) {
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!signaledReady) {
    child.kill();
    throw new Error('Next did not signal Ready within timeout');
  }

  // After Next signals Ready, poll the readiness endpoint until it returns ok
  const maxPoll = 120; // seconds (increase to allow full compilation)
  for (let i = 0; i < maxPoll; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/_debug/ready');
      if (res.ok) {return;}
      // if not ok, continue polling
    } catch (_e) {
      // ignore network errors while server finalizes
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // If we reach here, server did not expose readiness
  child.kill();
  throw new Error('Dev server did not become ready in time after Ready signal');
}
