import { test, expect } from '@playwright/test';
import { mockLogin } from './helpers/auth';

test.describe('Contents Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
  });

  test('should display a list of contents', async ({ page }) => {
    await page.goto('/contents');

    // Wait for the contents list to load
    const contentsList = page.locator('[data-testid="contents-list"]').or(
      page.locator('.contents-list')
    ).or(
      page.getByRole('list')
    );

    await expect(contentsList).toBeVisible({ timeout: 10000 });

    // Verify at least one content item exists
    const contentItems = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    );

    const count = await contentItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display title and description on content cards', async ({ page }) => {
    await page.goto('/contents');

    // Wait for content cards to load
    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Check that the card has a title element
    const title = firstCard.locator('[data-testid="content-title"]').or(
      firstCard.locator('.content-title')
    ).or(
      firstCard.locator('h2, h3, h4')
    );
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Check that the card has a description element
    const description = firstCard.locator('[data-testid="content-description"]').or(
      firstCard.locator('.content-description')
    ).or(
      firstCard.locator('p')
    );
    await expect(description).toBeVisible();
    await expect(description).not.toBeEmpty();
  });

  test('should navigate to content detail page when clicking a card', async ({ page }) => {
    await page.goto('/contents');

    // Wait for and click the first content card
    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Get the content link or clickable element
    const clickable = firstCard.locator('a').first().or(firstCard);
    await clickable.click();

    // Verify navigation to a detail page (URL should contain content ID)
    await expect(page).toHaveURL(/.*contents\/\d+|.*content\/\d+/, { timeout: 5000 });
  });
});
