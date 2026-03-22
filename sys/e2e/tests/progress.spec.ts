import { test, expect } from '@playwright/test';
import { mockLogin } from './helpers/auth';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
  });

  test('should display progress summary on dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for the dashboard to load
    const dashboard = page.locator('[data-testid="dashboard"]').or(
      page.locator('.dashboard')
    ).or(
      page.locator('main')
    );
    await expect(dashboard).toBeVisible({ timeout: 10000 });

    // Verify progress summary section exists
    const progressSummary = page.locator('[data-testid="progress-summary"]').or(
      page.locator('.progress-summary')
    ).or(
      page.locator('text=/progress|summary/i').first()
    );
    await expect(progressSummary).toBeVisible({ timeout: 10000 });

    // Verify progress indicators are present (e.g., percentage, bar, or count)
    const progressIndicator = page.locator('[data-testid="progress-indicator"]').or(
      page.locator('.progress-bar, .progress-indicator, .progress-percentage')
    ).or(
      page.locator('[role="progressbar"]')
    );
    await expect(progressIndicator.first()).toBeVisible({ timeout: 10000 });
  });

  test('should update progress after completing content', async ({ page }) => {
    // First, visit the dashboard and record initial progress
    await page.goto('/dashboard');

    const progressIndicator = page.locator('[data-testid="progress-indicator"]').or(
      page.locator('.progress-bar, .progress-indicator, .progress-percentage')
    ).or(
      page.locator('[role="progressbar"]')
    );
    await expect(progressIndicator.first()).toBeVisible({ timeout: 10000 });

    // Capture initial progress text/value
    const initialProgressText = await progressIndicator.first().textContent().catch(() => '');
    const initialProgressValue = await progressIndicator.first().getAttribute('aria-valuenow').catch(() => null);

    // Navigate to contents and complete one
    await page.goto('/contents');

    const firstCard = page.locator('[data-testid="content-card"]').or(
      page.locator('.content-card')
    ).or(
      page.getByRole('listitem')
    ).first();

    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const clickable = firstCard.locator('a').first().or(firstCard);
    await clickable.click();

    // Start and complete a quiz
    const quizButton = page.getByRole('button', { name: /quiz|start|begin/i }).or(
      page.locator('[data-testid="start-quiz"]')
    );

    if (await quizButton.isVisible().catch(() => false)) {
      await quizButton.click();

      // Answer all questions
      let hasNextQuestion = true;
      let maxAttempts = 20;

      while (hasNextQuestion && maxAttempts > 0) {
        maxAttempts--;

        const resultPage = page.locator('[data-testid="quiz-result"]').or(
          page.locator('.quiz-result')
        ).or(
          page.locator('text=/result|score|complete/i')
        );

        if (await resultPage.isVisible().catch(() => false)) {
          hasNextQuestion = false;
          break;
        }

        const choices = page.locator('[data-testid="quiz-choice"]').or(
          page.locator('.quiz-choice')
        ).or(
          page.getByRole('radio')
        );

        if (await choices.first().isVisible().catch(() => false)) {
          await choices.first().click();

          const nextButton = page.getByRole('button', { name: /next|submit|continue/i }).or(
            page.locator('[data-testid="next-question"]')
          );

          if (await nextButton.isVisible().catch(() => false)) {
            await nextButton.click();
          }

          await page.waitForTimeout(500);
        } else {
          hasNextQuestion = false;
        }
      }
    }

    // Return to dashboard and verify progress has been updated
    await page.goto('/dashboard');

    await expect(progressIndicator.first()).toBeVisible({ timeout: 10000 });

    // Capture updated progress
    const updatedProgressText = await progressIndicator.first().textContent().catch(() => '');
    const updatedProgressValue = await progressIndicator.first().getAttribute('aria-valuenow').catch(() => null);

    // Verify progress has changed (either text or aria value)
    const progressChanged =
      updatedProgressText !== initialProgressText ||
      updatedProgressValue !== initialProgressValue;

    expect(progressChanged).toBeTruthy();
  });
});
