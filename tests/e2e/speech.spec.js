import { test, expect } from '../support/fixtures';

test.describe.skip('Speech E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => window.__HARDWARE_LOGS__ = []);
    });

    test('should speak exercise name on start', async ({ page }) => {
        // 1. Select Workout
        await page.getByRole('button', { name: '1 Foundation' }).click();
        await page.getByRole('button', { name: 'Monday' }).click();

        // 2. Start Workout
        await page.getByRole('button', { name: /Start .* Workout/i }).click();

        // 3. Handle Block Start if present
        // Monday workout usually starts with a block
        if (await page.getByText('Start Block').isVisible()) {
            await page.getByRole('button', { name: 'Start Block' }).click();
        }

        // 4. Verify Speech Synthesis
        // Speech is triggered on WORK steps.
        // Wait for potential delays
        await page.waitForTimeout(1000);

        const logs = await page.evaluate(() => window.__HARDWARE_LOGS__);
        const speechLog = logs.find(l => l.api === 'speech' && l.action === 'speak');

        expect(speechLog).toBeTruthy();
        expect(speechLog.text).toContain('Goblet Squats'); // First exercise of Monday
    });
});
