# Data Architecture Specification

## Purpose

This specification defines the modular, JSON-based data architecture that stores exercises, workouts, and programs with support for extensibility.

---

## Requirements

### Requirement: System SHALL store exercises in categorized JSON files

Exercise data SHALL be organized into separate JSON files by category (warmup, strength, stability, power) under `src/data/db/exercises/`.

#### Scenario: Loading warmup exercises

**Given** the file `exercises/warmup.json` contains:
```json
{
  "cat_cow": {
    "name": "Cat-Cow Stretch",
    "instruction": "Move spine rhythmically. Breathe deeply.",
    "visual_ref": "cat_cow.png"
  }
}
```

**Then** the exercise library SHALL include `cat_cow`

**And** `getExercise('cat_cow')` SHALL return the exercise object

---

### Requirement: System SHALL load JSON files dynamically using glob imports

The system SHALL use Vite's `import.meta.glob` to discover and load all JSON files in data folders without hardcoding filenames.

#### Scenario: Automatic discovery of new exercise file

**Given** a user creates `exercises/custom-cardio.json` with new exercises

**When** the application builds

**Then** Vite glob imports SHALL discover custom-cardio.json

**And** exercises from custom-cardio.json SHALL be available in exercise_library

**And** NO code changes SHALL be required in workoutDatabase.js

---

### Requirement: System SHALL merge data from multiple files with duplicate detection

When multiple JSON files define the same ID, the system SHALL use a last-one-wins strategy and log a warning.

#### Scenario: Duplicate exercise ID across files

**Given** `exercises/file-a.json` defines exercise "box_jump"

**And** `exercises/file-b.json` also defines exercise "box_jump"

**When** the system loads exercises

**Then** the system SHALL use the definition from file-b.json (alphabetically last)

**And** SHALL log console warning: `⚠️  Duplicate ID detected: "box_jump" - using latest definition`

---

### Requirement: System SHALL store workouts referencing exercises by ID

Workout templates SHALL reference exercises by their ID, not inline definitions. Workouts SHALL be organized into JSON files by phase and type.

#### Scenario: Workout references exercises

**Given** a workout in `workouts/phase1-gym.json`:
```json
{
  "gym_monday_p1": {
    "name": "Mon: Foundation Strength",
    "blocks": [{
      "drills": ["cat_cow", "box_jump"]
    }]
  }
}
```

**Then** the workout SHALL reference exercises by ID

**And** the system SHALL resolve "cat_cow" from exercise_library

**And** the system SHALL resolve "box_jump" from exercise_library

---

### Requirement: System SHALL support multiple programs with schedules

Programs SHALL be defined as JSON files containing metadata and week-by-week schedules that reference workout IDs.

#### Scenario: Program with 6-week schedule

**Given** `programs/ski-prep-6week.json` contains:
```json
{
  "id": "ski-prep-6week",
  "name": "6-Week Ski Preparation",
  "schedule": {
    "week_1": {
      "Monday": "gym_monday_p1"
    }
  }
}
```

**Then** `getPrograms()` SHALL return array including this program

**And** `getProgramById('ski-prep-6week')` SHALL return the program

**And** the schedule SHALL reference workout template IDs

---

### Requirement: System SHALL maintain backward compatibility with existing API

The workoutDatabase module SHALL export the same helper functions and structure used by existing components.

#### Scenario: Backward compatible exports

**Then** `workoutDatabase.exercise_library` SHALL exist as object

**And** `workoutDatabase.workout_templates` SHALL exist as object

**And** `workoutDatabase.program_schedule` SHALL exist (defaults to first program's schedule)

**And** `weekKeys` SHALL be exported array

**And** `getDaysForWeek(weekKey)` SHALL be exported function

**And** `getWorkoutTemplate(weekKey, day)` SHALL be exported function

**And** `getExercise(exerciseId)` SHALL be exported function

---

### Requirement: System SHALL validate data schemas

Exercise objects SHALL include name, instruction, and visual_ref. Workout blocks SHALL include required fields.

#### Scenario: Valid exercise structure

**Given** an exercise definition

**Then** it SHALL have `name` property (string)

**And** SHALL have `instruction` property (string)

**And** SHALL have `visual_ref` property (string, image filename)

---

## Notes

- All data files use JSON format for portability
- Glob imports resolve at build time (no runtime file system access)
- Data is bundled into PWA for offline use
- Users can extend by adding files to `src/data/db/` folders
- File naming is flexible - any `.json` file is discovered
