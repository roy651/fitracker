# Story 2.2: Block Rest UI Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see a clear countdown timer during block rest periods,
so that I know exactly how much time I have to recover before the next set of exercises begins.

## Acceptance Criteria

1. **Given** The workout transitions to a `BLOCK_REST` step
   **When** The player renders the screen
   **Then** It should interpret this state as a rest period
   **And** It should display the existing Rest UI (coffee icon/visual)
   **And** The label should read "Block Rest" instead of "Rest"

2. **Given** The block rest timer reaches zero
   **When** The step completes
   **Then** The existing transition logic should automatically advance to the first drill of the next block (via `BLOCK_START` step)
   **And** The existing rest chime should play (if audio is enabled)

3. **Given** The user skips during `BLOCK_REST`
   **When** They press the skip button
   **Then** The workout should advance to the next step normally

## Tasks / Subtasks

- [x] Update `src/components/WorkoutPlayer.jsx` - Step Initialization Effect
  - [x] Add case for `StepType.BLOCK_REST` in the `useEffect` that handles step initialization.
  - [x] Set duration from `currentStep.duration`.
  - [x] Start timer (`setIsRunning(true)`).
  - [x] Play rest start sound (same as `REST`): `audioManager.playRestStart()`.
- [x] Update `src/components/WorkoutPlayer.jsx` - Render Logic
  - [x] Handle `BLOCK_REST` in the rendering section (currently only `WORK` or `REST`).
  - [x] Display "Block Rest" label instead of just "Rest".
  - [x] Reuse existing rest UI styling (green background, coffee icon, countdown ring).
  - [x] Display block name context (e.g., "Block X complete").
- [x] Verify Timer Behavior
  - [x] Ensure countdown works correctly for `BLOCK_REST` steps.
  - [x] Ensure skip and pause controls work.
- [x] Add/Update Tests
  - [x] Unit test: `WorkoutPlayer` correctly initializes for `BLOCK_REST` step.
  - [x] Unit test: `WorkoutPlayer` renders "Block Rest" label.
  - [x] Integration test: Full flow through a workout with block rest.

## Dev Notes

- **Architecture Patterns:**
  - **Minimal Changes:** The UI for `BLOCK_REST` should be almost identical to `REST`. The key difference is the label text ("Block Rest" vs "Rest").
  - **State Reuse:** The timer logic (`isRunning`, `timeRemaining`, `setElapsedTotal`) is already generic. No changes needed there.
  - **Audio Cue:** Use the existing `audioManager.playRestStart()` for consistency.

- **Source Tree Components:**
  - `src/components/WorkoutPlayer.jsx` (Primary modification)
  - `tests/unit/components/WorkoutPlayer.test.jsx` (Updated tests)

- **Testing Standards:**
  - Mock `linearizeWorkout` to return a sequence including a `BLOCK_REST` step.
  - Verify render output includes "Block Rest" text.

### Project Structure Notes

- **Previous Story (2.1) Learnings:**
  - `linearizer.js` now correctly inserts `BLOCK_REST` steps.
  - `StepType.BLOCK_REST` is defined and works.
  - `calculateTotalDuration` and other utility functions already handle `BLOCK_REST`.
  
- **Parallel Execution Note (from Epic 1 Retro):**
  - Story 2.3 (Next Up Preview) is independent of this story. They can be developed in parallel if capacity allows.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: Block Rest UI Implementation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: State Machine Handling]
- [Source: _bmad-output/implementation-artifacts/2-1-block-rest-data-schema-state-logic.md#Completion Notes List]
- [Source: src/components/WorkoutPlayer.jsx] (Current implementation to extend)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.5 Pro)

### Debug Log References

None required.

### Completion Notes List

- Added `StepType.BLOCK_REST` case to step initialization useEffect in WorkoutPlayer.jsx.
- Timer, duration, and audio (`playRestStart`) are initialized identically to REST step.
- Updated render logic to detect `BLOCK_REST` as a rest variant using `isBlockRest` flag.
- Changed Rest indicator and h2 labels to display "Block Rest" when `isBlockRest` is true.
- Added block context text ("Block X complete") displayed during BLOCK_REST.
- Added 4 unit tests covering: label rendering, audio trigger, block context display, and skip behavior.
- All 38 unit tests pass with no regressions.
- [Code Review Fix] Removed unused `isRestStep` variable (lint error).
- [Code Review Fix] Fixed BLOCK_REST header showing `undefined/undefined` for round info - now conditionally renders.
- All 41 tests pass after fixes.

### File List

- `src/components/WorkoutPlayer.jsx` (modified)
- `tests/unit/components/WorkoutPlayer.test.jsx` (modified)

