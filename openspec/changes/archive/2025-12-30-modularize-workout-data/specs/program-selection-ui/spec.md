# Spec: Program Selection UI

## ADDED Requirements

### Requirement: Users MUST be able to view all available programs

The application MUST provide a UI component that displays all available workout programs with their metadata.

#### Scenario: Displaying program list in settings

**Given** the app has loaded two programs:
- `ski-prep-6week` (6-Week Ski Preparation)
- `example-custom` (Custom 4-Week Program)

**When** the user taps the "Settings" icon in the Dashboard header

**And** taps "Change Program"

**Then** a list of programs must be displayed

**And** each program must show:
- Program name
- Description
- Duration (e.g., "6 weeks, 3 days/week")

**And** the currently selected program must be visually highlighted

---

### Requirement: Users MUST be able to select a program and persist their choice

Users MUST be able to switch between programs, and their selection MUST persist across app sessions.

#### Scenario: Selecting a new program

**Given** the user is on the "Change Program" screen

**And** the currently selected program is `ski-prep-6week`

**When** the user taps on `example-custom`

**Then** the program must be changed to `example-custom`

**And** the selection must be saved to `localStorage` with key `selectedProgram`

**And** a confirmation message must appear: "Program changed to Custom 4-Week Program"

**And** the Dashboard must refresh to show the new program's schedule

---

#### Scenario: Persisting program selection across sessions

**Given** the user has selected `example-custom` program

**And** the selection is saved to `localStorage`

**When** the user closes the app and reopens it

**Then** the app must load `example-custom` as the active program

**And** the Dashboard must display the `example-custom` schedule (not the default program)

---

### Requirement: First-time users MUST see the default program without manual selection

New users who have never selected a program MUST automatically use the first available program (currently `ski-prep-6week`).

#### Scenario: Default program selection for new users

**Given** the user has never opened the app before

**And** `localStorage` does not contain a `selectedProgram` key

**When** the app loads

**Then** the first program in the `programs` array must be auto-selected

**And** the Dashboard must display the default program's schedule

**And** no program selection prompt must be shown (zero-friction onboarding)

---

### Requirement: Program selector MUST be accessible but not intrusive

The program selection UI MUST be available in the settings menu, not prominently displayed on the main Dashboard (to avoid overwhelming users).

#### Scenario: Accessing program selector from settings

**Given** the user is on the Dashboard

**When** the user taps the "Settings" icon (gear icon)

**Then** a settings menu must appear with the option "Change Program"

**And** tapping "Change Program" must navigate to the program selection screen

---

#### Scenario: Program selector is hidden by default

**Given** the user opens the app

**Then** the Dashboard must not show a program selector dropdown or modal

**And** the currently selected program name may appear in the header (subtle indication)

**And** users who never change programs must never see the selection UI

---

### Requirement: Program changes MUST update all dependent components

When a user changes programs, all workout-related components MUST reflect the new program's data.

#### Scenario: Dashboard updates after program change

**Given** the user is on week 2, Monday of `ski-prep-6week`

**And** the user changes to `example-custom`

**When** the Dashboard reloads

**Then** the week selector must reset to week 1 of `example-custom`

**And** the day selector must show the days available in `example-custom` week 1

**And** the workout template must be fetched from `example-custom`'s schedule

---

### Requirement: Program selection UI MUST handle edge cases gracefully

The UI MUST handle scenarios like no programs available, invalid stored program ID, or single program.

#### Scenario: Handling invalid stored program ID

**Given** `localStorage` contains `selectedProgram: "deleted-program"`

**And** the program `deleted-program` no longer exists in the database

**When** the app loads

**Then** the app must fallback to the first available program

**And** `localStorage` must be updated with the fallback program ID

**And** no error must be shown to the user

---

#### Scenario: Single program hides program selector

**Given** only one program exists in the database (`ski-prep-6week`)

**When** the user opens the Settings menu

**Then** the "Change Program" option may be hidden (optional UX enhancement)

**And** the default program must still load correctly

---

## MODIFIED Requirements

### Requirement: Dashboard MUST load workout schedule from selected program

The Dashboard component MUST read the selected program ID and use its schedule instead of the hardcoded `program_schedule`.

#### Scenario: Dashboard loads selected program's schedule

**Given** the user has selected `example-custom` program

**When** the Dashboard component mounts

**Then** it must read `selectedProgramId` from `localStorage`

**And** it must call `getProgramById(selectedProgramId)` to fetch the program

**And** it must use `program.schedule` to populate week and day selectors

**And** it must pass the program's workouts to child components

---

## REMOVED Requirements

None. This change is additive (new feature).
