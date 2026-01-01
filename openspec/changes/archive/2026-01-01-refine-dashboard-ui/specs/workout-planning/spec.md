# Workout Planning Spec Delta

## MODIFIED Requirements

### Requirement: System SHALL allow week selection within a program

Users SHALL be able to select any week within the active program's schedule. Different weeks SHALL represent different training phases.

#### Scenario: User selects week 4 (Phase 2)

**Given** the user is on the Dashboard

**When** the user selects "Week 4" from the week selector

**Then** the week selector SHALL highlight week 4

**And** the available workouts SHALL update to Phase 2 workouts

**And** the day selection SHALL reset to none

<!-- REMOVED: **And** the phase banner SHALL update to "Phase 2: Power" -->
