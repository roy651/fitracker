# Feature Specification: Browser Hardware Integration

**Feature Branch**: `3-hardware-integration`  
**Created**: 2025-12-30  
**Status**: Baseline  
**Source**: Converted from OpenSpec baseline specification

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keep Screen Awake During Workouts (Priority: P1)

As a user, I want my phone screen to stay on during my workout, so I can glance at exercise instructions and timers without having to unlock my device.

**Why this priority**: Critical for hands-free workout experience. Without screen wake lock, users must repeatedly unlock their device, disrupting training flow.

**Independent Test**: Start a workout on a device with short auto-lock timeout, leave device idle, and verify screen remains active throughout the workout.

**Acceptance Scenarios**:

1. **Given** the browser supports Screen Wake Lock API AND a workout starts, **When** the first drill begins, **Then** the system SHALL acquire wake lock AND screen SHALL remain on
2. **Given** wake lock is active, **When** the workout ends or user exits, **Then** the system SHALL release the wake lock
3. **Given** wake lock is active AND user switches to another app, **When** user returns to the workout app, **Then** the system SHALL automatically re-acquire the wake lock
4. **Given** the browser does not support wake lock, **When** workout starts, **Then** the system SHALL log warning AND workout SHALL proceed normally

---

### User Story 2 - Enable Voice Coaching (Priority: P2)

As a user, I want to hear the name and instructions for each exercise announced aloud, so I can keep my eyes on my form instead of reading the screen.

**Why this priority**: Significantly improves workout quality and safety by allowing users to focus on movement, but app remains functional without it.

**Independent Test**: Enable voice toggle, start workout, and verify speech announcements occur for each exercise at step start.

**Acceptance Scenarios**:

1. **Given** voice coaching is enabled AND browser supports speechSynthesis, **When** new exercise step begins, **Then** system SHALL speak exercise name AND speak exercise instruction in sequence
2. **Given** voice is disabled, **When** exercise steps start, **Then** NO speech SHALL occur
3. **Given** global audio is muted, **When** exercise steps start, **Then** NO speech SHALL occur even if voice toggle is on
4. **Given** the app just loaded, **When** user clicks voice toggle for the first time, **Then** speech service SHALL initialize (lazy initialization from user gesture)

---

### User Story 3 - Toggle Voice Preference with Persistence (Priority: P2)

As a user, I want to turn voice coaching on or off and have my preference remembered, so I don't need to adjust it every session.

**Why this priority**: Essential UX for customization - some users want coaching, others prefer silence.

**Independent Test**: Toggle voice on, reload app, verify toggle state is "on" and announcements occur.

**Acceptance Scenarios**:

1. **Given** voice is enabled, **When** user taps voice toggle, **Then** voice SHALL be disabled AND toggle button SHALL show "off" state AND preference SHALL save to localStorage
2. **Given** voice preference is saved, **When** app reloads, **Then** voice toggle SHALL reflect saved state
3. **Given** first-time user, **When** app loads, **Then** voice SHALL default to enabled

---

### User Story 4 - Hear Audio Cues for Transitions (Priority: P3)

As a user, I want to hear beeps when work and rest periods start, so I know when to transition without looking at my screen.

**Why this priority**: Enhances experience but users can rely on visual cues and voice announcements.

**Independent Test**: Start workout with audio unmuted, listen for beeps at work-rest transitions and completion sound at end.

**Acceptance Scenarios**:

1. **Given** audio is unmuted, **When** transitioning from work to rest, **Then** beep sound SHALL play
2. **Given** audio is unmuted, **When** workout completes, **Then** completion sound SHALL play
3. **Given** audio is muted, **When** any transition occurs, **Then** NO sounds SHALL play

---

### Edge Cases

- What happens if wake lock request is denied? Log error, continue workout without wake lock
- How does system handle speech synthesis API crashing? Catch error, log, disable voice for session
- What if user revokes wake lock permission mid-workout? App continues, attempts re-acquire on next visibility change
- What happens if speechSynthesis is speaking when user disables voice? Cancel current speech immediately

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement singleton pattern for all hardware API services (wake lock, speech, audio)
- **FR-002**: System MUST initialize hardware APIs lazily from user gestures, NOT on module import
- **FR-003**: System MUST acquire screen wake lock when workout begins (first drill starts)
- **FR-004**: System MUST release wake lock when workout ends or user exits
- **FR-005**: System MUST re-acquire wake lock automatically when app regains visibility during active workout
- **FR-006**: System MUST provide speech synthesis for exercise names and instructions
- **FR-007**: System MUST allow users to toggle voice coaching with persistent preference
- **FR-008**: System MUST respect global mute setting for both speech and audio
- **FR-009**: System MUST play audio beeps for work-rest transitions and completion
- **FR-010**: System MUST wrap ALL hardware API calls in try-catch blocks
- **FR-011**: System MUST degrade gracefully when APIs are unsupported (log warning, continue)
- **FR-012**: System MUST never crash or throw errors to UI when hardware features fail
- **FR-013**: System MUST cancel speech when user disables voice mid-announcement
- **FR-014**: System MUST check if speech is already in progress before queuing new speech

### Key Entities

- **WakeLockService**: Singleton managing Screen Wake Lock API lifecycle
- **SpeechService**: Singleton managing Web Speech API (speechSynthesis)
- **AudioManager**: Singleton managing HTML5 Audio API for sound effects
- **VoicePreference**: User preference state persisted in localStorage

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Screen remains active for 100% of workout duration on devices with wake lock support
- **SC-002**: Wake lock re-acquisition occurs within 500ms of app regaining visibility
- **SC-003**: Speech announcements occur within 500ms of exercise step start
- **SC-004**: Voice toggle state persists across 100% of app sessions
- **SC-005**: App continues to function normally when run on browsers without wake lock support (graceful degradation)
- **SC-006**: Zero UI crashes occur due to hardware API errors across all browser types
- **SC-007**: Audio cues play within 100ms of transition events
- **SC-008**: Services initialize only after user interaction, never on page load (0% auto-initialization violations)
