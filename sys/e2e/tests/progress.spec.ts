import { test, expect } from './helpers/auth';

test.describe('Progress Tracking', () => {
  test('should display progress summary on dashboard', async ({ page, user }) => {
    await page.goto('/');

    await expect(page.locator('.welcome-text .user-name')).toHaveText(user.displayName);
    await expect(page.locator('.stat-card')).toHaveCount(3);
    await expect(page.locator('.stat-contents .stat-value')).toHaveText(/^0 \/ \d+$/);
    await expect(page.locator('.stat-quizzes .stat-value')).toHaveText('0 / 0');
    await expect(page.getByText('まだ学習を始めていません')).toBeVisible();
  });

  test('should update progress after completing content', async ({ page, user: _user }) => {
    await page.goto('/contents');
    const firstCard = page.locator('.content-card').first();
    const title = (await firstCard.locator('.card-title').textContent())!.trim();
    await firstCard.click();

    // Opening the content records progress; then answer the whole quiz
    await page.getByRole('button', { name: 'クイズをはじめる' }).click();
    // Counter shows "1 / 0" until quizzes are loaded
    await expect(page.locator('.choice-btn').first()).toBeVisible();
    const total = Number((await page.locator('.quiz-counter').textContent())!.split('/')[1]);
    for (let i = 0; i < total; i++) {
      await page.locator('.choice-btn').first().click();
      await page.locator('.next-btn').click();
    }
    await expect(page).toHaveURL(/\/quiz-result$/);

    await page.getByRole('button', { name: 'ダッシュボードへ' }).click();

    await expect(page.locator('.stat-quizzes .stat-value')).toHaveText(new RegExp(`^\\d+ / ${total}$`));
    await expect(page.locator('.recent-item').first()).toContainText(title);
  });
});
