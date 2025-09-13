const { spawn } = require('child_process');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

async function waitForReady(url, token, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { headers: { 'x-debug-token': token } });
      const json = await res.json();
      if (json && json.ready) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Timeout waiting for server ready');
}

async function run() {
  const scaffoldDir = path.resolve(__dirname, '..');
  console.log('Starting Next dev in', scaffoldDir);
  const child = spawn('pnpm', ['dev'], {
    cwd: scaffoldDir,
    env: { ...process.env, USE_IN_MEMORY_DB: '1', INTRANET_DEBUG_TOKEN: 'test-token' },
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  child.stdout.on('data', d => process.stdout.write(`[dev] ${d}`));
  child.stderr.on('data', d => process.stderr.write(`[dev] ${d}`));

  try {
    await waitForReady('http://localhost:3000/api/_debug/ready', 'test-token', 60000);
    console.log('Server ready — running Playwright scenario');

    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const uid = Date.now();
    const slug = `pw-test-${uid}`;
    const title = `PW Test Title ${uid}`;
    const titleUpdated = `PW Test Title Updated ${uid}`;

    await page.goto('http://localhost:3000/admin/projects', { waitUntil: 'load' });
    await page.fill('input[placeholder="demo-slug"]', slug);
    await page.fill('input[placeholder="Demo Project"]', title);
    await page.click('button:has-text("Crear proyecto")');
    await page.waitForSelector(`text=${title}`);

    const row = page.locator('li', { hasText: title }).first();
    await row.locator('button:has-text("Editar")').click();
    await page.fill('input[placeholder="Demo Project"]', titleUpdated);
    await page.click('button:has-text("Actualizar proyecto")');
    await page.waitForSelector(`text=${titleUpdated}`);

    const rowUpdated = page.locator('li', { hasText: titleUpdated }).first();
    await rowUpdated.locator('button:has-text("Borrar")').click();
    // modal
    await page.waitForSelector('text=Confirmar borrado');
    await page.click('text=Confirmar borrado >> button:has-text("Borrar")');
    // ensure deleted
    await page.waitForTimeout(500);
    const count = await page.locator(`text=${titleUpdated}`).count();
    if (count !== 0) throw new Error('Item not deleted');

    await browser.close();
    console.log('E2E flow completed successfully');
    child.kill();
    process.exit(0);
  } catch (err) {
    console.error('E2E failed:', err);
    child.kill();
    process.exit(1);
  }
}

run();
