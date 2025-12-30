# Tasks: Modularize Workout Data

This file outlines the ordered implementation tasks for the `modularize-workout-data` change. Tasks are sequenced to deliver user-visible progress incrementally while maintaining backward compatibility.

---

## Phase 1: Data Migration (No Breaking Changes)

### Task 1.1: Create JSON folder structure
- Create `src/data/db/` directory
- Create subdirectories: `exercises/`, `workouts/`, `programs/`
- **Validation:** Verify folders exist via `ls src/data/db/`

### Task 1.2: Split exercise library into JSON files
- Create `exercises/warmup.json` with warmup exercises: `cat_cow`, `dyn_ham_scoop`, `hip_opener`, `cossack_sq`
- Create `exercises/strength.json` with strength exercises: `goblet_sq_tempo`, `rdl_heavy`, `bulgarian_ss`, `leg_press_sl`, `hamstring_curl`, `step_up`, `calf_raise`
- Create `exercises/stability.json` with stability exercises: `bosu_squat`, `bosu_bridge`, `bosu_sl_bal`, `bird_dog`, `dead_bug`, `plank_hold`, `pallof_press`
- Create `exercises/power.json` with power exercises: `box_jump`, `skater_hops`, `nordic_drop`, `russian_twist`
- **Validation:** Each JSON file must be valid (no syntax errors) and contain expected exercise IDs

### Task 1.3: Split workout templates into JSON files
- Create `workouts/phase1-gym.json` with `gym_monday_p1`, `gym_wednesday_p1`
- Create `workouts/phase1-home.json` with `home_thursday_p1`
- Create `workouts/phase2-gym.json` with `gym_monday_p2`, `gym_wednesday_p2`
- Create `workouts/phase2-home.json` with `home_thursday_p2`
- Create `workouts/test-workouts.json` with `test_block_rest_example`
- **Validation:** Each JSON file must be valid, workouts must reference exercise IDs correctly

### Task 1.4: Create default program JSON file
- Create `programs/ski-prep-6week.json` with:
  - Program metadata: `id`, `name`, `description`, `duration_weeks`, `frequency`
  - Full 6-week schedule (weeks 1-6 with Monday/Wednesday/Thursday)
- **Validation:** JSON file is valid, schedule references existing workout IDs

### Task 1.5: Refactor workoutDatabase.js to use Vite glob imports
- Use `import.meta.glob('./db/exercises/*.json', { eager: true })` for exercises
- Use `import.meta.glob('./db/workouts/*.json', { eager: true })` for workouts
- Use `import.meta.glob('./db/programs/*.json', { eager: true })` for programs
- Implement `mergeModules(modules)` helper function to merge and detect duplicates
- Merge exercises into `exercise_library` (NO hardcoded filenames)
- Merge workouts into `workout_templates` (NO hardcoded filenames)
- Build `programs` array from ALL program JSON files
- Set `program_schedule` to `programs[0]?.schedule || {}` for backward compatibility
- Keep all existing helper functions: `weekKeys`, `getDaysForWeek`, `getWorkoutTemplate`, `getExercise`
- **Validation:** Run existing unit tests – all must pass without modification

### Task 1.6: Add duplicate ID validation
- The `mergeModules()` helper must detect duplicate IDs during merge
- Log console warning: `⚠️  Duplicate ID detected: "<id>" - using latest definition`
- Implement last-one-wins strategy for duplicates (no error throwing)
- Track duplicates in a Set for reporting
- **Validation:** Create test with duplicate IDs and verify warning is logged

### Task 1.7: Test BYO file extensibility
- Create a test file `exercises/test-custom.json` with a new exercise
- Verify the exercise is loaded automatically (no code changes in workoutDatabase.js)
- Create a test file `workouts/test-custom.json` with a new workout
- Verify the workout is loaded automatically (no code changes)
- Remove test files after verification
- **Validation:** Confirm glob imports discover new files without modifying code

---

## Phase 2: Multi-Program Support

### Task 2.1: Add new helper functions for programs
- Implement `getPrograms()` – returns `workoutDatabase.programs` array
- Implement `getProgramById(programId)` – finds program by ID, returns `null` if not found
- Export new functions from `workoutDatabase.js`
- **Validation:** Write unit tests for new helper functions

