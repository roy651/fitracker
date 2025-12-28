---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# Ski Prep Pro v1.1 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Ski Prep Pro v1.1, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: System can display a rest countdown between workout blocks when `block_rest` is defined in the template
FR2: User can see remaining rest time in the same visual format as drill rest timers
FR3: System can play an audio cue when block rest ends
FR4: System can automatically transition from rest to the next block when rest time completes
FR5: System can speak the exercise name aloud when a drill begins
FR6: System can speak the exercise instruction aloud when a drill begins
FR7: User can toggle voice announcements on or off during a workout
FR8: User can see a clear visual indicator showing whether voice is enabled or disabled
FR9: System can detect if Web Speech API is unavailable in the current browser
FR10: User can see that voice toggle is disabled when Web Speech API is unavailable
FR11: System can acquire screen wake lock when a workout begins
FR12: System can release screen wake lock when a workout ends or user exits
FR13: System can gracefully handle browsers that do not support Wake Lock API
FR14: Workout templates can include a `block_rest` property specifying rest duration in seconds per block
FR15: System can read and apply `block_rest` values during workout linearization
FR16: User can access voice toggle button from the workout player interface
FR17: User can access existing audio mute toggle from the workout player interface
FR18: User can continue using existing workout controls (play, pause, skip, reset, exit)
FR19: User can see block name and "Block Rest" indicator during rest periods
FR20: User can see the same progress ring animation during block rest as drill rest

### NonFunctional Requirements

NFR1: Timer countdown accuracy within ±100ms variance
NFR2: Audio cue latency < 200ms from visual
NFR3: Voice announcement delay < 500ms from drill start
NFR4: App startup time < 3 seconds to interactive
NFR5: Smooth progress ring animation (60 FPS on mobile)
NFR6: Wake lock duration up to 45 minutes continuously
NFR7: Wake lock stability (no unexpected release during workout)
NFR8: Voice synthesis completion (100% of announcements complete before next action)
NFR9: Graceful API unavailability (no errors shown to user)
NFR10: Offline workout completion (PWA must work without network)
NFR11: Primary browser support: Chrome Android, Safari iOS
NFR12: Secondary browser support: Chrome Desktop, Edge, Firefox
NFR13: Feature detection before use for all Web APIs

### Additional Requirements

**Architecture Requirements:**
- **Service Layer Pattern:** Create `src/services/` directory for hardware integrations.
- **Service Implementation:** Implement `wakeLockService.js` (Singleton) and `speechService.js` (Singleton).
- **Audio Refactor:** Refactor `utils/audioManager.js` to `src/services/audioService.js`.
- **State Machine:** Implement `StepType.BLOCK_REST` enum in `linearizer.js`.
- **Persistence:** Use `localStorage` for user preferences (`ski_prep_user_prefs`).
- **Data Schema:** Update `workoutDatabase.js` to support `block_rest` field.
- **Graceful Degradation:** Use `try/catch` around hardware APIs and feature detection (`if ('wakeLock' in navigator)`).
- **Dependencies:** React 19, Vite 7, Tailwind 4 (Reuse existing).
- **Browser Compatibility:** Native APIs only (no polyfills), default to system voice.

**UX Requirements:**
- **Voice Toggle UI:** Place adjacent to mute button, use Speech bubble icon, support Active/Inactive/Disabled states.
- **Block Rest UI:** Match drill rest visual (Coffee icon, countdown), label as "Block Rest", auto-progress.
- **Next Up Preview:** Display "Next: [Exercise Name]" text below timer during rest periods (fade-in).
- **Responsiveness:** Timer visible from 3-6 feet, touch targets 56px minimum.
- **Accessibility:** `aria-label`/`aria-pressed` for toggle, `aria-live` for block rest.
- **Audio Hierarchy:** Voice announcements must define sequence before countdown beeps (no overlap).

### FR Coverage Map

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Display rest countdown between blocks |
| FR2 | Epic 2 | Visual format matches drill rest |
| FR3 | Epic 2 | Audio cue when rest ends |
| FR4 | Epic 2 | Auto-transition to next block |
| FR5 | Epic 1 | Speak exercise name |
| FR6 | Epic 1 | Speak exercise instruction |
| FR7 | Epic 1 | Toggle voice on/off |
| FR8 | Epic 1 | Visual indicator for voice state |
| FR9 | Epic 1 | Detect Speech API availability |
| FR10 | Epic 1 | Disabled state for voice toggle |
| FR11 | Epic 3 | Acquire wake lock on start |
| FR12 | Epic 3 | Release wake lock on end |
| FR13 | Epic 3 | Graceful wake lock handling |
| FR14 | Epic 2 | `block_rest` property in template |
| FR15 | Epic 2 | Apply block rest logic |
| FR16 | Epic 1 | Voice toggle access |
| FR17 | Epic 1 | Mute toggle access |
| FR18 | All | (Regression test expectation - part of all epics) |
| FR19 | Epic 2 | "Block Rest" indicator UI |
| FR20 | Epic 2 | Progress ring animation for block rest |

