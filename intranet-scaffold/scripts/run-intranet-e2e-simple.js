const { spawn } = require('child_process');
const { once } = require('events');
const path = require('path');
const fs = require('fs');

async function main() {
    const nextBin = require.resolve('next/dist/bin/next');
    const cwd = path.resolve(__dirname, '..');
    const env = Object.assign({}, process.env, {
        USE_IN_MEMORY_DB: process.env.USE_IN_MEMORY_DB || '1',
        SKIP_CONTENTLAYER: process.env.SKIP_CONTENTLAYER || '1',
        INTRANET_DEBUG_TOKEN: process.env.INTRANET_DEBUG_TOKEN || 'test-token-123',
    });

    console.log('Spawning next from', nextBin);
    const child = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', '3000'], {
        cwd,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    let readySignal = false;
    child.stdout.on('data', (d) => {
        process.stdout.write('[next] ' + d);
        if (!readySignal && /Ready/.test(d)) readySignal = true;
    });
    child.stderr.on('data', (d) => process.stderr.write('[next-err] ' + d));

    // wait up to 40s for Ready
    const start = Date.now();
    while (!readySignal && Date.now() - start < 40000) {
        await new Promise((r) => setTimeout(r, 500));
    }
    if (!readySignal) {
        console.error('Next did not signal Ready within timeout');
        child.kill();
        process.exit(2);
    }

    // poll readiness endpoint
    const maxPoll = 60;
    let ok = false;
    for (let i = 0; i < maxPoll; i++) {
        try {
            const r = await fetch('http://127.0.0.1:3000/api/_debug/ready');
            console.log('ready status', r.status);
            const txt = await r.text();
            console.log('ready body', txt);
            if (r.ok) { ok = true; break; }
        } catch (e) {
            // ignore
        }
        await new Promise((r) => setTimeout(r, 1000));
    }

    if (!ok) {
        console.error('Readiness endpoint did not return ok');
        child.kill();
        process.exit(3);
    }

    // perform CRUD
    try {
        const slug = 'e2e-' + Date.now();
        const payload = { slug, title: 'E2E simple test', description: 'auto', hero_image: '' };
        const p = await fetch('http://127.0.0.1:3000/api/projects', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'x-debug-token': env.INTRANET_DEBUG_TOKEN }, body: JSON.stringify(payload)
        });
        console.log('post status', p.status);
        const created = await p.json().catch(() => null);
        console.log('post body', created);
        if (p.status !== 201 || !created || !created.id) throw new Error('POST failed');

        const list = await fetch('http://127.0.0.1:3000/api/projects');
        console.log('list status', list.status);
        const items = await list.json().catch(() => []);
        const found = (items || []).find((x) => x.slug === slug);
        if (!found) throw new Error('Created item not found in list');

        const del = await fetch(`http://127.0.0.1:3000/api/projects/${created.id}`, { method: 'DELETE' });
        console.log('delete status', del.status);
        if (!del.ok) throw new Error('Delete failed');

        console.log('E2E simple flow succeeded');
        child.kill();
        await once(child, 'close');
        process.exit(0);
    } catch (e) {
        console.error('E2E flow error', e);
        child.kill();
        await once(child, 'close');
        process.exit(4);
    }
}

main().catch((e) => { console.error('script error', e); process.exit(1); });
