# Design: Modularize Workout Data

## Architecture Overview

This change refactors the data architecture from a monolithic JavaScript object to a **composable, JSON-based data layer** with clear separation of concerns.

### Current Architecture

```
workoutDatabase.js
├── exercise_library {} (22 exercises)
├── workout_templates {} (7 workouts)
├── program_schedule {} (1 hardcoded 6-week program)
└── helper functions (getWorkoutTemplate, getExercise, etc.)
```

**Pain Points:**
- All data + logic in one 355-line file
- No way to add programs without code changes
- Difficult to organize exercises by category
- Helper functions tightly coupled to data structure

### Proposed Architecture

```
src/data/
├── db/                          # JSON data files
│   ├── exercises/
│   │   ├── warmup.json         # cat_cow, dyn_ham_scoop, hip_opener, cossack_sq
│   │   ├── strength.json       # goblet_sq_tempo, rdl_heavy, bulgarian_ss, etc.
│   │   ├── stability.json      # bosu_*, bird_dog, dead_bug, plank_hold
│   │   └── power.json          # box_jump, skater_hops, nordic_drop, etc.
│   ├── workouts/
│   │   ├── phase1-gym.json     # gym_monday_p1, gym_wednesday_p1
│   │   ├── phase1-home.json    # home_thursday_p1
│   │   ├── phase2-gym.json     # gym_monday_p2, gym_wednesday_p2
│   │   ├── phase2-home.json    # home_thursday_p2
│   │   └── test-workouts.json  # test_block_rest_example
│   └── programs/
│       └── ski-prep-6week.json # Current 6-week program
│
└── workoutDatabase.js           # Service layer (loader + helpers)
```

**Benefits:**
- **Data/Logic Separation:** JSON = data, JS = logic
- **Composability:** Programs → Workouts → Exercises (by ID reference)
- **Extensibility:** New programs/exercises = new JSON files
- **Maintainability:** Easier to find and update specific data

---

## Data Schema Design

### 1. Exercise Schema

Each exercise JSON file contains a flat object of exercise definitions:

```json
{
  "cat_cow": {
    "name": "Cat-Cow Stretch",
    "instruction": "Move spine rhythmically. Breathe deeply.",
    "visual_ref": "cat_cow.png"
  },
  "dyn_ham_scoop": {
    "name": "Dynamic Hamstring Scoop",
    "instruction": "Step forward, heel down, scoop ground.",
    "visual_ref": "ham_scoop.png"
  }
}
```

**Merge Strategy:** When loading multiple exercise files, deep merge by key into single `exercise_library` object.

### 2. Workout Schema

Each workout JSON file contains workout template definitions:

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

**Key Points:**
- `drills` array contains **exercise IDs** (references to exercise_library)
- Maintains exact same structure as current implementation
- `block_rest` is optional (defaults to undefined)

### 3. Program Schema

Programs define the schedule and metadata:

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
    "week_2": { /* same as week_1 */ },
    "week_3": { /* same as week_1 */ },
    "week_4": {
      "Monday": "gym_monday_p2",
      "Wednesday": "gym_wednesday_p2",
      "Thursday": "home_thursday_p2"
    },
    "week_5": { /* same as week_4 */ },
    "week_6": { /* same as week_4 */ }
  }
}
```

**Key Points:**
- Each program is self-contained
- `schedule` references **workout IDs** (from workout_templates)
- Metadata supports future UI enhancements (program browser)

---

## File Loading Strategy

### Approach: **Vite Glob Imports for True Extensibility**

**Why Vite glob imports?**
- **True BYO Support:** Users can drop any `.json` file into folders without modifying code
- **Build-time bundling:** Vite resolves globs at build time (no runtime fs.readdir needed)
- **Offline-First:** All files bundled into PWA (no async fetching)
- **Tree-shaking:** Vite automatically optimizes bundle

**Implementation in workoutDatabase.js:**

```javascript
// Dynamically import ALL JSON files from each folder
const exerciseModules = import.meta.glob('./db/exercises/*.json', { eager: true });
const workoutModules = import.meta.glob('./db/workouts/*.json', { eager: true });
const programModules = import.meta.glob('./db/programs/*.json', { eager: true });

// Helper to merge module imports into flat object
function mergeModules(modules) {
  const merged = {};
  const duplicates = new Set();
  
  Object.values(modules).forEach(module => {
    const data = module.default || module;
    Object.keys(data).forEach(key => {
      if (merged[key]) {
        console.warn(`⚠️  Duplicate ID detected: "${key}" - using latest definition`);
        duplicates.add(key);
      }
      merged[key] = data[key]; // Last-one-wins strategy
    });
  });
  
  return merged;
}

// Merge all exercises from any JSON file in exercises/
const exercise_library = mergeModules(exerciseModules);

// Merge all workouts from any JSON file in workouts/
const workout_templates = mergeModules(workoutModules);

// Build programs array (each file is one program)
const programs = Object.values(programModules).map(module => module.default || module);

