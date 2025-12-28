import { test, expect } from '../support/fixtures';

test.describe.skip('Wake Lock E2E', () => {
    test('should acquire wake lock when workout starts and release when finished', async ({ page }) => {
        // Monitor console logs
        page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));

        // 1. Go to dashboard
        await page.goto('/');

        // 2. Select a workout (Week 1, Monday)
        await page.getByRole('button', { name: '1 Foundation' }).click();
        await page.getByRole('button', { name: 'Monday' }).click();

        // 3. Start workout
        await page.getByRole('button', { name: /Start .* Workout/i }).click();

        // Handle Block Start if present (Monday workout starts with a block)
        if (await page.getByText('Start Block').isVisible()) {
            await page.getByRole('button', { name: 'Start Block' }).click();
        }

        // 4. Verify Wake Lock Request
        // Wait a bit for the async hardware init
        await page.waitForTimeout(2000);

        // Check if fakes were injected
        const isFakeInjected = await page.evaluate(() => !!window.__HARDWARE_LOGS__);
        console.log('Fakes injected:', isFakeInjected);

        const logs = await page.evaluate(() => window.__HARDWARE_LOGS__);
        console.log('Hardware Logs:', JSON.stringify(logs));

        const acquireLog = logs?.find(l => l.api === 'wakeLock' && l.action === 'request');
        expect(acquireLog).toBeTruthy();
        expect(acquireLog.type).toBe('screen');

        // 5. Exit workout (which releases lock)
        // We added aria-label="Exit workout" to the button
        await page.getByRole('button', { name: 'Exit workout' }).first().click();

        // 6. Verify Wake Lock Release
        const logsAfter = await page.evaluate(() => window.__HARDWARE_LOGS__);
        const releaseLog = logsAfter.find(l => l.api === 'wakeLock' && l.action === 'release');
        expect(releaseLog).toBeTruthy();
    });
});
