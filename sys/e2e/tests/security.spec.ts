import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

test.describe('Media endpoint', () => {
  test('should serve content assets', async ({ request }) => {
    const res = await request.get(`${API_URL}/media/gas-01-basics/assets/01-gas-editor.png`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  });

  test('should not expose quiz answers or lesson source', async ({ request }) => {
    for (const path of [
      '/media/gas-01-basics/quiz.json',
      '/media/gas-01-basics/lesson.md',
      '/media/categories.json',
    ]) {
      const res = await request.get(`${API_URL}${path}`);
      expect(res.status(), path).toBe(404);
    }
  });

  test('should reject path traversal', async ({ request }) => {
    for (const path of [
      '/media/gas-01-basics/assets/..%2Fquiz.json',
      '/media/..%2Fgas-01-basics/assets/01-gas-editor.png',
      '/media/gas-01-basics/assets/.hidden',
    ]) {
      const res = await request.get(`${API_URL}${path}`);
      expect(res.status(), path).toBe(404);
    }
  });
});

test.describe('Security headers', () => {
  test('backend should send helmet headers', async ({ request }) => {
    const res = await request.get(`${API_URL}/contents/categories`);
    const headers = res.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-powered-by']).toBeUndefined();
  });
});

test.describe('OAuth callback', () => {
  test('should store token from URL fragment and remove it from the URL', async ({ page }) => {
    await page.goto('/auth/callback#token=test-jwt-token');

    await expect(page).not.toHaveURL(/token=/);
    // Invalid token: profile fetch returns 401 and the token is cleared again,
    // so only check that the token was not left in the URL.
  });

  test('should ignore token passed in the query string', async ({ page }) => {
    await page.goto('/auth/callback?token=test-jwt-token');

    await expect(page).toHaveURL(/login/);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
