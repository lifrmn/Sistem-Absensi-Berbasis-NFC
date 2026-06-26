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

test('mahasiswa can tap nfc and return to dashboard', async ({ page }) => {
  await page.goto('/');

  const startButton = page.getByRole('button', { name: /mulai|start/i });
  if (await startButton.count()) {
    await startButton.first().click();
  }

  await page.getByLabel(/username|nim/i).fill('a001');
  await page.getByLabel(/password/i).fill('Mahasiswa@12345');
  await page.getByRole('button', { name: /masuk/i }).click();

  await expect(page.getByRole('button', { name: /tap nfc sekarang|sudah absen hari ini/i })).toBeVisible();

  const tapButton = page.getByRole('button', { name: /tap nfc sekarang/i });
  if (await tapButton.isVisible()) {
    await tapButton.click();
    await expect(page.getByText(/mendeteksi nfc/i)).toBeVisible();
    await expect(page.getByText(/nfc berhasil terbaca/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sudah absen hari ini/i })).toBeVisible({ timeout: 10000 });
  }
});
