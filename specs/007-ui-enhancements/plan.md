# Implementation Plan - Workout UI Enhancements

**Feature Branch**: `007-ui-enhancements`
**Status**: APPROVED

# Goal Description

Enhance the Workout Player UI to improve visual guidance and "glanceability" during workouts.
Key changes:
1.  **Larger Drill Images**: Increase the size of the active exercise reference image to be more prominent (P1).
2.  **Visual Next Up Preview**: Display the *image* of the next exercise alongside its name during standard Rest periods (P2).
3.  **Block Rest Preview**: Display the *image* (and name) of the *first drill of the next block* during Block Rest periods (P2).

These changes reduce cognitive load and help users prepare for the next movement without reading small text.

## User Review Required

> [!NOTE]
> **Image Sizing**: The drill image will be significantly larger (approx 2x current size). This will push the timer and text further apart.
> **Mobile Layout**: On very small screens (iPhone SE), ensure the larger image doesn't push controls off-screen.

## Proposed Changes

### Utils

#### [MODIFY] [linearizer.js](file:///Users/royabitbol/Development/private/fitracker/src/utils/linearizer.js)
- Update `linearizeWorkout` function:
    - **StepType.REST creation**: Fetch and add `nextExerciseId` and `nextVisualRef` alongside `nextExercise` (name).
    - **StepType.BLOCK_REST creation**: Fetch and add `nextExerciseId` and `nextVisualRef` (for the first drill of the next block).
    - Use `getExercise()` to retrieve these details from the ID.

### Components

#### [MODIFY] [WorkoutPlayer.jsx](file:///Users/royabitbol/Development/private/fitracker/src/components/WorkoutPlayer.jsx)
- **ExerciseVisual Component**:
    - Update CSS classes to increase image size (e.g., from `w-32 h-32` to `w-56 h-56` or `w-64 h-64`).
    - Add responsive sizing support if needed.
- **Main Render (Rest View)**:
    - Update the "Next Up" section (lines ~545) to render the next exercise image.
    - Use `currentStep.nextVisualRef` (or derive from `nextExerciseId`).
    - Use a smaller variant of `ExerciseVisual` or a generic `img` tag for the preview (approx `w-12 h-12` or `w-16 h-16`).
    - Apply same logic for `BLOCK_REST` (which shares the view).

## Verification Plan

### Automated Tests
- **Unit Tests**:
    - Update `tests/unit/utils/linearizer.blockRest.test.js` to assert that `BLOCK_REST` steps now contain `nextExerciseId` and `nextVisualRef`.
    - Create/Update a unit test for standard `REST` steps to verify they contain `nextExerciseId`/`nextVisualRef`.
    - Run: `npm run test:unit`
- **E2E Tests**:
    - Run existing smoke tests to ensure no regressions in workout flow.
    - Run: `npm run test:e2e`

### Manual Verification
1.  **Work View**: Start a workout. Verify the active drill image is significantly larger and clearly visible.
2.  **Rest View**: Wait for a rest period. Verify the "Next Up" text is accompanied by a small preview image of the upcoming drill.
3.  **Block Rest View**: Complete a block. Verify the Block Rest screen shows the preview image of the *first drill of the next block*.
4.  **Responsiveness**: Use Chrome DevTools to toggle device mode (iPhone SE - 320px). Ensure the larger image doesn't break the layout or hide the timer/controls.
