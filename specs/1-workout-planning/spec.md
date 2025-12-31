# Feature Specification: Workout Planning & Selection

**Feature Branch**: `1-workout-planning`  
**Created**: 2025-12-30  
**Status**: Baseline  
**Source**: Converted from OpenSpec baseline specification

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Training Week (Priority: P1)

As a user, I want to select which week of my training program to work on, so I can progress through the 6-week ski preparation program at my own pace.

**Why this priority**: This is the core navigation mechanism for accessing workouts. Without week selection, users cannot access any training content.

**Independent Test**: Can be tested by navigating to the app, selecting different weeks, and verifying the UI updates with correct phase information and available workouts.

**Acceptance Scenarios**:

1. **Given** the user is on the Dashboard, **When** the user selects "Week 4" from the week selector, **Then** week 4 SHALL be highlighted AND the phase banner SHALL display "Phase 2: Power" AND available workouts SHALL update to Phase 2 content
2. **Given** the user has selected week 3, **When** the page reloads, **Then** week 3 SHALL remain selected (persisted in localStorage)
3. **Given** the user is a first-time visitor, **When** the app loads, **Then** week 1 SHALL be selected by default

---

### User Story 2 - Choose Training Day (Priority: P1)

As a user, I want to select a specific training day within my week, so I can see which workout I should do today.

**Why this priority**: Day selection is required to access individual workouts. This delivers immediate value by showing the user what to train.

**Independent Test**: After selecting a week, user can tap any training day and see that day's workout details.

**Acceptance Scenarios**:

1. **Given** week 1 is selected, **When** the Dashboard loads, **Then** three training days SHALL be displayed: Monday, Wednesday, Thursday
2. **Given** the user selects Wednesday, **When** they tap the Wednesday card, **Then** the card SHALL be highlighted with border and background AND other days SHALL appear muted
3. **Given** the user selects a different week, **When** the week changes, **Then** the day selection SHALL reset to none

---

### User Story 3 - Preview Workout Before Starting (Priority: P2)

As a user, I want to see what exercises and blocks are in my workout before I start, so I can prepare mentally and physically for the session.

**Why this priority**: Enhances user experience and sets expectations, but users can still start workouts without detailed preview.

**Independent Test**: Select any training day and verify workout statistics (total exercises, rounds, duration, block structure) are displayed accurately.

**Acceptance Scenarios**:

1. **Given** the user has selected Monday's workout, **When** the preview loads, **Then** the system SHALL display total number of exercises, total rounds, estimated duration, and list of blocks with round counts
2. **Given** the workout preview is shown, **When** all information is displayed, **Then** the "Start Workout" button SHALL become enabled
3. **Given** no workout day is selected, **When** the user is viewing the week, **Then** the "Start Workout" button SHALL be disabled

---

### User Story 4 - Switch Between Programs (Priority: P3)

As a user, I want to select different workout programs, so I can switch between training plans based on my goals.

**Why this priority**: Nice-to-have for users with multiple programs. Most users will stick with one program for the 6-week duration.

**Independent Test**: Access settings, select a different program, return to Dashboard, and verify workouts reflect the new program.

**Acceptance Scenarios**:

1. **Given** multiple programs are available, **When** the user opens settings and selects "6-Week Ski Preparation", **Then** the Dashboard SHALL display workouts from that program
2. **Given** a program has been selected, **When** the app reloads, **Then** the same program SHALL remain active (persisted)

---

### Edge Cases

- What happens when a week has no scheduled workouts? System SHALL display "No workouts scheduled" message
- How does system handle invalid week selection from corrupted localStorage? System SHALL default to week 1
- What if workout data is missing exercise details? System SHALL show workout title but display warning in preview

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all 6 weeks of the program with clear week numbers (1-6)
- **FR-002**: System MUST highlight the currently selected week with visual distinction (gradient background)
- **FR-003**: System MUST automatically detect and display the training phase based on week number
- **FR-004**: System MUST persist the selected program, week, and day in browser localStorage
- **FR-005**: System MUST display available training days for the selected week with workout type (Gym/Home)
- **FR-006**: System MUST show workout metadata including name and estimated duration for each day
- **FR-007**: System MUST provide a workout preview showing total exercises, rounds, duration, and block structure
- **FR-008**: System MUST enable the "Start Workout" button only when a training day is selected
- **FR-009**: System MUST reset day selection when the user changes weeks
- **FR-010**: System MUST default first-time users to week 1 of the default program

### Key Entities

- **Program**: Represents a complete training program with a schedule of weeks and workouts
- **Week**: A 7-day period within a program containing scheduled training days
- **Training Day**: A specific day (Monday-Sunday) with an assigned workout
- **Workout**: A structured training session with blocks, exercises, and timing
- **Phase**: Training phase (Base, Power, Peak) automatically determined by week number

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select any week and see corresponding workouts in under 2 seconds
- **SC-002**: 95% of users successfully select and preview a workout on their first visit without instructions
- **SC-003**: Week and day selections persist across app sessions with 100% reliability
- **SC-004**: Workout preview information is accurate and complete for all 18 scheduled workouts (6 weeks × 3 days)
- **SC-005**: Users can distinguish between selected and non-selected weeks/days through clear visual feedback
