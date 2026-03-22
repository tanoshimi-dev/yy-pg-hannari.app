import { test, expect } from '@playwright/test';
import { mockLogin } from './helpers/auth';

test.describe('Quiz Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
  });

  test('should display quiz questions with choices', async ({ page }) => {
    // Navigate to a quiz page (assuming first content has a quiz)
    await page.goto('/contents');

    // Click on the first content to navigate to its detail
    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const clickable = firstCard.locator('a').first().or(firstCard);
    await clickable.click();

    // Find and click the quiz start button
    const quizButton = page.getByRole('button', { name: /quiz|start|begin/i }).or(
      page.locator('[data-testid="start-quiz"]')
    );
    await expect(quizButton).toBeVisible({ timeout: 10000 });
    await quizButton.click();

    // Verify question is displayed
    const question = page.locator('[data-testid="quiz-question"]').or(
      page.locator('.quiz-question')
    ).or(
      page.locator('h2, h3').first()
    );
    await expect(question).toBeVisible({ timeout: 10000 });
    await expect(question).not.toBeEmpty();

    // Verify choices are displayed
    const choices = page.locator('[data-testid="quiz-choice"]').or(
      page.locator('.quiz-choice')
    ).or(
      page.getByRole('button').filter({ hasNotText: /next|submit|skip/i })
    );
    const choiceCount = await choices.count();
    expect(choiceCount).toBeGreaterThanOrEqual(2);
  });

  test('should show feedback when selecting a choice', async ({ page }) => {
    await page.goto('/contents');

    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const clickable = firstCard.locator('a').first().or(firstCard);
    await clickable.click();

    const quizButton = page.getByRole('button', { name: /quiz|start|begin/i }).or(
      page.locator('[data-testid="start-quiz"]')
    );
    await expect(quizButton).toBeVisible({ timeout: 10000 });
    await quizButton.click();

    // Wait for choices and click the first one
    const choices = page.locator('[data-testid="quiz-choice"]').or(
      page.locator('.quiz-choice')
    ).or(
      page.getByRole('radio')
    );
    await expect(choices.first()).toBeVisible({ timeout: 10000 });
    await choices.first().click();

    // Verify feedback is shown (correct/incorrect indicator)
    const feedback = page.locator('[data-testid="quiz-feedback"]').or(
      page.locator('.quiz-feedback')
    ).or(
      page.locator('.correct, .incorrect, .feedback')
    );
    await expect(feedback).toBeVisible({ timeout: 5000 });
  });

  test('should show result page after completing all questions', async ({ page }) => {
    await page.goto('/contents');

    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const clickable = firstCard.locator('a').first().or(firstCard);
    await clickable.click();

    const quizButton = page.getByRole('button', { name: /quiz|start|begin/i }).or(
      page.locator('[data-testid="start-quiz"]')
    );
    await expect(quizButton).toBeVisible({ timeout: 10000 });
    await quizButton.click();

    // Answer all questions by clicking the first choice and proceeding
    let hasNextQuestion = true;
    let maxAttempts = 20; // Safety limit

    while (hasNextQuestion && maxAttempts > 0) {
      maxAttempts--;

      // Check if result page is already showing
      const resultPage = page.locator('[data-testid="quiz-result"]').or(
        page.locator('.quiz-result')
      ).or(
        page.locator('text=/result|score|complete/i')
      );

      if (await resultPage.isVisible().catch(() => false)) {
        hasNextQuestion = false;
        break;
      }

      // Select the first available choice
      const choices = page.locator('[data-testid="quiz-choice"]').or(
        page.locator('.quiz-choice')
      ).or(
        page.getByRole('radio')
      );

      if (await choices.first().isVisible().catch(() => false)) {
        await choices.first().click();

        // Click next or submit button if available
        const nextButton = page.getByRole('button', { name: /next|submit|continue/i }).or(
          page.locator('[data-testid="next-question"]')
        );

        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click();
        }

        // Short wait for page transition
        await page.waitForTimeout(500);
      } else {
        hasNextQuestion = false;
      }
    }

    // Verify the result page is displayed
    const resultPage = page.locator('[data-testid="quiz-result"]').or(
      page.locator('.quiz-result')
    ).or(
      page.locator('text=/result|score|complete/i')
    );
    await expect(resultPage).toBeVisible({ timeout: 10000 });
  });
});