## Epic List

## Epic List

## Epic 1: Hands-Free Voice Coaching

Transform the silent visual timer into an audible coach that guides users without needing to look at the screen, enabling hands-free workouts.

### Story 1.1: Web Speech API Service Implementation

As a Developer,
I want to implement a centralized SpeechService wrapper around the Web Speech API,
So that the application can synthesize speech reliably across different browsers with graceful fallback.

**Acceptance Criteria:**

**Given** The application is running in a browser environment
**When** The `SpeechService` is initialized
**Then** It should detect if `window.speechSynthesis` is available and expose an `isSupported` flag
**And** It should provide a `speak(text)` method that queues the text for synthesis
**And** It should select the default system voice for the current locale
**And** It should handle errors gracefully without crashing the app

### Story 1.2: Voice Toggle and Persistence

As a User,
I want to be able to toggle voice announcements on and off and have the app remember my preference,
So that I can customize my experience based on my environment (e.g., gym vs. home).

**Acceptance Criteria:**

**Given** The user is on the workout player screen
**When** They view the control bar
**Then** A voice toggle button should be visible adjacent to the mute button
**And** It should show the current state (On/Off) using distinct icons/colors

**Given** The Web Speech API is NOT supported in the current browser
**When** The toggle is rendered
**Then** It should appear in a disabled state (grayed out, non-interactive)

**Given** The user toggles the voice setting
**When** They reload the app or start a new workout
**Then** Their preference (On or Off) should be persisted in `localStorage`

### Story 1.3: Workout Audio Integration

As a User,
I want the app to announce the exercise name and instructions when a new drill starts,
So that I know what to do without looking at the screen.

**Acceptance Criteria:**

**Given** Voice is enabled and a drill step begins
**When** The timer starts for that step
**Then** The app should speak the Exercise Name followed by the Instructions
**And** The voice announcement should start within 500ms (NFR3)

**Given** A voice announcement is playing
**When** The countdown timer needs to beep (3-2-1)
**Then** The voice announcement should complete before the beeps begin (or beeps should duck/play in background without cutting off speech)

**Given** The user presses "Mute" on the global audio toggle
**When** A step starts
**Then** No voice announcements or beeps should play

## Epic 2: Intelligent Block Rest

Provide structured recovery periods between workout blocks to improve training quality, ensuring users get proper rest intervals matching the fidelity of standard drills.

### Story 2.1: Block Rest Data Schema & State Logic

As a Developer,
I want to update the workout data schema and linearizer logic to support a new `block_rest` property,
So that the application can mathematically sequence rest periods between blocks.

**Acceptance Criteria:**

**Given** The `workoutDatabase.js` file
**When** A workout template is defined
**Then** It should support an optional `block_rest` property (number of seconds) in the block definition

**Given** The `linearizer` service processes a workout
**When** It encounters the end of a block that has `block_rest` defined
**Then** It should insert a new step with type `StepType.BLOCK_REST`
**And** The duration of that step should match the defined `block_rest` value

**Given** The last block of a workout
**When** It is linearized
**Then** No `BLOCK_REST` step should be added after the final block (workout is complete)

### Story 2.2: Block Rest UI Implementation

As a User,
I want to see a clear countdown timer during block rest periods,
So that I know exactly how much time I have to recover before the next set of exercises begins.

**Acceptance Criteria:**

**Given** The workout transitions to a `BLOCK_REST` step
**When** The player renders the screen
**Then** It should interpret this state as a rest period
**And** It should display the existing Rest UI (coffee icon/visual)
**And** The label should read "Block Rest" instead of "Rest"

**Given** The block rest timer reaches zero
**When** The step completes
**Then** The existing transitions logic should automatically advance to the first drill of the next block
**And** The existing rest chime should play (if audio is enabled)

### Story 2.3: Next Up Preview Support

As a User,
I want to see the name of the upcoming exercise during a rest period,
So that I can mentally prepare for the next movement without being surprised.

**Acceptance Criteria:**

