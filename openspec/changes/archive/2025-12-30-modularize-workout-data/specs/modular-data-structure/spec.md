# Spec: Modular Data Structure

## ADDED Requirements

### Requirement: Exercise data MUST be stored in JSON files and loaded dynamically

Exercise definitions MUST be moved from the monolithic `workoutDatabase.js` object to JSON files under `src/data/db/exercises/`. The loader MUST use Vite glob imports (`import.meta.glob`) to load ALL `.json` files in the exercises folder, allowing users to add custom exercise files without code changes.

#### Scenario: Loading warmup exercises from warmup.json

**Given** the file `src/data/db/exercises/warmup.json` contains:
```json
{
  "cat_cow": {
    "name": "Cat-Cow Stretch",
    "instruction": "Move spine rhythmically. Breathe deeply.",
    "visual_ref": "cat_cow.png"
  }
}
```

**When** the application loads `workoutDatabase`

**Then** the exercise `cat_cow` must be available via `workoutDatabase.exercise_library.cat_cow`

**And** the exercise must contain all original fields: `name`, `instruction`, `visual_ref`

---

#### Scenario: Merging multiple exercise files into unified library

**Given** multiple exercise JSON files exist:
- `warmup.json` with exercises: `cat_cow`, `dyn_ham_scoop`, `hip_opener`, `cossack_sq`
- `strength.json` with exercises: `goblet_sq_tempo`, `rdl_heavy`, `bulgarian_ss`
- `stability.json` with exercises: `bosu_squat`, `bosu_bridge`, `dead_bug`, `plank_hold`
- `power.json` with exercises: `box_jump`, `skater_hops`, `nordic_drop`

**When** the loader uses `import.meta.glob('./db/exercises/*.json')` to load files

**Then** `workoutDatabase.exercise_library` MUST contain all exercises from ALL `.json` files as a single flat object

**And** the loader MUST NOT hardcode specific filenames

**And** a warning MUST be logged if duplicate exercise IDs are detected

**And** duplicate IDs MUST be resolved using last-one-wins strategy

---

### Requirement: Workout templates MUST be stored in JSON files and loaded dynamically

Workout template definitions MUST be moved to JSON files under `src/data/db/workouts/`. The loader MUST use Vite glob imports to load ALL `.json` files in the workouts folder. Workouts MUST reference exercises by ID (not inline objects).

#### Scenario: Loading Phase 1 gym workouts

**Given** the file `src/data/db/workouts/phase1-gym.json` contains:
```json
{
  "gym_monday_p1": {
    "name": "Mon: Foundation Strength",
    "blocks": [
      {
        "name": "Warmup",
        "rounds": 2,
        "drills": ["cat_cow", "dyn_ham_scoop", "hip_opener"],
        "work_sec": 45,
        "rest_sec": 15,
        "block_rest": 30
      }
    ]
  }
}
```

**When** the application loads `workoutDatabase`

**Then** the workout `gym_monday_p1` must be available via `workoutDatabase.workout_templates.gym_monday_p1`

**And** the `drills` array must contain exercise IDs that reference `exercise_library`

**And** all block properties (`rounds`, `work_sec`, `rest_sec`, `block_rest`) must be preserved

---

#### Scenario: Workouts reference exercises by ID

**Given** a workout contains `"drills": ["cat_cow", "goblet_sq_tempo"]`

**When** the helper function `getExercise("cat_cow")` is called

**Then** it must return the full exercise object from `exercise_library`

**And** the exercise object must include `name`, `instruction`, and `visual_ref`

---

### Requirement: Programs MUST be stored as self-contained JSON files with metadata and schedule

Program definitions MUST live in `src/data/db/programs/` as individual JSON files. Each program MUST contain metadata (name, description, duration) and a schedule referencing workout IDs.

####Scenario: Loading the default Ski Prep program

**Given** the file `src/data/db/programs/ski-prep-6week.json` contains:
```json
{
  "id": "ski-prep-6week",
  "name": "6-Week Ski Preparation",
  "description": "Build quad stamina, core stability, and explosive power for skiing",
  "duration_weeks": 6,
  "frequency": "3 days/week",
  "schedule": {
    "week_1": {
      "Monday": "gym_monday_p1",
      "Wednesday": "gym_wednesday_p1",
      "Thursday": "home_thursday_p1"
    }
  }
}
```

