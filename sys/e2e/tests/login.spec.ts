import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display the login page', async ({ page }) => {
    await page.goto('/login');

    // Verify login page is rendered
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show Google login button', async ({ page }) => {
    await page.goto('/login');

    // Find a button or link related to Google login
    const googleButton = page.getByRole('button', { name: /google/i }).or(
      page.getByRole('link', { name: /google/i })
    );
    await expect(googleButton).toBeVisible();
  });

  test('should redirect to Google OAuth when clicking login', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.getByRole('button', { name: /google/i }).or(
      page.getByRole('link', { name: /google/i })
    );

    // Listen for navigation to Google OAuth
    const [response] = await Promise.all([
      page.waitForEvent('popup').catch(() => null),
      page.waitForURL(/accounts\.google\.com|localhost:3000\/auth\/google/, { timeout: 5000 }).catch(() => null),
      googleButton.click(),
    ]);

    // Verify the URL changed to Google OAuth or the backend auth endpoint
    const currentUrl = page.url();
    const isRedirected =
      currentUrl.includes('accounts.google.com') ||
      currentUrl.includes('/auth/google') ||
      (response && response.url().includes('accounts.google.com'));

    expect(isRedirected).toBeTruthy();
  });
});
