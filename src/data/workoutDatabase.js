// 6-Week Ski Preparation Program Database
// All workout logic is driven by dynamically loaded JSON files

// Dynamically import ALL JSON files from each folder using Vite glob imports
const exerciseModules = import.meta.glob('./db/exercises/*.json', { eager: true });
const workoutModules = import.meta.glob('./db/workouts/*.json', { eager: true });
const programModules = import.meta.glob('./db/programs/*.json', { eager: true });

/**
 * Merges multiple module imports into a flat object.
 * Implements last-one-wins strategy for duplicate IDs with console warnings.
 * @param {Object} modules - Object of module imports from import.meta.glob
 * @returns {Object} Merged flat object
 */
function mergeModules(modules) {
    const merged = {};
    const duplicates = new Set();

    Object.values(modules).forEach((module) => {
        const data = module.default || module;
        Object.keys(data).forEach((key) => {
            if (merged[key]) {
                console.warn(`⚠️  Duplicate ID detected: "${key}" - using latest definition`);
                duplicates.add(key);
            }
            merged[key] = data[key]; // Last-one-wins strategy
        });
    });

    return merged;
}

// Merge all exercises from any JSON file in exercises/ folder
const exercise_library = mergeModules(exerciseModules);

// Merge all workouts from any JSON file in workouts/ folder
const workout_templates = mergeModules(workoutModules);

// Build programs array (each file is one program)
const programs = Object.values(programModules).map((module) => module.default || module);

// Export unified database (backward compatible)
export const workoutDatabase = {
    exercise_library,
    workout_templates,
    program_schedule: programs[0]?.schedule || {}, // Default to first program for backward compat
    programs, // New: array of all available programs
};

// Helper to get week keys
export const weekKeys = Object.keys(workoutDatabase.program_schedule);

// Helper to get available days for a week
export const getDaysForWeek = (weekKey) => {
    return Object.keys(workoutDatabase.program_schedule[weekKey]);
};

// Helper to get workout template for a specific week and day
export const getWorkoutTemplate = (weekKey, day) => {
    const templateId = workoutDatabase.program_schedule[weekKey]?.[day];
    if (!templateId) return null;
    return {
        id: templateId,
        ...workoutDatabase.workout_templates[templateId],
    };
};

// Helper to get exercise details by ID
export const getExercise = (exerciseId) => {
    return workoutDatabase.exercise_library[exerciseId] || null;
};

// New helper functions for multi-program support
export const getPrograms = () => workoutDatabase.programs;

export const getProgramById = (programId) => {
    return workoutDatabase.programs.find((p) => p.id === programId);
};
