# Story 2.3: Next Up Preview Support

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see the name of the upcoming exercise during a rest period,
so that I can mentally prepare for the next movement without being surprised.

## Acceptance Criteria

1. **Given** The user is in a `REST` (drill rest) or `BLOCK_REST` period
   **When** The timer is running
   **Then** A "Next: [Exercise Name]" text preview should appear below the main timer
   **And** It should display the name of the *next* drill in the sequence

2. **Given** Specifically a `BLOCK_REST` period
   **When** The preview is shown
   **Then** It should show the name of the *first* exercise of the *next* block

3. **Given** The user is on the last step before `WORKOUT_COMPLETE`
   **When** The rest period is shown
   **Then** The "Next Up" preview should NOT appear (or show "Workout Complete!")

## Tasks / Subtasks

- [x] Update `src/utils/linearizer.js` - Add `nextExercise` field to `BLOCK_REST` steps
  - [x] When inserting a `BLOCK_REST` step, determine the first exercise of the next block.
  - [x] Set `nextExercise` property on the `BLOCK_REST` step object.
- [x] Update `src/components/WorkoutPlayer.jsx` - Render "Next Up" for `BLOCK_REST`
  - [x] In the `BLOCK_REST` rendering section (from Story 2.2), display `currentStep.nextExercise`.
  - [x] Reuse the existing "Next:" styling from `REST` steps.
- [x] Verify existing `REST` behavior
  - [x] Confirm `REST` steps already have `nextExercise` populated (they do, per linearizer.js).
  - [x] Confirm UI renders it correctly (it does, per WorkoutPlayer.jsx lines 507-513).
- [x] Handle Edge Case: Last Rest Before Complete
  - [x] If the next step is `WORKOUT_COMPLETE`, do not show "Next:" preview OR show "Workout Complete!".
- [x] Add/Update Tests
  - [x] Unit test: `linearizer` correctly sets `nextExercise` on `BLOCK_REST` steps.
  - [x] Unit test: `WorkoutPlayer` renders "Next:" preview during `BLOCK_REST`.

## Dev Notes

- **Architecture Patterns:**
  - **Data-Driven UI:** The `nextExercise` field is set in the linearizer (data layer), and the UI simply displays it. This keeps rendering logic dumb.
  - **Consistency:** Use the same "Next:" styling pattern as existing `REST` steps for visual consistency.

- **Source Tree Components:**
  - `src/utils/linearizer.js` (Add `nextExercise` to `BLOCK_REST` step)
  - `src/components/WorkoutPlayer.jsx` (Render `nextExercise` for `BLOCK_REST`)
  - `tests/unit/utils/linearizer.blockRest.test.js` (Update tests)
  - `tests/unit/components/WorkoutPlayer.test.jsx` (Update tests)

- **Testing Standards:**
  - Verify `nextExercise` is correctly populated for `BLOCK_REST` steps pointing to first exercise of next block.
  - Verify UI renders the preview text.

### Project Structure Notes

- **Previous Story (2.1) Learnings:**
  - `linearizer.js` inserts `BLOCK_REST` steps at line 95-103.
  - `BLOCK_REST` step currently has: `id`, `type`, `duration`, `blockName`, `blockIndex`.
  - Need to add `nextExercise` field.

- **Existing Pattern (REST steps):**
  - `REST` steps already have `nextExercise` set (line 85-87 in linearizer.js).
  - `WorkoutPlayer.jsx` already renders this for `REST` steps (lines 507-513).
  - Just need to extend this pattern to `BLOCK_REST`.

- **Parallel Execution Note (from Epic 1 Retro):**
  - This story is independent of Story 2.2. They can be developed in parallel.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3: Next Up Preview Support]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Next Up Preview]
- [Source: src/utils/linearizer.js#lines 85-87] (Existing pattern for REST nextExercise)
- [Source: src/components/WorkoutPlayer.jsx#lines 507-513] (Existing UI for REST nextExercise)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.5 Pro)

### Debug Log References

None required.

### Completion Notes List

- Added `nextExercise` field to `BLOCK_REST` steps in `linearizeWorkout()` function.
- `nextExercise` points to the first exercise of the NEXT block (uses getExercise lookup with drill ID fallback).
- WorkoutPlayer UI already renders `nextExercise` for rest steps (pattern reused from REST steps).
- Updated golden master snapshot to include new `nextExercise` field.
- Added 2 new tests: linearizer sets `nextExercise` correctly, WorkoutPlayer renders "Next:" preview.
- All 40 unit tests pass with no regressions.
- [Code Review Fix] Added test for AC3 edge case: verifies no BLOCK_REST before WORKOUT_COMPLETE.
- All 41 tests pass after fixes.

### File List

- `src/utils/linearizer.js` (modified)
- `tests/unit/utils/linearizer.blockRest.test.js` (modified)
- `tests/unit/utils/__snapshots__/linearizer.golden.test.js.snap` (updated)
- `tests/unit/components/WorkoutPlayer.test.jsx` (modified)

