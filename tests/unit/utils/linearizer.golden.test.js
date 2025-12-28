
import { describe, it, expect } from 'vitest';
import { linearizeWorkout } from '../../../src/utils/linearizer.js';
import { workoutDatabase } from '../../../src/data/workoutDatabase.js';

describe('Linearizer Golden Master Regression', () => {
    // Iterate over all available workout templates in the database
    const templates = Object.entries(workoutDatabase.workout_templates);

    templates.forEach(([id, template]) => {
        it(`should produce consistent output for template: ${id}`, () => {
            const steps = linearizeWorkout(template);
            expect(steps).toMatchSnapshot();
        });
    });
});
