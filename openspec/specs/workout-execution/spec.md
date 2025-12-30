# Workout Execution Specification

## Purpose

This specification defines the real-time workout player that guides users through their training sessions with timers, audio coaching, and progress tracking.

---

## Requirements

### Requirement: System SHALL execute workout steps in sequence

The workout player SHALL linearize workout blocks into a sequence of timed steps and execute them in order. Each step SHALL have a defined type and duration.

#### Scenario: Executing a workout with warmup and circuit

**Given** a workout with 2 blocks: "Warmup" (2 rounds) and "Circuit" (3 rounds)

**When** the workout starts

**Then** the system SHALL execute all Warmup rounds first

**And** then execute all Circuit rounds

**And** each drill SHALL be followed by rest

**And** block rest SHALL occur after completing all rounds in a block

---

### Requirement: System SHALL display current exercise with visual and text guidance

During work steps, the system SHALL show the current exercise name, instruction, and visual reference image.

#### Scenario: Displaying exercise guidance during work

**Given** the user is performing "Box Jump"

**Then** the player SHALL display "Box Jump" as the exercise name

**And** SHALL display "Explode up, land soft, step down." as instruction

**And** SHALL display the box_jump.png reference image

**And** SHALL show the current round number (e.g., "Round 2/4")

---

### Requirement: System SHALL provide countdown timers for all steps

Every timed step SHALL display a prominent countdown timer showing remaining seconds.

#### Scenario: Countdown during 45-second work period

**Given** the user is in a 45-second work step

**Then** the timer SHALL count down from 45 to 0

**And** the timer SHALL update every second

**And** the timer SHALL be clearly visible and large

**And** the timer SHALL show format "0:45", "0:44", etc.

---

### Requirement: System SHALL announce exercises via speech synthesis

When voice coaching is enabled, the system SHALL announce exercise names and instructions using text-to-speech.

#### Scenario: Voice announcement for exercise

**Given** voice coaching is enabled

**When** a new exercise step starts

**Then** the system SHALL speak the exercise name

**And** SHALL speak the exercise instruction

**And** announcements SHALL respect the global mute setting

---

### Requirement: System SHALL play audio cues for transitions

The system SHALL play sound effects to signal important transitions and events.

#### Scenario: Audio cues during workout

**Given** the workout is playing

**Then** the system SHALL play a beep sound when transitioning from work to rest

**And** SHALL play a beep when transitioning from rest to work

**And** SHALL play a completion sound when workout finishes

**And** audio SHALL respect the global mute setting

---

### Requirement: System SHALL support pause and resume

Users SHALL be able to pause the workout at any time and resume from the same point.

#### Scenario: Pausing and resuming workout

**Given** the workout is in progress at step 15 with 20 seconds remaining

**When** the user taps the pause button

**Then** the timer SHALL stop

**And** the pause button SHALL change to a resume button

**When** the user taps resume

**Then** the timer SHALL continue from 20 seconds

**And** the workout SHALL continue from step 15

---

### Requirement: System SHALL allow skipping to next step

Users SHALL be able to skip the current step and advance to the next one.

#### Scenario: Skipping a rest period

**Given** the user is in a 40-second rest period

**When** the user taps "Skip"

**Then** the rest period SHALL end immediately

**And** the next step SHALL begin

---

### Requirement: System SHALL display workout progress

The player SHALL show overall workout progress including current step number and total steps.

#### Scenario: Progress display

**Given** a workout with 48 total steps

**When** the user is on step 12

**Then** the system SHALL display "Step 12/48"

**And** a progress bar SHALL show 25% completion

---

### Requirement: System SHALL provide preview of next exercise during rest

During rest periods, the system SHALL show what exercise is coming next.

#### Scenario: Next exercise preview during rest

**Given** the user is resting before "Nordic Hamstring Drop"

**Then** the system SHALL display "Next: Nordic Hamstring Drop"

**And** SHALL show the exercise name prominently

---

### Requirement: System SHALL support exiting workout

Users SHALL be able to exit the workout at any time with confirmation.

#### Scenario: Exiting workout mid-session

**Given** the workout is in progress

**When** the user taps the exit button

**Then** the system SHALL return to the Dashboard

**And** workout progress SHALL not be saved (no resumption)

---

## Notes

- Step types include: WORK, REST, BLOCK_REST, WORKOUT_COMPLETE
- Timer accuracy target: ±100ms
- Audio and voice features degrade gracefully if browser APIs unavailable
- Wake lock keeps screen active during workout
