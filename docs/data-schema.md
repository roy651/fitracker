# Data Schema Reference

This document defines the JSON data structure for exercises, workouts, and programs in Ski Prep Pro.

## Overview

The application uses a modular, file-based data architecture where:
- **Exercises** are categorized into separate JSON files (warmup, strength, stability, power)
- **Workouts** are organized by phase and type (gym vs. home)
- **Programs** are self-contained JSON files with metadata and schedules

All data is loaded dynamically using Vite glob imports, allowing users to extend the app by adding custom JSON files without modifying code.

---

## Exercise Schema

**Location:** `src/data/db/exercises/*.json`

**Structure:** Flat object where keys are exercise IDs

```json
{
  "exercise_id": {
    "name": "Exercise Display Name",
    "instruction": "Brief coaching cue or instruction",
    "visual_ref": "filename.png"
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Display name shown in UI |
| `instruction` | string | ✅ | Coaching cue read by speech synthesis |
| `visual_ref` | string | ✅ | Filename of reference image in `public/images/` |

### Example

```json
{
  "cat_cow": {
    "name": "Cat-Cow Stretch",
    "instruction": "Move spine rhythmically. Breathe deeply.",
    "visual_ref": "cat_cow.png"
  },
  "box_jump": {
    "name": "Box Jump",
    "instruction": "Explode up, land soft, step down.",
    "visual_ref": "box_jump.png"
  }
}
```

---

## Workout Schema

**Location:** `src/data/db/workouts/*.json`

**Structure:** Flat object where keys are workout template IDs

```json
{
  "workout_id": {
    "name": "Workout Display Name",
    "blocks": [
      {
        "name": "Block Name",
        "rounds": 4,
        "drills": ["exercise_id_1", "exercise_id_2"],
        "work_sec": 50,
        "rest_sec": 40,
        "block_rest": 60
      }
    ]
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Workout display name |
| `blocks` | array | ✅ | Array of workout blocks |

### Block Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Block name (e.g., "Warmup", "Circuit") |
| `rounds` | number | ✅ | Number of rounds |
| `drills` | string[] | ✅ | Array of exercise IDs (must exist in exercise_library) |
| `work_sec` | number | ✅ | Work duration per drill in seconds |
| `rest_sec` | number | ✅ | Rest duration between drills in seconds |
| `block_rest` | number | ❌ | Optional rest after completing all rounds (seconds) |

### Example

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
      },
      {
        "name": "Circuit",
        "rounds": 4,
        "drills": ["goblet_sq_tempo", "rdl_heavy", "bulgarian_ss"],
        "work_sec": 50,
        "rest_sec": 40,
        "block_rest": 60
      }
    ]
  }
}
```

---

## Program Schema

**Location:** `src/data/db/programs/*.json`

**Structure:** Single program object per file

```json
{
  "id": "program-id",
  "name": "Program Display Name",
  "description": "Program description for UI",
  "duration_weeks": 6,
  "frequency": "3 days/week",
  "schedule": {
    "week_1": {
      "Monday": "workout_id_1",
      "Wednesday": "workout_id_2",
      "Thursday": "workout_id_3"
    }
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique program identifier |
| `name` | string | ✅ | Program display name |
| `description` | string | ✅ | Program description shown in selector |
| `duration_weeks` | number | ✅ | Total weeks in program |
| `frequency` | string | ✅ | Training frequency (e.g., "3 days/week") |
| `schedule` | object | ✅ | Week-by-week training schedule |

### Schedule Structure

The `schedule` object uses `week_N` keys mapping to day-workout pairs:

```json
{
  "week_1": {
    "Monday": "gym_monday_p1",
    "Wednesday": "gym_wednesday_p1",
    "Thursday": "home_thursday_p1"
  },
  "week_2": { ... }
}
```

- **Week keys:** Must be `week_1`, `week_2`, ..., `week_N` (1-indexed)
- **Day keys:** Day names (Monday, Tuesday, etc.)
- **Values:** Workout template IDs (must exist in workout_templates)

### Example

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
    },
    "week_2": {
      "Monday": "gym_monday_p1",
      "Wednesday": "gym_wednesday_p1",
      "Thursday": "home_thursday_p1"
    }
  }
}
```

---

## BYO (Bring Your Own) Extensibility

Users can extend the app by adding custom JSON files:

### Adding Custom Exercises

1. Create a new JSON file: `src/data/db/exercises/my-exercises.json`
2. Add exercise definitions following the exercise schema
3. Save the file
4. The glob import will automatically discover and load the exercises
5. No code changes required!

### Adding Custom Workouts

1. Create a new JSON file: `src/data/db/workouts/my-workouts.json`
2. Add workout templates following the workout schema
3. Reference exercises by their IDs (from any exercise file)
4. Save and the workouts are automatically available

### Adding Custom Programs

1. Create a new JSON file: `src/data/db/programs/my-program.json`
2. Define the program following the program schema
3. Reference existing workout IDs in the schedule
4. Save and the program appears in the program selector

### Duplicate IDs

If multiple files define the same ID (e.g., two files both have `"box_jump"`):
- The system uses a **last-one-wins** strategy (alphabetically last filename wins)
- A console warning is logged: `⚠️  Duplicate ID detected: "box_jump" - using latest definition`
- The app continues to function normally

---

## Data Loading (Technical)

The `workoutDatabase.js` service uses Vite glob imports:

```javascript
// Dynamically import ALL JSON files
const exerciseModules = import.meta.glob('./db/exercises/*.json', { eager: true });
const workoutModules = import.meta.glob('./db/workouts/*.json', { eager: true });
const programModules = import.meta.glob('./db/programs/*.json', { eager: true });

// Merge into unified database
const exercise_library = mergeModules(exerciseModules);
const workout_templates = mergeModules(workoutModules);
const programs = Object.values(programModules).map(m => m.default || m);
```

**Helper Functions:**
- `getExercise(exerciseId)` - Get exercise by ID
- `getWorkoutTemplate(weekKey, day)` - Get workout for a week/day
- `getPrograms()` - Get all available programs
- `getProgramById(programId)` - Get specific program by ID
- `weekKeys` - Array of week keys from current program
- `getDaysForWeek(weekKey)` - Get training days for a week

---

## Validation Rules

1. **Exercise IDs** must be unique across all exercise files (duplicate warning if not)
2. **Workout IDs** must be unique across all workout files
3. **Program IDs** must be unique across all program files
4. **Workout drills** must reference valid exercise IDs
5. **Program schedules** must reference valid workout IDs
6. **Week keys** in schedules must follow `week_N` format (1-indexed)