// Export unified database (backward compatible)
export const workoutDatabase = {
  exercise_library,
  workout_templates,
  program_schedule: programs[0]?.schedule || {}, // Default to first program for backward compat
  programs, // New: array of all available programs
};

// Existing helper functions remain unchanged
export const weekKeys = Object.keys(workoutDatabase.program_schedule);
export const getDaysForWeek = (weekKey) => { /* ... */ };
export const getWorkoutTemplate = (weekKey, day) => { /* ... */ };
export const getExercise = (exerciseId) => { /* ... */ };

// New helper functions
export const getPrograms = () => workoutDatabase.programs;
export const getProgramById = (programId) => workoutDatabase.programs.find(p => p.id === programId);
```

**Merge Behavior:**
- **Exercises:** Deep merge across ALL `.json` files in `exercises/` folder
- **Workouts:** Deep merge across ALL `.json` files in `workouts/` folder
- **Programs:** Each `.json` file in `programs/` is one program (array of programs)
- **Duplicates:** Last-one-wins with console warning

**Extensibility Benefits:**
- User adds `exercises/custom-cardio.json` → automatically loaded ✅
- User adds `workouts/my-routine.json` → automatically loaded ✅
- User adds `programs/beginner-plan.json` → automatically loaded ✅
- No code changes required, just drop files into folders 🎉

**Base Files Provided:**
- `exercises/warmup.json`, `exercises/strength.json`, `exercises/stability.json`, `exercises/power.json`
- `workouts/phase1-gym.json`, `workouts/phase1-home.json`, `workouts/phase2-gym.json`, `workouts/phase2-home.json`, `workouts/test-workouts.json`
- `programs/ski-prep-6week.json`

---

## Program Selection UX

### User Flow

1. **First Time User:**
   - App auto-selects first program (`ski-prep-6week`)
   - User sees "Ski Prep Pro" in header/title
   - No action required (zero friction)

2. **Accessing Program Selector:**
   - Tap **Settings** icon (gear icon in header)
   - See "Change Program" option in settings menu

3. **Selecting a Program:**
   - Shows list of available programs with:
     - Program name
     - Description
     - Duration (e.g., "6 weeks, 3 days/week")
   - User taps to select
   - Confirmation: "Program changed to [name]"

4. **Persistence:**
   - Selected program ID saved to `localStorage`
   - On app reload, selected program is restored
   - If no selection, default to first program

### Component Design

**New Component:** `ProgramSelector.jsx`
- Displays programs in a card list
- Highlights currently selected program
- Calls `onSelect(programId)` handler

**Modified Component:** `Dashboard.jsx`
- Reads `selectedProgramId` from localStorage
- Passes selected program to child components
- Shows "Change Program" button in settings

**State Management:**
```javascript
// In Dashboard.jsx
const [selectedProgramId, setSelectedProgramId] = useState(
  localStorage.getItem('selectedProgram') || programs[0].id
);

