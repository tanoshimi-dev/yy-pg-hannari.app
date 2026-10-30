import { Page } from '@playwright/test';
import { test, expect } from './helpers/auth';

async function startFirstQuiz(page: Page) {
  await page.goto('/contents');
  await page.locator('.content-card').first().click();
  await page.getByRole('button', { name: 'クイズをはじめる' }).click();
  await expect(page).toHaveURL(/\/contents\/[0-9a-f-]{36}\/quiz$/);
  // Counter shows "1 / 0" until quizzes are loaded
  await expect(page.locator('.choice-btn').first()).toBeVisible();
}

test.describe('Quiz Page', () => {
  test('should display quiz questions with choices', async ({ page, user: _user }) => {
    await startFirstQuiz(page);

    await expect(page.locator('.quiz-question h2')).not.toBeEmpty();
    expect(await page.locator('.choice-btn').count()).toBeGreaterThanOrEqual(2);
    await expect(page.locator('.quiz-counter')).toHaveText(/^1 \/ \d+$/);
  });

  test('should show feedback when selecting a choice', async ({ page, user: _user }) => {
    await startFirstQuiz(page);

    await page.locator('.choice-btn').first().click();

    const feedback = page.locator('.answer-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback.locator('.feedback-text')).toHaveText(/せいかい！|ざんねん\.\.\./);
    // The correct answer is revealed and choices are locked
    await expect(page.locator('.correct-icon')).toHaveCount(1);
    await expect(page.locator('.choice-btn').first()).toBeDisabled();
  });

  test('should show result page after completing all questions', async ({ page, user: _user }) => {
    await startFirstQuiz(page);

    const total = Number((await page.locator('.quiz-counter').textContent())!.split('/')[1]);
    for (let i = 0; i < total; i++) {
      await page.locator('.choice-btn').first().click();
      await page.locator('.next-btn').click();
    }

    await expect(page).toHaveURL(/\/quiz-result$/);
    await expect(page.locator('.result-summary')).toHaveText(new RegExp(`${total}問中 \\d+問正解`));
    await expect(page.locator('.result-item')).toHaveCount(total);
  });
});
