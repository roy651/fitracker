
/* eslint-disable react-hooks/rules-of-hooks */

import { test as base, expect } from '@playwright/test';
import { WorkoutFactory } from './factories/workout-factory';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load hardware fakes script
const hardwareFakesScript = readFileSync(
    path.resolve(__dirname, '../hardwareFakes.js'),
    'utf-8'
);

export const test = base.extend({
    workoutFactory: async ({}, use) => {
        const factory = new WorkoutFactory();
        await use(factory);
    },

    // Automatically inject hardware fakes into all pages
    context: async ({ context }, use) => {
        // Inject hardware fakes script into all new pages
        await context.addInitScript(hardwareFakesScript);
        await use(context);
    }
});

export { expect };