**Given** The user is in a `REST` (drill rest) or `BLOCK_REST` period
**When** The timer is running
**Then** A "Next: [Exercise Name]" text preview should appear below the main timer
**And** It should display the name of the *next* drill in the sequence

**Given** Specifically a `BLOCK_REST` period
**When** The preview is shown
**Then** It should show the name of the *first* exercise of the *next* block

## Epic 3: Always-On Visibility (Wake Lock)

Ensure the workout interface remains visible throughout the entire session without user interaction, eliminating the frustration of screen dimming or locking mid-exercise.

### Story 3.1: Wake Lock Service Implementation

As a Developer,
I want to implement a centralized WakeLockService wrapper around the Screen Wake Lock API,
So that the application can prevent the screen from sleeping during critical activities.

**Acceptance Criteria:**

**Given** The application is running in a browser environment
**When** The `WakeLockService` is initialized
**Then** It should detect if `navigator.wakeLock` is available and expose an `isSupported` flag

**Given** The `acquire()` method is called
**When** The browser supports the API
**Then** It should request a screen wake lock
**And** It should store the `WakeLockSentinel` internally

**Given** The app loses focus or visibility (e.g., user switches tabs)
**When** The app regains visibility
**Then** The service should automatically attempt to re-acquire the lock if it was previously held

**Given** The `release()` method is called
**When** A lock is currently held
**Then** It should release the `WakeLockSentinel` and clear the internal reference

### Story 3.2: Workout Wake Lock Integration

As a User,
I want the screen to stay awake while I am performing a workout,
So that I don't have to touch the screen with sweaty hands just to keep the timer visible.

**Acceptance Criteria:**

**Given** The user starts a workout
**When** The `WorkoutPlayer` component mounts or the workout begins
**Then** It should call `wakeLockService.acquire()` to keep the screen on

**Given** The user finishes a workout or exits the player
**When** The `WorkoutPlayer` component unmounts
**Then** It should call `wakeLockService.release()` to let the screen sleep normally again

**Given** The user is on a browser that does NOT support Wake Lock
**When** Within a workout
**Then** The app should function normally (timer runs, etc.) without crashing/erroring
**And** The service calls should just be successful no-ops

## Epic 4: Production Readiness & PWA Excellence

Bridge the gap between a working development prototype and a production-grade application by implementing Progressive Web App (PWA) capabilities and hardening the application with real-world browser testing.

### Story 4.1: PWA Core Implementation

As a User,
I want the application to work offline and be installable on my device,
So that I can use it in gyms with poor connectivity and access it quickly from my home screen.

**Acceptance Criteria:**

**Given** The application is being built/deployed
**When** The build process completes
**Then** A valid `manifest.json` should be generated with correct icons and theme colors
**And** A Service Worker should be registered using `vite-plugin-pwa`
**And** The application should be accessible and functional even when the network is disconnected (Offline Mode)

### Story 4.2: Installation UX & Guidance

As a User,
I want to be clearly guided on how to install the app on my specific device,
So that I can easily move the app to my home screen for better access.

**Acceptance Criteria:**

**Given** The user is on a browser that supports native installation (e.g., Chrome on Android)
**When** They are using the app
**Then** A non-intrusive "Install App" button or banner should appear
**And** Clicking it should trigger the browser's native install prompt

**Given** The user is on iOS Safari (which doesn't support the `beforeinstallprompt` event)
**When** They are using the app
**Then** A subtle guide or tip should appear explaining how to use "Add to Home Screen" via the Share menu

### Story 4.3: Hardware E2E Quality Gate

As a Developer,
I want to verify that the hardware integrations (Speech, Wake Lock) work correctly in real browser environments,
So that I can be 100% confident in the cross-browser stability of the application.

**Acceptance Criteria:**

**Given** The Playwright test suite
**When** Tests are run in a real browser container
**Then** It should verify that `WakeLockService` correctly acquires and releases the lock
**And** It should verify that `SpeechService` triggers announcements without errors
**And** It should include an "Offline Mode" test that verifies PWA functionality by cutting the network connection

### Story 4.4: Final Polish & Accessibility Audit

As a Project Lead,
I want to ensure the application meets modern accessibility and performance standards,
So that it is usable by everyone and provides a premium experience.

**Acceptance Criteria:**

**Given** The application in a production-like environment
**When** A Lighthouse or similar audit is performed
**Then** The Accessibility score should be >= 90
**And** The Performance score should be >= 90
**And** All interactive elements (toggles, buttons) should have correct ARIA labels and keyboard support

