import { test, expect } from '@playwright/test';

test('hero renders and lang toggle switches locale', async ({ page }) => {
  await page.goto('/de');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText('AI Performance Coach', { exact: false }).first()).toBeVisible();
});

test('contact form validates empty submit', async ({ page }) => {
  await page.goto('/de');
  // Contact form lives in its own section; submit empty to trigger validation.
  await page.getByRole('button', { name: /Nachricht senden|Send Message/i }).click();
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
});
