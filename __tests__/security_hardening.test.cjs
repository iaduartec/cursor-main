const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

test('next headers include security hardening', async () => {
  const fileUrl = pathToFileURL(path.join(__dirname, '..', 'next.config.mjs')).href;
  const mod = await import(fileUrl);
  const nextConfig = mod.default;
  const arr = await nextConfig.headers();
  const all = arr.flatMap(e => e.headers);
  const keys = all.map(h => h.key);
  for (const k of [
    'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy',
    'Strict-Transport-Security', 'Cross-Origin-Opener-Policy',
    'Cross-Origin-Resource-Policy', 'Origin-Agent-Cluster'
  ]) {
    assert.ok(keys.includes(k), `Missing header ${k}`);
  }
});

test('sanitizeHtml removes dangerous patterns', async () => {
  const fileUrl = pathToFileURL(path.join(__dirname, '..', 'lib', 'sanitize-html.ts')).href;
  const mod = await import(fileUrl);
  const { sanitizeHtml } = mod;
  const dirty = `<img src="javascript:alert(1)"><a href="data:text/html,alert(1)">x</a><div style="background:url(javascript:1)"></div><iframe srcdoc="<script>1</script>" allow="camera">`;
  const clean = sanitizeHtml(dirty);
  assert.ok(!/javascript:/i.test(clean), 'should remove javascript: URLs');
  assert.ok(!/srcdoc=/i.test(clean), 'should strip srcdoc');
  assert.ok(!/allow=/i.test(clean), 'should strip allow');
});
