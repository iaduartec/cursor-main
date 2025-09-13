import { test, expect } from '@playwright/test';

test('admin UI CRUD flow', async ({ page }) => {
  // assume dev server running at http://localhost:3000 and token exposed
  await page.goto('http://localhost:3000/admin/projects');

  // create
  await page.fill('input[placeholder="demo-slug"]', 'pw-test-slug');
  await page.fill('input[placeholder="Demo Project"]', 'PW Test Title');
  await page.click('button:has-text("Crear proyecto")');
  await page.waitForSelector('text=PW Test Title');
  const created = await page.locator('text=PW Test Title').first().innerText();
  expect(created).toContain('PW Test Title');

  // edit
  await page.click('button:has-text("Editar")');
  await page.fill('input[placeholder="Demo Project"]', 'PW Test Title Updated');
  await page.click('button:has-text("Actualizar proyecto")');
  await page.waitForSelector('text=PW Test Title Updated');

  // delete via modal
  await page.click('button:has-text("Borrar")');
  await page.click('button:has-text("Borrar")', { strict: false });
  await page.waitForTimeout(500); // small wait for deletion
  await expect(page.locator('text=PW Test Title Updated')).toHaveCount(0);
});
