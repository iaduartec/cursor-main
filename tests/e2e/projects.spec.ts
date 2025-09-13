import { test, expect } from '@playwright/test';

test('projects CRUD via API (in-memory)', async ({ request }) => {
  // Wait for readiness explicitly with retries to avoid compilation race
  const max = 30; // seconds
  let ready;
  for (let i = 0; i < max; i++) {
    ready = await request.get('/api/_debug/ready');
    if (ready.ok()) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  expect(ready && ready.ok()).toBeTruthy();

  // Create a project
  const slug = `pwtest-${Date.now()}`;
  const res = await request.post('/api/projects', {
    headers: { 'Content-Type': 'application/json', 'x-debug-token': 'test-token-123' },
    data: { slug, title: 'Playwright test', description: 'e2e', hero_image: '' },
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.slug).toBe(slug);
  expect(body.id).toBeTruthy();

  // Read back list and find it
  const list = await request.get('/api/projects');
  expect(list.ok()).toBeTruthy();
  const items = await list.json();
  const found = items.find((p: any) => p.slug === slug);
  expect(found).toBeTruthy();

  // Delete the created project
  const del = await request.fetch(`/api/projects/${body.id}`, { method: 'DELETE' });
  expect(del.ok()).toBeTruthy();
});
