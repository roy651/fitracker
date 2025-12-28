# Story 2.1: Block Rest Data Schema & State Logic

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to update the workout data schema and linearizer logic to support a new `block_rest` property,
so that the application can mathematically sequence rest periods between blocks.

## Acceptance Criteria

1. **Given** The `workoutDatabase.js` file
   **When** A workout template is defined
   **Then** It should support an optional `block_rest` property (number of seconds) in the block definition

2. **Given** The `linearizer` service processes a workout
   **When** It encounters the end of a block that has `block_rest` defined
   **Then** It should insert a new step with type `StepType.BLOCK_REST`
   **And** The duration of that step should match the defined `block_rest` value

3. **Given** The last block of a workout
   **When** It is linearized
   **Then** No `BLOCK_REST` step should be added after the final block (workout is complete)

4. **Given** Existing workouts without `block_rest`
   **When** They are linearized
   **Then** They should continue to function exactly as before (Regression Check)

## Tasks / Subtasks

- [x] **CRITICAL: Create Golden Master Regression Suite** (Retro Action Item)
  - [x] Create a script/test to capture the exact JSON output of `linearizer` for all existing workout templates.
  - [x] Save this output as a snapshot.
  - [x] Verify that current code produces this output cleanly.
- [x] Update `src/utils/linearizer.js` (or wherever StepType is defined)
  - [x] Add `BLOCK_REST` to `StepType` enum/constants.
- [x] Update `src/data/workoutDatabase.js`
  - [x] Add `block_rest: 30` (or similar) to at least one workout block for testing purposes (e.g., in a new test template or updating an existing one if safe).
- [x] Update `src/utils/linearizer.js` Logic
  - [x] Implement logic to check for `block_rest` at the end of a block loop.
  - [x] Insert `BLOCK_REST` step if applicable.
  - [x] Ensure it does NOT insert it after the very last block of the workout.
- [x] Verify Logic with Tests
  - [x] Run Golden Master tests against new logic for OLD templates (must pass).
  - [x] Create new tests for templates WITH `block_rest` to verify new steps are inserted correctly.

## Dev Notes

- **Architecture Patterns:**
  - **Pure Functions:** `linearizer` should remain a pure function. Input -> Output. No side effects.
  - **Regression Safety:** This is the core engine of the app. Breaking this breaks everything. The Golden Master approach is non-negotiable.
  - **Backward Compatibility:** Existing workouts likely don't have `block_rest`. The code must handle `undefined` or `null` gracefully.

- **Source Tree Components:**
  - `src/utils/linearizer.js` (Logic)
  - `src/data/workoutDatabase.js` (Data)
  - `tests/unit/utils/linearizer.test.js` (New/Updated tests)

- **Testing Standards:**
  - **Golden Master:** Capture current state, ensuring refactor keeps old behavior 100% identical.
  - **Unit Tests:** new cases for the block rest insertion logic (Standard/Edge cases).

### Project Structure Notes

- **Unified Structure:** Logic stays in `src/utils/`.
- **Naming:** use `BLOCK_REST` (screaming snake case) for the enum/constant to match existing `REST` or `WORK` types.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1: Block Rest Data Schema & State Logic]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: State Machine Handling]
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2025-12-28.md#Action Items & Commitments]

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Debug Log References

### Completion Notes List

- Implemented `BLOCK_REST` step insertion in `linearizeWorkout`.
- Created Golden Master Regression Suite (`tests/unit/utils/linearizer.golden.test.js`) to protect existing workout logic.
- Added `test_block_rest_example` template to `workoutDatabase.js` for verification.
- Verified logic with new unit tests (`tests/unit/utils/linearizer.blockRest.test.js`).
- All existing tests pass (No regressions).
- [Code Review Fix] Updated `calculateTotalDuration`, `calculateElapsedTime`, and `getWorkoutSummary` to include `BLOCK_REST` duration.
- [Code Review Fix] Added untracked story artifacts and tests to git.

### File List

- `src/utils/linearizer.js`
- `src/data/workoutDatabase.js`
- `tests/unit/utils/linearizer.golden.test.js`
- `tests/unit/utils/linearizer.blockRest.test.js`
