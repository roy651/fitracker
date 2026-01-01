# Workout Planning Specification

## Purpose

This specification defines the program and workout selection capabilities that allow users to choose and preview their training.

---
## Requirements
### Requirement: System SHALL support multiple workout programs

Users SHALL be able to select from multiple available workout programs. The selected program SHALL persist across sessions.

#### Scenario: User selects a workout program

**Given** the app has multiple programs available

**When** the user opens the settings and selects "6-Week Ski Preparation"

**Then** the Dashboard SHALL display workouts from the selected program

**And** the selection SHALL be saved to localStorage

**And** the program SHALL remain selected after app reload

---

### Requirement: System SHALL allow week selection within a program

Users SHALL be able to select any week within the active program's schedule. Different weeks SHALL represent different training phases.

#### Scenario: User selects week 4 (Phase 2)

**Given** the user is on the Dashboard

**When** the user selects "Week 4" from the week selector

**Then** the week selector SHALL highlight week 4

**And** the available workouts SHALL update to Phase 2 workouts

**And** the day selection SHALL reset to none

<!-- REMOVED: **And** the phase banner SHALL update to "Phase 2: Power" -->

### Requirement: System SHALL display available training days for selected week

For each week, the system SHALL show which days have scheduled workouts. Users SHALL be able to select a training day to view workout details.

#### Scenario: User views available days for week 1

**Given** the user has selected week 1

**Then** the system SHALL display three training days: Monday, Wednesday, Thursday

**And** each day SHALL show the workout type (Gym/Home)

**And** each day SHALL show the workout name

**And** each day SHALL show estimated duration

---

### Requirement: System SHALL provide workout preview before starting

When a user selects a training day, the system SHALL display a preview of the workout including key statistics and block structure.

#### Scenario: User previews Monday's workout

**Given** the user has selected week 1

**When** the user taps "Monday"

**Then** the system SHALL display workout preview showing:
- Total number of exercises
- Total number of rounds
- Estimated duration in minutes
- List of workout blocks with round counts

**And** the "Start Workout" button SHALL become enabled

---

### Requirement: System SHALL highlight current selections

The UI SHALL provide clear visual feedback about which program, week, and day are currently selected.

#### Scenario: Visual selection feedback

**Given** the user has selected week 3 and Wednesday

**Then** week 3 button SHALL be highlighted with gradient background

**And** Wednesday card SHALL be highlighted with border and background

**And** other weeks and days SHALL have muted appearance

---

## Notes

- Week numbering is 1-indexed (week_1, week_2, etc.)
- Each program defines its own schedule structure
- Phase detection is automatic based on week number
- First-time users default to the first available program and week 1
