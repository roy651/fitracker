
import { test, expect } from '../support/fixtures';

test.describe('Ski Prep Pro Smoke Test', () => {

    test.beforeEach(async ({ page }) => {
        // Ensure hardware APIs are mocked to prevent errors in headless CI
        await page.goto('/');
    });

    test('should load the homepage and show title', async ({ page }) => {
        // Verify PWA title presence
        await expect(page).toHaveTitle(/Ski Prep Pro/i);

        // Check key UI elements are visible
        // Note: adjusting selectors based on likely existence in current app state
        const mainHeading = page.locator('h1, h2').first();
        await expect(mainHeading).toBeVisible();
    });

    test('should allow navigation to workout player', async ({ workoutFactory }) => {
        // TODO: Once implemented, seed a workout and navigate to it
        const workout = workoutFactory.createWorkout();
        console.log('Seeded workout for test:', workout.name);

        // Placeholder for "Start Workout" flow
        // await page.getByRole('button', { name: /start/i }).first().click();
        // await expect(page).toHaveURL(/workout/);
    });
});
