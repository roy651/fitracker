# Feature Specification: Real-Time Workout Execution

**Feature Branch**: `2-workout-execution`  
**Created**: 2025-12-30  
**Status**: Baseline  
**Source**: Converted from OpenSpec baseline specification

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Follow Guided Workout with Timers (Priority: P1)

As a user, I want the app to guide me through my workout with countdown timers for each exercise and rest period, so I can focus on form rather than watching the clock.

**Why this priority**: This is the core value proposition - the workout player. Without this, the app has no purpose.

**Independent Test**: Start any workout and verify that exercises are displayed in sequence with accurate countdown timers that update every second.

**Acceptance Scenarios**:

1. **Given** a workout with warmup (2 rounds) and circuit (3 rounds), **When** the workout starts, **Then** all warmup rounds SHALL execute first, followed by all circuit rounds
2. **Given** the user is in a 45-second work step, **When** the timer runs, **Then** it SHALL count down from 45 to 0, updating every second in format "0:45", "0:44", etc.
3. **Given** the user is performing "Box Jump", **When** the work step is active, **Then** the exercise name, instruction, and reference image SHALL be displayed
4. **Given** a workout with 48 total steps, **When** the user is on step 12, **Then** "Step 12/48" SHALL be displayed with a 25% progress bar

---

### User Story 2 - Receive Audio and Voice Coaching (Priority: P2)

As a user, I want to hear voice announcements telling me which exercise to do and audio beeps for transitions, so I don't need to look at my phone during the workout.

**Why this priority**: Significantly enhances workout experience but app is still usable without audio (visual cues remain).

**Independent Test**: Enable voice coaching, start workout, and verify exercise names and instructions are announced at the start of each work step.

**Acceptance Scenarios**:

1. **Given** voice coaching is enabled, **When** a new exercise step starts, **Then** the system SHALL speak the exercise name AND speak the exercise instruction
2. **Given** the workout is playing, **When** transitioning from work to rest, **Then** a beep sound SHALL play
3. **Given** audio is muted, **When** any transition occurs, **Then** NO sounds or voice SHALL play BUT visual cues SHALL continue normally
4. **Given** voice coaching is enabled, **When** announcements occur, **Then** they SHALL respect the global mute setting

---

### User Story 3 - Control Workout Playback (Priority: P1)

As a user, I want to pause, resume, and skip steps during my workout, so I can adapt if I need a break or want to move faster.

**Why this priority**: Essential for real-world usage - users need control over pacing and interruptions.

**Independent Test**: Start a workout, pause it mid-step, verify timer stops and resume button appears, then resume and verify timer continues from where it stopped.

**Acceptance Scenarios**:

1. **Given** the workout is at step 15 with 20 seconds remaining, **When** the user taps pause, **Then** the timer SHALL stop AND the button SHALL change to "Resume"
2. **Given** the workout is paused, **When** the user taps resume, **Then** the timer SHALL continue from 20 seconds AND the workout SHALL continue from step 15
3. **Given** the user is in a 40-second rest period, **When** the user taps "Skip", **Then** the rest SHALL end immediately AND the next step SHALL begin
4. **Given** the workout is in progress, **When** the user taps exit, **Then** the system SHALL return to Dashboard AND progress SHALL NOT be saved

---

### User Story 4 - Preview Next Exercise During Rest (Priority: P3)

As a user, I want to see what exercise is coming next while I'm resting, so I can mentally and physically prepare.

**Why this priority**: Nice quality-of-life feature that helps users prepare but doesn't block core functionality.

**Independent Test**: During any rest period, verify that the next exercise name is displayed prominently.

**Acceptance Scenarios**:

1. **Given** the user is resting before "Nordic Hamstring Drop", **When** the rest step is active, **Then** "Next: Nordic Hamstring Drop" SHALL be displayed prominently

---

### Edge Cases

- What happens when user closes the app mid-workout? Workout progress is not saved; they restart from beginning
- How does system handle timer drift over long workouts? Uses delta-time calculation to prevent cumulative drift
- What if speech synthesis fails mid-workout? Logs error, continues workout with visual-only cues
- What happens if the user's device goes to sleep? Wake lock should prevent this, but if it fails, workout pauses

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST linearize nested workout structure (blocks → rounds → drills) into sequential steps
- **FR-002**: System MUST display countdown timers for all WORK, REST, and BLOCK_REST steps
- **FR-003**: System MUST show exercise name, instruction text, and reference image during work steps
- **FR-004**: System MUST show current round information (e.g., "Round 2/4") during exercises
- **FR-005**: System MUST announce exercise names and instructions via text-to-speech when voice is enabled
- **FR-006**: System MUST play audio beeps for work-to-rest and rest-to-work transitions
- **FR-007**: System MUST play completion sound when workout finishes
- **FR-008**: System MUST respect global mute setting for all audio and voice features
- **FR-009**: System MUST allow pause/resume without losing position or time
- **FR-010**: System MUST allow skipping current step to advance immediately
- **FR-011**: System MUST display overall workout progress (current step / total steps and percentage)
- **FR-012**: System MUST show preview of next exercise during rest periods
- **FR-013**: System MUST allow exiting workout at any time and return to Dashboard
- **FR-014**: System MUST use requestAnimationFrame for smooth timer updates
- **FR-015**: System MUST cancel animation frames and timers on component unmount

### Key Entities

- **Step**: A single timed segment with type (WORK, REST, BLOCK_REST, WORKOUT_COMPLETE) and duration
- **LinearizedWorkout**: Flat array of Steps created from nested workout structure
- **Exercise**: Reference to an exercise from the database with name, instruction, and visual
- **Timer**: Countdown timer with millisecond-precision using delta-time calculation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete an entire 35-minute workout with timer accuracy within ±500ms total drift
- **SC-002**: Exercise transitions occur smoothly with less than 100ms delay between steps
- **SC-003**: Voice announcements complete within 3 seconds of step start (when enabled)
- **SC-004**: Pause and resume functions work with 100% reliability across all workout types
- **SC-005**: Users receive clear visual feedback for all states (work, rest, paused, complete)
- **SC-006**: App gracefully degrades when speech or audio APIs are unavailable, maintaining core timer functionality
- **SC-007**: No memory leaks occur during 45-minute workout sessions (longest program workout)
