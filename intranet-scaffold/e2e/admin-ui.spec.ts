import { test, expect } from '@playwright/test';

test('admin UI CRUD flow', async ({ page }) => {
  const uid = Date.now();
  const slug = `pw-test-${uid}`;
  const title = `PW Test Title ${uid}`;
  const titleUpdated = `PW Test Title Updated ${uid}`;

  await page.goto('/admin/projects');

  // create
  await page.fill('input[placeholder="demo-slug"]', slug);
  await page.fill('input[placeholder="Demo Project"]', title);
  await page.click('button:has-text("Crear proyecto")');
  await page.waitForSelector(`text=${title}`);
  await expect(page.locator(`text=${title}`)).toHaveCount(1);

  // edit: find the item's Edit button within the row that contains the title
  const row = page.locator(`:scope >> text=${title}`).first().locator('..').first();
  await row.locator('button:has-text("Editar")').click();
  await page.fill('input[placeholder="Demo Project"]', titleUpdated);
  await page.click('button:has-text("Actualizar proyecto")');
  await page.waitForSelector(`text=${titleUpdated}`);
  await expect(page.locator(`text=${titleUpdated}`)).toHaveCount(1);

  // delete via modal: click Delete for the specific row, then confirm in modal
  const rowUpdated = page.locator(`:scope >> text=${titleUpdated}`).first().locator('..').first();
  await rowUpdated.locator('button:has-text("Borrar")').click();
  // Click the modal's Borrar button (the modal contains the text 'Confirmar borrado')
  await page.click('button:has-text("Borrar")', { timeout: 5000 });
  // confirm the item is gone
  await expect(page.locator(`text=${titleUpdated}`)).toHaveCount(0);
});
