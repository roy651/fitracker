
import { describe, it, expect } from 'vitest';
import { linearizeWorkout, StepType } from '../../../src/utils/linearizer.js';

describe('Linearizer Block Rest Logic', () => {
    it('should insert a BLOCK_REST step after a block that has block_rest defined', () => {
        const template = {
            name: "Block Rest Test",
            blocks: [
                {
                    name: "Block 1",
                    rounds: 1,
                    drills: ["drill1"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 30 // 30s rest after this block
                },
                {
                    name: "Block 2",
                    rounds: 1,
                    drills: ["drill2"],
                    work_sec: 10,
                    rest_sec: 5
                }
            ]
        };

        // Mock getExercise since linearizer uses it. 
        // Note: In a real unit test we might want to mock the import, but since getExercise 
        // just looks up in a static object, we can rely on it returning null or we can mock the exercise_library if exported.
        // For simplicity, linearizer handles missing exercises gracefully (returns drillId as name).

        const steps = linearizeWorkout(template);

        // Find block rest steps
        const blockRestSteps = steps.filter(s => s.type === StepType.BLOCK_REST);

        expect(blockRestSteps).toHaveLength(1);
        expect(blockRestSteps[0].duration).toBe(30);
        expect(blockRestSteps[0].blockName).toBe("Block 1");

        // Verify position: Should be after Block 1's work/rest and before Block 2
        // Block 1: Start -> Work -> Rest (maybe skipped if last) -> BLOCK_REST -> ...
        // Wait, logic says: "Add REST step (but not after the very last drill of the very last round of the block)"

        // Let's trace expected steps:
        // 0: BLOCK_START (Block 1)
        // 1: WORK (drill1)
        // 2: BLOCK_REST (30s)  <-- Should be here? Or after a REST?
        //    Rest logic: "not after the very last drill of the very last round of the block".
        //    So NO normal REST step after drill1.
        // 3: BLOCK_START (Block 2)
        // 4: WORK (drill2)
        // 5: WORKOUT_COMPLETE

        const block1Start = steps.find(s => s.type === StepType.BLOCK_START && s.blockName === "Block 1");
        const block2Start = steps.find(s => s.type === StepType.BLOCK_START && s.blockName === "Block 2");
        const blockRest = blockRestSteps[0];

        expect(blockRest.id).toBeGreaterThan(block1Start.id);
        expect(blockRest.id).toBeLessThan(block2Start.id);
    });

    it('should NOT insert a BLOCK_REST step after the very last block', () => {
        const template = {
            name: "Last Block Rest Test",
            blocks: [
                {
                    name: "Block 1",
                    rounds: 1,
                    drills: ["drill1"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 30
                }
            ]
        };

        const steps = linearizeWorkout(template);
        const blockRestSteps = steps.filter(s => s.type === StepType.BLOCK_REST);

        expect(blockRestSteps).toHaveLength(0);
    });

    it('should NOT insert a BLOCK_REST step if block_rest is not defined or 0', () => {
        const template = {
            name: "No Block Rest Test",
            blocks: [
                {
                    name: "Block 1",
                    rounds: 1,
                    drills: ["drill1"],
                    work_sec: 10,
                    rest_sec: 5
                },
                {
                    name: "Block 2",
                    rounds: 1,
                    drills: ["drill2"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 0
                }
            ]
        };

        const steps = linearizeWorkout(template);
        const blockRestSteps = steps.filter(s => s.type === StepType.BLOCK_REST);
        expect(blockRestSteps).toHaveLength(0);
    });

    it('should set nextExercise on BLOCK_REST step to first exercise of next block', () => {
        const template = {
            name: "Next Exercise Preview Test",
            blocks: [
                {
                    name: "Block 1",
                    rounds: 1,
                    drills: ["drill1"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 30
                },
                {
                    name: "Block 2",
                    rounds: 1,
                    drills: ["drill2", "drill3"],
                    work_sec: 10,
                    rest_sec: 5
                }
            ]
        };

        const steps = linearizeWorkout(template);
        const blockRestSteps = steps.filter(s => s.type === StepType.BLOCK_REST);

        expect(blockRestSteps).toHaveLength(1);
        // nextExercise should be the first drill of Block 2 (drill2)
        // Since getExercise returns null for unknown IDs, linearizer uses drillId as name fallback
        expect(blockRestSteps[0].nextExercise).toBe("drill2");
        expect(blockRestSteps[0].nextExerciseId).toBe("drill2");
        // Visual ref will be null since drill2 is not in the actual exercise database
        expect(blockRestSteps[0].nextVisualRef).toBeNull();
    });

    it('should NOT have BLOCK_REST before WORKOUT_COMPLETE (last block never gets BLOCK_REST)', () => {
        // This test verifies AC3: last rest before complete edge case
        // Since BLOCK_REST is never inserted after the final block, there's no "Next: X" 
        // preview issue for BLOCK_REST. The final REST step also doesn't exist (skipped 
        // after last drill of last round of last block).
        const template = {
            name: "Single Block No BLOCK_REST",
            blocks: [
                {
                    name: "Only Block",
                    rounds: 1,
                    drills: ["drill1"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 30 // This should NOT be inserted since it's the last block
                }
            ]
        };

        const steps = linearizeWorkout(template);

        // Should have: BLOCK_START, WORK, WORKOUT_COMPLETE (no REST, no BLOCK_REST)
        const blockRestSteps = steps.filter(s => s.type === StepType.BLOCK_REST);
        const restSteps = steps.filter(s => s.type === StepType.REST);

        expect(blockRestSteps).toHaveLength(0); // No BLOCK_REST after last block
        expect(restSteps).toHaveLength(0); // No REST after last drill of last round

        // Verify last step is WORKOUT_COMPLETE
        expect(steps[steps.length - 1].type).toBe(StepType.WORKOUT_COMPLETE);
    });
});
