# Tasks: Workout UI Enhancements

**Feature Branch**: `007-ui-enhancements`
**Status**: DRAFT

## Phase 1: Setup
- [x] T001 Verify feature branch is checked out `007-ui-enhancements`

## Phase 2: User Story 1 - Larger Drill Images (P1)
**Goal**: Increase visibility of active drill images for better form guidance.
**Independent Test**: Start workout, verify image size is ~2x larger, layout holds on mobile.

- [x] T101 [US1] Update `ExerciseVisual` component dimensions and responsiveness in `src/components/WorkoutPlayer.jsx`
- [x] T102 [US1] Manually verify layout responsiveness on mobile viewports

## Phase 3: User Story 2 - Visual Preview During Rest (P2)
**Goal**: Show upcoming drill image during rest for quick recognition.
**Independent Test**: Complete drill, verify "Next Up" shows image + name.

- [x] T201 [US2] Update `linearizeWorkout` to add `nextExerciseId`/`nextVisualRef` to REST steps in `src/utils/linearizer.js`
- [x] T202 [US2] Update Rest view to render `nextVisualRef` image alongside name in `src/components/WorkoutPlayer.jsx`
- [x] T203 [US2] Manually verify standard rest preview shows correct image

## Phase 4: User Story 3 - Next Drill in Block Rest (P2)
**Goal**: Show first drill of next block during block rests.
**Independent Test**: Complete block, verify "Next Up" shows next block's first drill image.

- [x] T301 [US3] Update `linearizeWorkout` to add `nextExerciseId`/`nextVisualRef` to BLOCK_REST steps in `src/utils/linearizer.js`
- [x] T302 [US3] Update `tests/unit/utils/linearizer.blockRest.test.js` to assert presence of `nextVisualRef`
- [x] T303 [US3] Update Block Rest view to render `nextVisualRef` image in `src/components/WorkoutPlayer.jsx`
- [x] T304 [US3] Manually verify block rest preview shows correct image

## Final Phase: Verification
- [x] T901 Run full unit test suite `npm run test:unit`
- [x] T902 Run E2E smoke tests `npm run test:e2e`

## Dependencies
- US2 and US3 depend on `linearizer.js` updates.
- US1 is independent (CSS/Layout only).
- Recommended Index: US1 -> US2 -> US3
