
import { faker } from '@faker-js/faker';

export class WorkoutFactory {
    createWorkout(overrides = {}) {
        return {
            id: faker.string.uuid(),
            name: faker.helpers.arrayElement(['Leg Day', 'Upper Body', 'Cardio Blast']),
            blocks: [
                {
                    id: faker.string.uuid(),
                    name: 'Block 1',
                    cycles: 2,
                    rest_between_cycles: 60,
                    steps: [
                        {
                            id: faker.string.uuid(),
                            work_duration: 30,
                            rest_duration: 15,
                            reps: 10,
                            exercise: { name: 'Squats' }
                        }
                    ]
                }
            ],
            ...overrides,
        };
    }
}
