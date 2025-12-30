import { getExercise } from "../data/workoutDatabase";

/**
 * Step Types in the linearized workout
 */
export const StepType = {
    BLOCK_START: "block_start", // Indicates the start of a new block
    WORK: "work", // Work interval for an exercise
    REST: "rest", // Rest interval between exercises
    BLOCK_REST: "block_rest", // Longer rest between rounds
    WORKOUT_COMPLETE: "workout_complete", // Final step indicating workout is done
};

/**
 * Linearizes a workout template into a flat array of steps.
 *
 * For each block:
 *   For each round (1 to rounds):
 *     For each drill in drills:
 *       Add WORK step with exercise details and work_sec duration
 *       Add REST step with rest_sec duration (skip after last drill of last round)
 *
 * @param {Object} template - The workout template object
 * @returns {Array} Flat array of workout steps
 */
export function linearizeWorkout(template) {
    if (!template || !template.blocks) {
        return [];
    }

    const steps = [];
    let stepIndex = 0;
    let totalBlocks = template.blocks.length;

    template.blocks.forEach((block, blockIndex) => {
        const { name: blockName, rounds, drills, work_sec, rest_sec } = block;

        // Add block start marker
        steps.push({
            id: stepIndex++,
            type: StepType.BLOCK_START,
            blockName,
            blockIndex,
            totalBlocks,
            rounds,
            drillCount: drills.length,
        });

        // Iterate through each round
        for (let round = 1; round <= rounds; round++) {
            // Iterate through each drill in the round
            drills.forEach((drillId, drillIndex) => {
                const exercise = getExercise(drillId);
                const isLastDrillOfRound = drillIndex === drills.length - 1;
                const isLastRound = round === rounds;

                // Add WORK step
                steps.push({
                    id: stepIndex++,
                    type: StepType.WORK,
                    exerciseId: drillId,
                    exerciseName: exercise?.name || drillId,
                    instruction: exercise?.instruction || "",
                    visualRef: exercise?.visual_ref || null,
                    duration: work_sec,
                    blockName,
                    blockIndex,
                    round,
                    totalRounds: rounds,
                    drillIndex,
                    totalDrills: drills.length,
                });

                // Add REST step (but not after the very last drill of the very last round of the block)
                // We always add rest between exercises within a round
                if (!isLastDrillOfRound || !isLastRound) {
                    steps.push({
                        id: stepIndex++,
                        type: StepType.REST,
                        duration: rest_sec,
                        blockName,
                        blockIndex,
                        round,
                        totalRounds: rounds,
                        nextExerciseId: isLastDrillOfRound ? drills[0] : drills[drillIndex + 1],
                        nextExercise: isLastDrillOfRound
                            ? getExercise(drills[0])?.name
                            : getExercise(drills[drillIndex + 1])?.name,
                        nextVisualRef: isLastDrillOfRound
                            ? getExercise(drills[0])?.visual_ref
                            : getExercise(drills[drillIndex + 1])?.visual_ref,
                        isRoundTransition: isLastDrillOfRound,
                    });
                }
            });
        }

        // Add BLOCK_REST step if defined and not the last block
        if (block.block_rest > 0 && blockIndex < totalBlocks - 1) {
            // Get the first exercise of the next block for "Next Up" preview
            const nextBlock = template.blocks[blockIndex + 1];
            const nextBlockFirstDrill = nextBlock?.drills?.[0];
            const nextExerciseData = nextBlockFirstDrill ? getExercise(nextBlockFirstDrill) : null;

            steps.push({
                id: stepIndex++,
                type: StepType.BLOCK_REST,
                duration: block.block_rest,
                blockName,
                blockIndex,
                nextExerciseId: nextBlockFirstDrill || null,
                nextExercise: nextExerciseData?.name || nextBlockFirstDrill || null,
                nextVisualRef: nextExerciseData?.visual_ref || null,
            });
        }
    });

    // Add workout complete step
    steps.push({
        id: stepIndex++,
        type: StepType.WORKOUT_COMPLETE,
        workoutName: template.name,
    });

    return steps;
}

/**
 * Calculate total workout duration in seconds
 * @param {Array} steps - Linearized workout steps
 * @returns {number} Total duration in seconds
 */
export function calculateTotalDuration(steps) {
    return steps.reduce((total, step) => {
        if (
            step.type === StepType.WORK ||
            step.type === StepType.REST ||
            step.type === StepType.BLOCK_REST
        ) {
            return total + (step.duration || 0);
        }
        return total;
    }, 0);
}

/**
 * Calculate elapsed time up to a specific step
 * @param {Array} steps - Linearized workout steps
 * @param {number} currentStepIndex - Current step index
 * @returns {number} Elapsed time in seconds
 */
export function calculateElapsedTime(steps, currentStepIndex) {
    let elapsed = 0;
    for (let i = 0; i < currentStepIndex; i++) {
        const step = steps[i];
        if (
            step.type === StepType.WORK ||
            step.type === StepType.REST ||
            step.type === StepType.BLOCK_REST
        ) {
            elapsed += step.duration || 0;
        }
    }
    return elapsed;
}

/**
 * Format seconds to MM:SS display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get workout summary statistics
 * @param {Object} template - Workout template
 * @returns {Object} Summary with exercise count, total rounds, estimated duration
 */
export function getWorkoutSummary(template) {
    if (!template || !template.blocks) {
        return { exerciseCount: 0, totalRounds: 0, estimatedDuration: 0 };
    }

    let exerciseCount = 0;
    let totalRounds = 0;
    let estimatedDuration = 0;
    const totalBlocks = template.blocks.length;

    template.blocks.forEach((block, index) => {
        const { rounds, drills, work_sec, rest_sec, block_rest } = block;
        exerciseCount += drills.length;
        totalRounds += rounds;

        // Each round: (work + rest) * drills, minus the last rest
        const roundTime = drills.length * work_sec + (drills.length - 1) * rest_sec;
        estimatedDuration += roundTime * rounds + (rounds - 1) * rest_sec;

        // Add block rest if it exists and is not the last block
        if (block_rest > 0 && index < totalBlocks - 1) {
            estimatedDuration += block_rest;
        }
    });

    return {
        exerciseCount,
        totalRounds,
        estimatedDuration,
        estimatedDurationFormatted: formatTime(estimatedDuration),
    };
}