**When** the application loads `workoutDatabase`

**Then** `workoutDatabase.programs` must be an array containing the program object

**And** `workoutDatabase.program_schedule` must default to `ski-prep-6week.schedule` for backward compatibility

**And** the helper function `getProgramById("ski-prep-6week")` must return the full program object

---

#### Scenario: Program schedule references workouts by ID

**Given** a program contains `"week_1": { "Monday": "gym_monday_p1" }`

**When** `getWorkoutTemplate("week_1", "Monday")` is called

**Then** it must return the full workout object for `gym_monday_p1` from `workout_templates`

**And** the workout must include all blocks, rounds, and drill references

---

### Requirement: workoutDatabase.js MUST aggregate JSON files dynamically using glob imports

The `workoutDatabase.js` file MUST use Vite glob imports (`import.meta.glob`) to load ALL JSON files from each folder, merge them, and export the same interface as the current implementation to maintain backward compatibility.

#### Scenario: Backward compatibility with existing exports

**Given** the current implementation exports:
- `workoutDatabase` (object with `exercise_library`, `workout_templates`, `program_schedule`)
- `weekKeys` (array of week keys)
- `getDaysForWeek(weekKey)` (function)
- `getWorkoutTemplate(weekKey, day)` (function)
- `getExercise(exerciseId)` (function)

**When** the refactor uses `import.meta.glob` to load files

**Then** all existing exports MUST continue to work without changes

**And** existing unit tests MUST pass without modification

**And** no breaking changes MUST occur in consuming components

**And** the glob pattern MUST be `'./db/exercises/*.json'`, `'./db/workouts/*.json'`, `'./db/programs/*.json'`

---

#### Scenario: New helper functions for multi-program support

**Given** the refactored `workoutDatabase.js`

**When** the new helpers are added

**Then** the following functions must be available:
- `getPrograms()` – returns array of all programs
- `getProgramById(programId)` – returns specific program by ID

**And** these functions must be exported from `workoutDatabase.js`

---

### Requirement: Data validation MUST detect duplicate IDs and invalid references

The loader MUST validate data integrity at runtime to catch authoring errors.

#### Scenario: Warning on duplicate exercise IDs

**Given** two exercise files contain the same exercise ID `cat_cow`

**When** the loader merges the files using glob imports

**Then** a console warning MUST be logged: `⚠️  Duplicate ID detected: "cat_cow" - using latest definition`

**And** the later definition MUST overwrite the earlier one (last-one-wins strategy)

**And** the merge function MUST track all duplicate IDs encountered

---

#### Scenario: Detecting invalid workout references

**Given** a workout contains `"drills": ["nonexistent_exercise"]`

**When** `getExercise("nonexistent_exercise")` is called

**Then** it must return `null`

**And** a console warning should be logged (optional enhancement)

---

## MODIFIED Requirements

None. This change introduces new data architecture but does not modify existing functional requirements.

---

## REMOVED Requirements

None. Existing functionality is preserved through backward-compatible interface.
---

### NEW Scenario: BYO exercise files are automatically loaded

**Given** a user creates a new file `exercises/custom-cardio.json` containing:
```json
{
  "burpees": {
    "name": "Burpees",
    "instruction": "Full body explosive movement",
    "visual_ref": "burpees.png"
  }
}
```

**When** the application builds with Vite

**Then** the glob import MUST discover and load `custom-cardio.json`

**And** `workoutDatabase.exercise_library.burpees` MUST be available

**And** NO code changes in `workoutDatabase.js` are required

**And** the user MUST only need to drop the file into `exercises/` folder

---

### NEW Scenario: BYO workout files are automatically loaded

**Given** a user creates a new file `workouts/my-custom-routine.json` containing:
```json
{
  "custom_hiit": {
    "name": "Custom HIIT",
    "blocks": [
      {
        "name": "HIIT Block",
        "rounds": 3,
        "drills": ["burpees", "box_jump"],
        "work_sec": 30,
        "rest_sec": 15
      }
    ]
  }
}
```

**When** the application builds with Vite

**Then** the glob import MUST discover and load `my-custom-routine.json`

**And** `workoutDatabase.workout_templates.custom_hiit` MUST be available

**And** NO code changes in `workoutDatabase.js` are required

---
