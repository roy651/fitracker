# Feature Specification: Modular Data Architecture

**Feature Branch**: `5-data-architecture`  
**Created**: 2025-12-30  
**Status**: Baseline  
**Source**: Converted from OpenSpec baseline specification

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access All Exercise Data Through Single Library (Priority: P1)

As a developer, I want to access exercises from a single library object regardless of which JSON file they're defined in, so I don't need to track file locations when building workouts.

**Why this priority**: Core data access pattern used throughout the app. Without unified exercise library, workout references break.

**Independent Test**: Add exercise to any category JSON file, build app, verify exercise is accessible via `getExercise(id)` function.

**Acceptance Scenarios**:

1. **Given** `exercises/warmup.json` contains "cat_cow" exercise, **When** code calls `getExercise('cat_cow')`, **Then** the exercise object shall be returned with name, instruction, and visual_ref fields
2. **Given** user adds new file `exercises/custom-cardio.json` with exercises, **When** app builds, **Then** Vite glob imports SHALL discover the file AND exercises SHALL be available in exercise_library WITHOUT code changes

---

### User Story 2 - Reference Exercises by ID in Workouts (Priority: P1)

As a workout designer, I want to reference exercises by ID in workout definitions, so I can reuse exercises across multiple workouts without duplicating data.

**Why this priority**: Enables DRY principle and makes workout maintenance scalable. Without ID references, exercise changes require updates in multiple places.

**Independent Test**: Create workout with exercise IDs, verify system resolves IDs to full exercise objects during workout execution.

**Acceptance Scenarios**:

1. **Given** workout references exercises ["cat_cow", "box_jump"], **When** workout loads, **Then** system SHALL resolve each ID from exercise_library AND build complete drill objects
2. **Given** multiple workouts reference same exercise ID, **When** exercise definition updates, **Then** all workouts SHALL reflect the update (single source of truth)

---

### User Story 3 - Organize Workouts into Programs with Schedules (Priority: P2)

As a user, I want workouts organized into programs with week-by-week schedules, so I can follow structured training progressions.

**Why this priority**: Structures content for long-term training. Core to 6-week program concept, but individual workouts still function without programs.

**Independent Test**: Define program JSON with 6-week schedule referencing workout IDs, verify program loads and schedule maps correctly to weeks and days.

**Acceptance Scenarios**:

1. **Given** `programs/ski-prep-6week.json` defines program with schedule, **When** `getPrograms()` is called, **Then** array SHALL include the program
2. **Given** program schedule maps Monday to "gym_monday_p1", **When** user selects week 1 and Monday, **Then** system SHALL load correct workout template

---

### User Story 4 - Extend Data Without Code Changes (Priority: P3)

As a developer adding content, I want to add new exercises or workouts by creating JSON files, so I can extend the app without modifying code.

**Why this priority**: Improves maintainability and reduces risk of bugs when adding content.

**Independent Test**: Add new JSON file to exercises or workouts folder, build app, verify content is automatically discovered and loaded.

**Acceptance Scenarios**:

1. **Given** user adds `exercises/yoga.json` with new exercises, **When** app builds, **Then** glob imports SHALL discover file AND exercises SHALL merge into library
2. **Given** two files define same exercise ID, **When** system loads, **Then** alphabetically-last file SHALL win AND warning SHALL log to console

---

### Edge Cases

- What happens if exercise ID referenced in workout doesn't exist? Log error, show placeholder exercise with "Missing: {id}" name
- How does system handle invalid JSON syntax? Build fails with clear error message pointing to problematic file
- What if visual_ref references non-existent image? Image fails to load, shows placeholder broken image icon
- How are duplicate IDs across files resolved? Last file alphabetically wins, warning logged to console

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST organize exercises into categorized JSON files under `src/data/db/exercises/`
- **FR-002**: System MUST use Vite's `import.meta.glob` to dynamically discover and load all JSON files
- **FR-003**: System MUST merge data from multiple files into single `exercise_library` object
- **FR-004**: System MUST detect duplicate IDs and use last-loaded definition with console warning
- **FR-005**: System MUST export `getExercise(id)` function to retrieve exercises by ID
- **FR-006**: System MUST store workouts as JSON files referencing exercises by ID (not inline definitions)
- **FR-007**: System MUST support program definitions with metadata and week-by-week schedules
- **FR-008**: System MUST export `getPrograms()` and `getProgramById(id)` functions
- **FR-009**: System MUST maintain backward compatibility with existing API exports (exercise_library, workout_templates, program_schedule)
- **FR-010**: System MUST export helper functions: `weekKeys`, `getDaysForWeek()`, `getWorkoutTemplate()`
- **FR-011**: System MUST validate exercise objects contain required fields: name, instruction, visual_ref
- **FR-012**: System MUST bundle all data into PWA for offline access

### Key Entities

- **Exercise**: Individual drill with name, instruction, visual reference (image filename), and category
- **Workout**: Training session with blocks containing rounds of drills (referenced by exercise IDs)
- **Program**: Collection of workouts organized into schedule with weeks and days
- **ExerciseLibrary**: Unified object containing all exercises keyed by ID
- **WorkoutTemplates**: Collection of workout definitions keyed by ID

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All exercises load and merge correctly with 100% availability (no missing IDs during workout references)
- **SC-002**: Adding new JSON file requires zero code changes and content appears after rebuild
- **SC-003**: Glob imports discover all `.json` files in exercise and workout directories (target: 100% discovery rate)
- **SC-004**: Duplicate ID detection logs warnings in 100% of conflict cases
- **SC-005**: Exercise resolution in workouts completes in under 10ms for typical workout (20-30 exercises)
- **SC-006**: Data architecture supports adding unlimited exercises, workouts, and programs without performance degradation
- **SC-007**: All backward-compatible API functions remain functional (0% breaking changes for existing components)
