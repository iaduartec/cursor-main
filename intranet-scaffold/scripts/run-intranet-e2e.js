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
  const dev = spawn('pnpm', ['dev'], { cwd, stdio: 'inherit', env });

  // wait for server
  try {
    await waitForServer('http://127.0.0.1:3000', 60000);
  } catch (e) {
    console.error('Server did not start:', e && e.message);
    dev.kill('SIGINT');
    process.exit(1);
  }

  // run e2e
  console.log('Running E2E script...');
  const runner = spawn(process.execPath, [path.join(cwd, 'scripts', 'e2e-crud.js')], { cwd, stdio: 'inherit' });
  runner.on('close', (code) => {
    console.log('E2E script finished with code', code);
    // shutdown dev
    try { dev.kill('SIGINT'); } catch (e) {}
    process.exit(code === 0 ? 0 : 1);
  });
})();
