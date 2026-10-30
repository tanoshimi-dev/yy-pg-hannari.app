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

    // Do not actually leave for Google: stop at the backend auth endpoint
    await page.route('**/auth/google', (route) => route.abort());

    const [request] = await Promise.all([
      page.waitForRequest((req) => new URL(req.url()).pathname === '/auth/google'),
      page.getByRole('button', { name: /google/i }).click(),
    ]);
    expect(new URL(request.url()).port).toBe('3000');
  });

  test('backend should redirect to Google OAuth with the callback URL', async ({ request }) => {
    const res = await request.get('http://localhost:3000/auth/google', { maxRedirects: 0 });
    expect(res.status()).toBe(302);

    const location = new URL(res.headers()['location']);
    expect(location.host).toBe('accounts.google.com');
    expect(location.searchParams.get('response_type')).toBe('code');
    expect(location.searchParams.get('redirect_uri')).toMatch(/\/auth\/google\/callback$/);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/contents');
    await expect(page).toHaveURL(/\/login$/);
  });
});