const handleProgramChange = (programId) => {
  setSelectedProgramId(programId);
  localStorage.setItem('selectedProgram', programId);
};
```

---

## Migration Strategy

### Phase 1: Data Migration (No Breaking Changes)

1. Create `src/data/db/` folder structure
2. Split current `workoutDatabase` object into JSON files
3. Update `workoutDatabase.js` to import and merge JSON files
4. **Backward Compatibility:** Export same interface
5. Run existing unit tests (should pass without changes)

### Phase 2: Add Multi-Program Support

1. Create `programs/` folder with `ski-prep-6week.json`
2. Add `programs` array to `workoutDatabase` export
3. Add helper functions: `getPrograms()`, `getProgramById()`
4. Update tests to verify new helpers

### Phase 3: Build Program Selection UI

1. Create `ProgramSelector.jsx` component
2. Add program selection to `Dashboard.jsx` settings
3. Implement localStorage persistence
4. Add E2E test for program switching

---

## Trade-offs and Decisions

### Decision 1: Multiple JSON Files vs Single File per Type

**Choice:** Multiple JSON files per type (✅ Recommended)

| Approach | Pros | Cons |
|----------|------|------|
| **Multiple files** | Better organization, easier to find/edit specific data, supports categorization | Requires merge logic, more imports |
| **Single file** | Simpler loading logic, fewer files | Large files hard to navigate, poor organization |

**Rationale:** With 22+ exercises and growing, splitting by category (warmup, strength, stability, power) improves maintainability significantly.

### Decision 2: Program Schedule Structure

**Choice:** Programs are self-contained JSON files with embedded schedule (✅ Recommended)

| Approach | Pros | Cons |
|----------|------|------|
| **Embedded schedule** | One file = one program, easy to add/remove programs | Duplication if multiple programs share weeks |
| **Separate schedule files** | More DRY if programs share structure | Complex references, harder to understand |

**Rationale:** Programs will likely differ in structure (different durations, frequencies), so self-contained is clearer.

### Decision 3: Default Program Selection

**Choice:** Auto-select first program, hide selector by default (✅ Recommended)

**Rationale:**
- Current users expect seamless onboarding (no extra steps)
- Most users will use the default "Ski Prep" program
- Advanced users can discover program selector in settings
- Future: Could add onboarding flow when multiple programs exist

---

## Testing Strategy

### Unit Tests
- **Test:** `workoutDatabase` export structure matches current schema
- **Test:** Helper functions (`getExercise`, `getWorkoutTemplate`) work correctly
- **Test:** `getPrograms()` returns array of programs
- **Test:** `getProgramById()` finds correct program
- **Test:** Duplicate ID detection logs warning and uses last-one-wins strategy

### BYO Extensibility Tests (Critical)

These tests validate that the glob import system truly allows seamless file additions without code changes:

#### Exercise Extensibility Test
```javascript
// Test: Custom exercise file is automatically discovered
test('BYO exercise file is loaded without code changes', () => {
  // 1. Create src/data/db/exercises/test-custom.json with new exercise
  // 2. Rebuild with Vite (to trigger glob import resolution)
  // 3. Verify workoutDatabase.exercise_library contains the new exercise
  // 4. Verify NO modifications to workoutDatabase.js were needed
  // 5. Delete test file
});
```

#### Workout Extensibility Test
```javascript
// Test: Custom workout file is automatically discovered
test('BYO workout file is loaded without code changes', () => {
  // 1. Create src/data/db/workouts/test-custom.json with new workout
  // 2. Rebuild with Vite
  // 3. Verify workoutDatabase.workout_templates contains the new workout
  // 4. Verify NO modifications to workoutDatabase.js were needed
  // 5. Delete test file
});
```

#### Duplicate ID Test
```javascript
// Test: Last-one-wins strategy with console warning
test('Duplicate exercise IDs use last-one-wins with warning', () => {
  // 1. Create two exercise files with same exercise ID
  // 2. Mock console.warn
  // 3. Load workoutDatabase
  // 4. Verify warning was logged: ⚠️  Duplicate ID detected...
  // 5. Verify later definition was used
});
```

**Validation Criteria:**
- ✅ New JSON files are discovered by glob imports
- ✅ No imports added to `workoutDatabase.js`
- ✅ `mergeModules()` correctly merges all discovered files
- ✅ Build succeeds without errors
- ✅ PWA bundle includes all files

### Integration Tests
- **Test:** `ProgramSelector` component renders program list
- **Test:** Selecting program updates localStorage
- **Test:** Dashboard loads selected program from localStorage
- **Test:** Adding new program JSON file makes it appear in ProgramSelector (after rebuild)

### E2E Tests
- **Test:** User can switch programs and see updated workout schedule
- **Test:** Selected program persists across page reload

### Manual Validation Steps

**Step 1: Verify Base Files Load Correctly**
1. Run `npm run dev`
2. Open developer console
3. Verify no glob import errors
4. Check `workoutDatabase.exercise_library` has 22+ exercises
5. Check `workoutDatabase.workout_templates` has 7 workouts
6. Check `workoutDatabase.programs` has 1 program

**Step 2: Test BYO Exercise File**
1. Create `src/data/db/exercises/my-custom.json` with test exercise
2. Save file, let Vite HMR reload
3. In console: `workoutDatabase.exercise_library.test_exercise` should return object ✅
4. Delete `my-custom.json`

**Step 3: Test BYO Workout File**
1. Create `src/data/db/workouts/my-workout.json` with valid workout
2. Save and reload
3. Verify workout appears in `workoutDatabase.workout_templates` ✅
4. Delete file

**Step 4: Test Duplicate ID Warning**
1. Add duplicate exercise ID to a custom file
2. Check console for warning: `⚠️  Duplicate ID detected...` ✅
3. Verify app still works (last-one-wins)

---

### Integration Tests
- **Test:** `ProgramSelector` component renders program list
- **Test:** Selecting program updates localStorage
- **Test:** Dashboard loads selected program from localStorage

### E2E Tests
- **Test:** User can switch programs and see updated workout schedule
- **Test:** Selected program persists across page reload

---

## Documentation Updates

**Files to Update:**
1. `openspec/project.md` – Update "Data Strategy" section to reflect JSON-based structure
2. `README.md` – Add section on data architecture
3. Inline comments in `workoutDatabase.js` – Document merge strategy

**New Documentation:**
1. `docs/data-schema.md` – Full schema reference for exercises, workouts, programs
2. `docs/adding-programs.md` – Guide for creating new program JSON files

---

## Future Enhancements (Out of Scope)

1. **Program Builder UI:** Allow users to create custom programs
2. **Import/Export:** Share programs as JSON files
3. **Cloud Sync:** Sync programs across devices
4. **Exercise Categories:** Add tags (e.g., "upper_body", "cardio")
5. **Workout Difficulty Ratings:** Help users filter workouts

---

## Success Metrics

- ✅ All existing unit tests pass without modification
- ✅ No performance regression (app loads in <2s)
- ✅ Code maintainability: Exercise can be added in <5 minutes
- ✅ Future-proof: New program can be added without code changes
