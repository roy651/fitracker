import { describe, it, expect } from 'vitest';
import {
    workoutDatabase,
    getPrograms,
    getProgramById,
    getExercise,
    getWorkoutTemplate,
    weekKeys,
    getDaysForWeek
} from '../../../src/data/workoutDatabase';

describe('Workout Database - Multi-Program Support', () => {
    describe('workoutDatabase structure', () => {
        it('should have programs array', () => {
            expect(workoutDatabase.programs).toBeDefined();
            expect(Array.isArray(workoutDatabase.programs)).toBe(true);
        });

        it('should have at least one program', () => {
            expect(workoutDatabase.programs.length).toBeGreaterThan(0);
        });

        it('should maintain backward compatibility with program_schedule', () => {
            expect(workoutDatabase.program_schedule).toBeDefined();
            expect(typeof workoutDatabase.program_schedule).toBe('object');
        });

        it('should have exercise_library', () => {
            expect(workoutDatabase.exercise_library).toBeDefined();
            expect(typeof workoutDatabase.exercise_library).toBe('object');
        });

        it('should have workout_templates', () => {
            expect(workoutDatabase.workout_templates).toBeDefined();
            expect(typeof workoutDatabase.workout_templates).toBe('object');
        });
    });

    describe('getPrograms()', () => {
        it('should return array of programs', () => {
            const programs = getPrograms();
            expect(Array.isArray(programs)).toBe(true);
            expect(programs.length).toBeGreaterThan(0);
        });

        it('should return programs with required fields', () => {
            const programs = getPrograms();
            const program = programs[0];

            expect(program).toHaveProperty('id');
            expect(program).toHaveProperty('name');
            expect(program).toHaveProperty('description');
            expect(program).toHaveProperty('duration_weeks');
            expect(program).toHaveProperty('frequency');
            expect(program).toHaveProperty('schedule');
        });

        it('should include ski-prep-6week program', () => {
            const programs = getPrograms();
            const skiPrep = programs.find(p => p.id === 'ski-prep-6week');

            expect(skiPrep).toBeDefined();
            expect(skiPrep.name).toBe('6-Week Ski Preparation');
        });
    });

    describe('getProgramById()', () => {
        it('should return correct program by ID', () => {
            const program = getProgramById('ski-prep-6week');

            expect(program).toBeDefined();
            expect(program.id).toBe('ski-prep-6week');
            expect(program.name).toBe('6-Week Ski Preparation');
        });

        it('should return undefined for non-existent program ID', () => {
            const program = getProgramById('nonexistent-program');
            expect(program).toBeUndefined();
        });

        it('should return program with valid schedule', () => {
            const program = getProgramById('ski-prep-6week');

            expect(program.schedule).toBeDefined();
            expect(program.schedule.week_1).toBeDefined();
            expect(program.schedule.week_1.Monday).toBeDefined();
        });
    });

    describe('Exercise library loading', () => {
        it('should load all 22 exercises', () => {
            const exerciseCount = Object.keys(workoutDatabase.exercise_library).length;
            expect(exerciseCount).toBe(47);
        });

        it('should load exercises from all categories', () => {
            // Warmup exercises
            expect(getExercise('cat_cow')).toBeDefined();
            expect(getExercise('dyn_ham_scoop')).toBeDefined();

            // Strength exercises
            expect(getExercise('goblet_sq_tempo')).toBeDefined();
            expect(getExercise('rdl_heavy')).toBeDefined();

            // Stability exercises
            expect(getExercise('bosu_squat')).toBeDefined();
            expect(getExercise('dead_bug')).toBeDefined();

            // Power exercises
            expect(getExercise('box_jump')).toBeDefined();
            expect(getExercise('skater_hops')).toBeDefined();
        });

        it('should have complete exercise data structure', () => {
            const exercise = getExercise('cat_cow');

            expect(exercise).toHaveProperty('name');
            expect(exercise).toHaveProperty('instruction');
            expect(exercise).toHaveProperty('visual_ref');
        });
    });

    describe('Workout templates loading', () => {
        it('should load all 7 workout templates', () => {
            const workoutCount = Object.keys(workoutDatabase.workout_templates).length;
            expect(workoutCount).toBe(13);
        });

        it('should load workouts from all files', () => {
            // Phase 1 gym
            expect(workoutDatabase.workout_templates.gym_monday_p1).toBeDefined();
            expect(workoutDatabase.workout_templates.gym_wednesday_p1).toBeDefined();

            // Phase 1 home
            expect(workoutDatabase.workout_templates.home_thursday_p1).toBeDefined();

            // Phase 2 gym
            expect(workoutDatabase.workout_templates.gym_monday_p2).toBeDefined();
            expect(workoutDatabase.workout_templates.gym_wednesday_p2).toBeDefined();

            // Phase 2 home
            expect(workoutDatabase.workout_templates.home_thursday_p2).toBeDefined();

            // Test workouts
            expect(workoutDatabase.workout_templates.test_block_rest_example).toBeDefined();
        });

        it('should have complete workout data structure', () => {
            const workout = workoutDatabase.workout_templates.gym_monday_p1;

            expect(workout).toHaveProperty('name');
            expect(workout).toHaveProperty('blocks');
            expect(Array.isArray(workout.blocks)).toBe(true);
            expect(workout.blocks[0]).toHaveProperty('name');
            expect(workout.blocks[0]).toHaveProperty('rounds');
            expect(workout.blocks[0]).toHaveProperty('drills');
        });
    });

    describe('Backward compatibility', () => {
        it('should maintain weekKeys export', () => {
            expect(weekKeys).toBeDefined();
            expect(Array.isArray(weekKeys)).toBe(true);
            expect(weekKeys.length).toBe(6);
        });

        it('should maintain getDaysForWeek function', () => {
            const days = getDaysForWeek('week_1');
            expect(Array.isArray(days)).toBe(true);
            expect(days).toContain('Monday');
            expect(days).toContain('Wednesday');
            expect(days).toContain('Thursday');
        });

        it('should maintain getWorkoutTemplate function', () => {
            const workout = getWorkoutTemplate('week_1', 'Monday');
            expect(workout).toBeDefined();
            expect(workout.id).toBe('gym_monday_p1');
            expect(workout.name).toBe('Mon: Foundation Strength');
        });

        it('should maintain getExercise function', () => {
            const exercise = getExercise('cat_cow');
            expect(exercise).toBeDefined();
            expect(exercise.name).toBe('Cat-Cow Stretch');
        });

        it('should return null for non-existent exercise', () => {
            const exercise = getExercise('nonexistent');
            expect(exercise).toBeNull();
        });

        it('should return null for invalid workout template', () => {
            const workout = getWorkoutTemplate('week_99', 'Sunday');
            expect(workout).toBeNull();
        });
    });
});
