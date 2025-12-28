import { test, expect } from '../support/fixtures';

test.describe('PWA Offline Mode', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure we load the page first to register SW
        await page.goto('/');
        // Give SW some time to register and cache assets
        await page.waitForTimeout(1000);
    });

    test('should function offline', async ({ page, context }) => {
        // 1. Simulate Offline
        await context.setOffline(true);

        // 2. Navigate to a workout (should be cached if SW works or if it's SPA routing)
        // Since it's an SPA, routing is client-side, but assets (images) need to be cached.
        await page.getByRole('button', { name: 'Monday' }).click();

        // 3. Verify content
        await expect(page.getByText('Gym Session').first()).toBeVisible();
        await expect(page.getByRole('button', { name: /Start .* Workout/i })).toBeEnabled();

        // 4. Reload page (Full PWA test)
        // This validates if the HTML entry point is cached
        try {
            await page.reload({ waitUntil: 'commit' });
        } catch (e) {
            // Playwright might throw on offline reload if not handled by SW immediately
            console.log('Reload error:', e);
        }

        await expect(page.getByText('Ski Prep Pro')).toBeVisible();
    });
});
