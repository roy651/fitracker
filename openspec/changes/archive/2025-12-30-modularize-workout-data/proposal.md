# Proposal: Modularize Workout Data

**Change ID:** `modularize-workout-data`  
**Status:** PROPOSED  
**Created:** 2025-12-30

## Problem Statement

The current `workoutDatabase.js` is a monolithic file containing all exercises, workouts, programs, and helper functions. This creates several limitations:

1. **Scalability:** Adding new exercises/workouts requires modifying the entire database file
2. **Flexibility:** Only one hardcoded program is supported (6-week Ski Prep)
3. **Maintenance:** Data and logic are mixed together
4. **Future Growth:** Difficult to extend with new programs without bloating a single file

## Proposed Solution

Refactor the workout database into a modular, data-driven architecture:

### 1. Data Structure Modularization

**Move from:** Single `workoutDatabase.js` export  
**Move to:** JSON files organized by entity type

```
src/data/db/
├── exercises/
│   ├── warmup.json
│   ├── strength.json
│   ├── stability.json
│   └── power.json
├── workouts/
│   ├── phase1-gym.json
│   ├── phase1-home.json
│   ├── phase2-gym.json
│   └── phase2-home.json
└── programs/
    ├── ski-prep-6week.json
    └── example-custom.json (future extensibility)
```

**Benefits:**
- **Modularity:** Each JSON file can be edited independently
- **Composability:** Workouts reference exercises; programs reference workouts
- **Extensibility:** New programs = new JSON file (no code changes)
- **Clarity:** Separation of data from business logic

### 2. Database Loader Service

Keep `workoutDatabase.js` as a **service layer** that:
- Imports all JSON files from `db/` folders
- Provides helper functions (`getWorkoutTemplate`, `getExercise`, etc.)
- Handles validation and data integrity

### 3. Program Selection UI

Add UI component to allow users to choose programs:
- **Default behavior:** First program auto-selected (backward compatible)
- **Access:** Hidden behind menu/settings button (low-friction UX)
- **Persistence:** Remember user's program choice in localStorage
- **Display:** Show program name, duration, and description

## Design Decisions to Address

1. **Multiple JSON Files per Type:** Should we allow `exercises/warmup.json` + `exercises/strength.json`, or a single `exercises.json`?
   - **Recommendation:** Multiple files for better organization and maintainability
   - **Merge Strategy:** Deep merge by key (exercise ID, workout ID, program ID)

2. **Program Structure:** Programs should reference workouts by ID, workouts should reference exercises by ID
   - Enables true composability and reusability

3. **Backward Compatibility:** Existing components using `workoutDatabase` should continue working with minimal changes

## Capabilities Delivered

This change introduces two core capabilities:

1. **Modular Data Structure** (`specs/modular-data-structure/`)
   - JSON-based data files for exercises, workouts, programs
   - Loader service to aggregate and validate data
   - Helper functions for data access

2. **Program Selection UI** (`specs/program-selection-ui/`)
   - Component to display available programs
   - User can select and persist program choice
   - Seamless integration with existing workout flow

## Out of Scope

- Migration tools (manual one-time refactor acceptable)
- API-based data loading (keeping static data strategy)
- Multi-language support for exercise names/instructions
- User-created custom programs (future enhancement)

## Dependencies

- No external library changes required
- Vite already supports JSON imports natively
- Relies on existing localStorage for persistence

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing code | Maintain same export interface from `workoutDatabase.js` |
| JSON validation errors | Add runtime validation in loader service |
| Performance (multiple file loads) | Leverage Vite's bundler to optimize imports |
| Confusion about file merging | Document merge strategy clearly in design.md |

## Success Criteria

- [ ] All exercise/workout/program data moved to JSON files
- [ ] Helper functions in `workoutDatabase.js` continue to work
- [ ] Existing unit tests pass without modification
- [ ] New UI allows program selection and persists choice
- [ ] Documentation updated with new data structure conventions
- [ ] Validation passes: `openspec validate modularize-workout-data --strict`
