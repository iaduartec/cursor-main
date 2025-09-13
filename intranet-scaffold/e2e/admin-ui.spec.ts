import { test, expect } from '@playwright/test';

test('admin UI CRUD flow', async ({ page }) => {
  const uid = Date.now();
  const slug = `pw-test-${uid}`;
  const title = `PW Test Title ${uid}`;
  const titleUpdated = `PW Test Title Updated ${uid}`;

  await page.goto('/admin/projects', { waitUntil: 'networkidle' });

  // wait until form inputs are enabled (avoid race with initial loading state)
  await page.waitForSelector('input[placeholder="demo-slug"]:not([disabled])', { timeout: 10000 });

  // create
  await page.fill('input[placeholder="demo-slug"]', slug);
  await page.fill('input[placeholder="Demo Project"]', title);
  // click create and wait for the POST response so we can assert status
  const [postResp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/projects') && r.request().method() === 'POST', { timeout: 10000 }),
    page.click('button:has-text("Crear proyecto")'),
  ]);
  const status = postResp.status();
  const bodyText = await postResp.text();
  console.log('POST /api/projects status=', status, 'body=', bodyText);
  // expect created
  if (status !== 201) throw new Error(`Unexpected POST status ${status}: ${bodyText}`);
  await page.waitForSelector(`text=${title}`);
  await expect(page.locator(`text=${title}`)).toHaveCount(1);

  // edit: find the item's Edit button within the row that contains the title
  const row = page.locator('li', { hasText: title }).first();
  await expect(row).toBeVisible();
  await row.locator('button:has-text("Editar")').click();
  await page.fill('input[placeholder="Demo Project"]', titleUpdated);
  await page.click('button:has-text("Actualizar proyecto")');
  await page.waitForSelector(`text=${titleUpdated}`);
  await expect(page.locator(`text=${titleUpdated}`)).toHaveCount(1);

  // delete via modal: click Delete for the specific row, then confirm in modal
  const rowUpdated = page.locator('li', { hasText: titleUpdated }).first();
  await expect(rowUpdated).toBeVisible();
  await rowUpdated.locator('button:has-text("Borrar")').click();
  // Click the modal's Borrar button (modal visible)
  const modal = page.locator('text=Confirmar borrado').first();
  await expect(modal).toBeVisible();
  await modal.locator('button:has-text("Borrar")').click();
  // confirm the item is gone
  await expect(page.locator(`text=${titleUpdated}`)).toHaveCount(0);
});
