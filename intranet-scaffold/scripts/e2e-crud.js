// Better diagnostics: log unhandled errors
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});

(async () => {
  // Allow overriding the target base URL via env vars for flexibility in CI/local
  const envBase = process.env.BASE_URL;
  const envPort = process.env.PORT || process.env.E2E_PORT;
  const base = envBase || `http://127.0.0.1:${envPort || 3005}`;
  const hdr = { 'Content-Type': 'application/json' };

  // wait-for helper: try GET /api/projects until it responds or timeout
  async function waitForServer(ms = 10000) {
    const start = Date.now();
    let attempt = 0;
    while (Date.now() - start < ms) {
      attempt++;
      try {
        const r = await fetch(`${base}/api/projects`);
        if (r.ok) {
          console.log(`server ready after ${attempt} attempt(s)`);
          return true;
        }
        console.log(`waitForServer: got ${r.status}`);
      } catch (e) {
        // log each attempt to help debug connection issues
        if (attempt % 4 === 0) {console.log(`waitForServer: attempt ${attempt} failed: ${e && e.message ? e.message : e}`);}
      }
      await new Promise(res => setTimeout(res, 500));
    }
    throw new Error('Server did not respond within timeout');
  }

  try {
  console.log('Waiting for server...');
  await waitForServer(30000);
    console.log('CREATE');
    let res = await fetch(`${base}/api/projects`, { method: 'POST', headers: hdr, body: JSON.stringify({ slug: 'test-slug-copilot', title: 'Test Project from Copilot' }) });
    const created = await res.json();
    console.log(JSON.stringify(created, null, 2));

    console.log('\nLIST AFTER CREATE');
    res = await fetch(`${base}/api/projects`);
    let list = await res.json();
    console.log(JSON.stringify(list, null, 2));

    console.log('\nUPDATE');
    const {id} = created;
    res = await fetch(`${base}/api/projects/${id}`, { method: 'PUT', headers: hdr, body: JSON.stringify({ slug: 'test-slug-copilot-upd', title: 'Updated Title' }) });
    const updated = await res.json();
    console.log(JSON.stringify(updated, null, 2));

    console.log('\nLIST AFTER UPDATE');
    res = await fetch(`${base}/api/projects`);
    list = await res.json();
    console.log(JSON.stringify(list, null, 2));

    console.log('\nDELETE');
    res = await fetch(`${base}/api/projects/${id}`, { method: 'DELETE' });
    try { console.log(await res.json()); } catch (e) { console.log(await res.text()); }

    console.log('\nLIST AFTER DELETE');
    res = await fetch(`${base}/api/projects`);
    list = await res.json();
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('E2E ERROR', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
