/**
Resumen generado automáticamente.

intranet-scaffold/scripts/run-intranet-e2e.js

2025-09-13T06:20:07.377Z

——————————————————————————————
Archivo .js: run-intranet-e2e.js
Tamaño: 4021 caracteres, 103 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// (Shebang removed; script executed via `node` to avoid TS 18026 warning when analyzed)
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

  // If a .env.local exists in the repo root, load and merge it so child processes inherit DB params.
  try {
    const fs = require('fs');
    const dotenv = require('dotenv');
    const repoRootEnv = require('path').join(cwd, '..', '.env.local');
    if (fs.existsSync(repoRootEnv)) {
      const parsed = dotenv.parse(fs.readFileSync(repoRootEnv));
      for (const k of Object.keys(parsed)) {
        if (typeof env[k] === 'undefined') env[k] = parsed[k];
      }
      console.log('Merged vars from .env.local into orchestrator env');
    }
  } catch (e) {
    console.warn('Failed to load .env.local:', e && e.message ? e.message : e);
  }

  // If a real DB URL is present, prefer it; otherwise enable in-memory DB for local E2E.
  const hasDbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL || env.POSTGRES_URL;
  if (!hasDbUrl) {
    env.USE_IN_MEMORY_DB = env.USE_IN_MEMORY_DB || '1';
  } else {
    console.log('Database URL detected in environment; running against real DB');
  }
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
