(async ()=>{
  const base = 'http://localhost:3000';
  const hdr = { 'Content-Type': 'application/json' };
  try {
    console.log('CREATE');
    let res = await fetch(`${base}/api/projects`, { method: 'POST', headers: hdr, body: JSON.stringify({ slug: 'test-slug-copilot', title: 'Test Project from Copilot' }) });
    const created = await res.json();
    console.log(JSON.stringify(created, null, 2));

    console.log('\nLIST AFTER CREATE');
    res = await fetch(`${base}/api/projects`);
    let list = await res.json();
    console.log(JSON.stringify(list, null, 2));

    console.log('\nUPDATE');
    const id = created.id;
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
    console.error('E2E ERROR', err);
    process.exit(1);
  }
})();