### Task 2.2: Add unit tests for multi-program support
- Test: `getPrograms()` returns array of programs
- Test: `getProgramById("ski-prep-6week")` returns correct program
- Test: `getProgramById("nonexistent")` returns `null`
- Test: Program schedule references valid workout IDs
- **Validation:** Run `npm run test:unit` – all tests pass

---

## Phase 3: Program Selection UI

### Task 3.1: Create ProgramSelector component
- Create `src/components/ProgramSelector.jsx`
- Display list of programs with cards showing:
  - Program name
  - Description
  - Duration text (e.g., "6 weeks, 3 days/week")
- Highlight currently selected program
- Accept `onSelect(programId)` callback prop
- **Validation:** Render component in Storybook or test environment

### Task 3.2: Add program persistence logic
- Create custom hook `useProgramSelection.js` in `src/hooks/`
- Hook reads `selectedProgram` from localStorage on mount
- Hook provides `selectedProgramId` state and `setSelectedProgram(programId)` function
- Hook saves to localStorage when program changes
- Hook defaults to first program if no selection exists
- **Validation:** Write unit tests for hook behavior

### Task 3.3: Integrate program selection into Dashboard
- Import `useProgramSelection` hook in `Dashboard.jsx`
- Read selected program using `getProgramById(selectedProgramId)`
- Use selected program's schedule instead of hardcoded `program_schedule`
- Add "Settings" icon (gear) to Dashboard header
- Add "Change Program" option to settings menu
- Show `ProgramSelector` modal when option is clicked
- Reset to week 1 when program changes
- **Validation:** Manually test program switching in development build

### Task 3.4: Add E2E test for program selection
- Create `tests/e2e/program-selection.spec.js`
- Test: Default program loads on first visit
- Test: User can open settings and see "Change Program" option
- Test: User can select different program
- Test: Selected program persists after page reload
- Test: Dashboard shows new program's schedule after switch
- **Validation:** Run `npm run test:e2e` – all tests pass

---

## Phase 4: Documentation and Polish

### Task 4.1: Update project documentation
- Update `openspec/project.md` "Data Strategy" section to reflect JSON-based architecture
- Add section explaining exercise/workout/program organization
- **Validation:** Review documentation for accuracy

### Task 4.2: Add inline code documentation
- Add JSDoc comments to `workoutDatabase.js` explaining merge strategy
- Add comments to JSON files with structure examples
- **Validation:** Code review for clarity

### Task 4.3: Create data schema reference guide
- Create `docs/data-schema.md` with full schema reference
- Document JSON structure for exercises, workouts, programs
- Include examples and field descriptions
- **Validation:** Review guide for completeness

### Task 4.4: Final testing and verification
- Run full test suite: `npm run test:unit && npm run test:e2e`
- Verify no console errors in development build
- Test program switching manually on mobile device (Chrome + Safari)
- Verify offline functionality still works (PWA cache)
- **Validation:** All tests pass, no errors in console

---

## Dependencies

- **Task 1.5 depends on:** Tasks 1.1, 1.2, 1.3, 1.4 (all JSON files must exist first)
- **Task 2.1 depends on:** Task 1.5 (workoutDatabase.js must be refactored)
- **Task 3.2 depends on:** Task 2.1 (helper functions must exist)
- **Task 3.3 depends on:** Tasks 3.1, 3.2 (UI component and hook must exist)
- **Task 4.4 depends on:** All previous tasks (final verification)

## Parallelizable Work

- Tasks 1.2, 1.3, 1.4 can be done in parallel (independent JSON file creation)
- Tasks 3.1 and 3.2 can be done in parallel (UI component + hook are independent)
- Tasks 4.1, 4.2, 4.3 can be done in parallel (documentation updates)

---

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Data Migration | 2-3 hours |
| Phase 2: Multi-Program Support | 1-2 hours |
| Phase 3: Program Selection UI | 3-4 hours |
| Phase 4: Documentation | 1-2 hours |
| **Total** | **7-11 hours** |

---

## Rollback Plan

If issues arise during implementation:

1. **Phase 1 issues:** Revert `workoutDatabase.js` changes, restore original monolithic structure
2. **Phase 2 issues:** Remove new helper functions, keep backward-compatible interface
3. **Phase 3 issues:** Hide program selector UI, keep single-program behavior

Since Phase 1 maintains backward compatibility, the change can be deployed incrementally without breaking existing functionality.
