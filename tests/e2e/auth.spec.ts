import { expect, test } from '@playwright/test';

test('dosen can login and see dashboard', async ({ page }) => {
  await page.goto('/');

  const startButton = page.getByRole('button', { name: /mulai|start/i });
  if (await startButton.count()) {
    await startButton.first().click();
  }

  await page.getByLabel(/username|nim/i).fill('dosen');
  await page.getByLabel(/password/i).fill('Dosen@12345');
  await page.getByRole('button', { name: /masuk/i }).click();

  await expect(page.getByText(/selamat datang, dosen/i)).toBeVisible();
  await expect(page.getByText(/dashboard monitoring kehadiran/i)).toBeVisible();
});
