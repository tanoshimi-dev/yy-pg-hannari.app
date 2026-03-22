import { Page } from '@playwright/test';

export async function mockLogin(page: Page) {
  // Set a test JWT token in localStorage before navigating
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('token', 'test-jwt-token');
  });
}
