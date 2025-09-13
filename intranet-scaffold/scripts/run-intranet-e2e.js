#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
// Use global fetch (Node 18+/22). If not available, throw a helpful error.
if (typeof fetch !== 'function') {
  throw new Error('Global fetch is not available in this Node runtime. Please use Node 18+ or install a fetch polyfill.');
}

async function waitForServer(base='http://127.0.0.1:3000', timeoutMs=60000) {
  const start = Date.now();
  let attempt = 0;
  while (Date.now() - start < timeoutMs) {
    attempt++;
    try {
      const res = await fetch(`${base}/api/projects`);
      if (res.ok) {
        console.log('server ready after', attempt, 'attempts');
        return true;
      }
      console.log('waitForServer: got', res.status);
    } catch (e) {
      if (attempt % 5 === 0) console.log('waitForServer attempt', attempt, 'failed', e && e.message);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Server did not respond within timeout');
}

(async ()=>{
  const cwd = path.resolve(__dirname, '..');
  console.log('Starting Next dev in', cwd);
  const env = Object.assign({}, process.env, { CONTENTLAYER_SKIP_TYPEGEN: '1', CONTENTLAYER_HIDE_WARNING: '1', SKIP_CONTENTLAYER: '1' });
  // Ensure the runner picks up the same PORT (default 3000) so e2e-crud targets the correct base URL
  env.PORT = env.PORT || '3000';
  const dev = spawn('pnpm', ['dev'], { cwd, stdio: 'inherit', env });

  // wait for server (fast check first: 10s)
  try {
  await waitForServer('http://127.0.0.1:3000', 15000);
  } catch (e) {
    console.warn('Initial wait failed:', e && e.message, '- attempting recovery');
    try { dev.kill('SIGINT'); } catch (er) {}
    // remove .next to force fresh build
    const fs = require('fs');
    const nextDir = require('path').join(cwd, '.next');
    try {
      if (fs.existsSync(nextDir)) {
        console.log('Removing .next to recover build...');
        fs.rmSync(nextDir, { recursive: true, force: true });
      }
    } catch (rmErr) { console.warn('Failed to remove .next', rmErr && rmErr.message); }

    // restart dev and wait longer
    console.log('Restarting dev server and waiting up to 60s...');
    const dev2 = spawn('pnpm', ['dev'], { cwd, stdio: 'inherit', env });
    try {
      await waitForServer('http://127.0.0.1:3000', 60000);
      // replace dev handle for shutdown later
      dev.kill && dev.kill('SIGINT');
      // use dev2 for shutdown
      dev = dev2; // eslint-disable-line no-param-reassign
    } catch (e2) {
      console.error('Recovery failed:', e2 && e2.message);
      try { dev2.kill('SIGINT'); } catch (er) {}
      process.exit(1);
    }
  }

  // run e2e
  console.log('Running E2E script...');
  const runner = spawn(process.execPath, [path.join(cwd, 'scripts', 'e2e-crud.js')], { cwd, stdio: 'inherit', env });
  runner.on('close', (code) => {
    console.log('E2E script finished with code', code);
    // shutdown dev
    try { dev.kill('SIGINT'); } catch (e) {}
    process.exit(code === 0 ? 0 : 1);
  });
})();
