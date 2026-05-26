import { test, expect } from '@playwright/test';

test('hero renders and lang toggle switches locale', async ({ page }) => {
  await page.goto('/de');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText('AI Performance Coach', { exact: false }).first()).toBeVisible();
});

test('partner gym form validates empty submit', async ({ page }) => {
  await page.goto('/de');
  await page.getByRole('link', { name: /Partner Gym/i }).first().click();
  await page.getByRole('button', { name: /Bewerbung senden|Send application/i }).click();
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
});
