import { test, expect } from './helpers/auth';

test.describe('Contents Page', () => {
  test('should display a list of contents', async ({ page, user: _user }) => {
    await page.goto('/contents');

    await expect(page.getByRole('heading', { name: 'コンテンツ一覧' })).toBeVisible();
    await expect(page.locator('.category-section').first()).toBeVisible({ timeout: 10000 });
    expect(await page.locator('.content-card').count()).toBeGreaterThan(0);
  });

  test('should display title and description on content cards', async ({ page, user: _user }) => {
    await page.goto('/contents');

    const firstCard = page.locator('.content-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await expect(firstCard.locator('.card-title')).not.toBeEmpty();
    await expect(firstCard.locator('.card-description')).not.toBeEmpty();
    // A new user has not started anything yet
    await expect(firstCard.locator('.status-badge')).toHaveText('NEW');
  });

  test('should navigate to content detail page when clicking a card', async ({ page, user: _user }) => {
    await page.goto('/contents');

    const firstCard = page.locator('.content-card').first();
    const title = await firstCard.locator('.card-title').textContent();
    await firstCard.click();

    await expect(page).toHaveURL(/\/contents\/[0-9a-f-]{36}$/);
    await expect(page.getByRole('heading', { name: title!.trim() }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'クイズをはじめる' })).toBeVisible();
  });

  test('should render lesson images from the media endpoint', async ({ page, user: _user }) => {
    await page.goto('/contents');
    await page.locator('.content-card', { hasText: 'GAS' }).first().click();

    const image = page.locator('.image-wrapper img').first();
    await expect(image).toBeVisible({ timeout: 10000 });
    await expect(image).toHaveAttribute('src', /\/media\/[^/]+\/assets\//);
    expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });
});
