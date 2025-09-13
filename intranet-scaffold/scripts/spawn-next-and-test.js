const { spawn } = require('child_process');
const { once } = require('events');

async function main() {
  try {
    const nextBin = require.resolve('next/dist/bin/next');
    const env = Object.assign({}, process.env, {
      USE_IN_MEMORY_DB: '1',
      INTRANET_DEBUG_TOKEN: 'test-token-123',
      SKIP_CONTENTLAYER: '1',
    });

    console.log('Spawning next from', nextBin);
    const child = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', '3000'], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    let ready = false;
    child.stdout.on('data', (d) => {
      process.stdout.write(`[next] ${  d}`);
      if (!ready && /Ready/.test(d)) {
        ready = true;
      }
    });
    child.stderr.on('data', (d) => process.stderr.write(`[next-err] ${  d}`));

    // Wait up to 40s for Ready
    const start = Date.now();
    while (!ready && Date.now() - start < 40000) {
      await new Promise((r) => setTimeout(r, 500));
    }

    if (!ready) {
      console.error('Next did not signal Ready within timeout');
      child.kill();
      process.exit(2);
    }

    // perform requests
    try {
      const r = await fetch('http://127.0.0.1:3000/api/_debug/ready');
      console.log('ready status', r.status);
      console.log('ready body', await r.text());
    } catch (e) {
      console.error('GET /api/_debug/ready failed', e);
    }

    try {
      const payload = { slug: `spawn-test-${  Date.now()}`, title: 'Spawn test' };
      const p = await fetch('http://127.0.0.1:3000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-debug-token': 'test-token-123' },
        body: JSON.stringify(payload),
      });
      console.log('post status', p.status);
      try { console.log('post body', await p.text()); } catch(e){}
    } catch (e) {
      console.error('POST /api/projects failed', e);
    }

    // kill next child
    child.kill();
    await once(child, 'close');
    process.exit(0);
  } catch (err) {
    console.error('script error', err);
    process.exit(1);
  }
}

main();
