# Story 1.3: Workout Audio Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the app to announce the exercise name and instructions when a new drill starts,
so that I know what to do without looking at the screen.

## Acceptance Criteria

1. **Given** Voice is enabled and a drill step begins
   **When** The timer starts for that step
   **Then** The app should speak the Exercise Name followed by the Instructions
   **And** The voice announcement should start within 500ms (NFR3)
   **And** It should happen automatically without user intervention (after initial interaction)

2. **Given** A voice announcement is playing
   **When** The countdown timer needs to beep (3-2-1)
   **Then** The voice announcement should complete before the beeps begin (or beeps should duck/play in background without cutting off speech)
   *Implementation Note: Due to variability in speech duration, simpler MVP approach is beeps play in background (ducking) or parallel. Strict sequencing "finish speech before beep" is hard if speech is long and drill is short.*

3. **Given** The user presses "Mute" on the global audio toggle
   **When** A step starts
   **Then** No voice announcements or beeps should play

4. **Given** The user has "Voice Disabled" (via Toggle from Story 1.2) but "Audio Enabled" (Global Mute)
   **When** A step starts
   **Then** Beeps should play, but no voice announcements

## Tasks / Subtasks

- [x] Create/Update `src/hooks/useVoicePreference.js` (Optional but recommended) or lift state
  - [x] Need a way for `WorkoutPlayer` to know "Voice Enabled" state currently managed in `VoiceToggle`.
  - [x] Refactor `VoiceToggle` to accept `enabled` and `onToggle` props (Controlled Component pattern) OR share a context/hook.
- [x] Update `src/components/WorkoutPlayer.jsx`
  - [x] Lift voice preference state here (or read from shared source).
  - [x] Implement `useEffect` listening to current step changes.
  - [x] Trigger `speechService.speak(text)` when entering a new Drill step.
  - [x] Construct text: `${step.exerciseName}. ${step.instructions}`.
- [x] Handle Audio Priority
  - [x] Ensure `audioService` (beeps) and `speechService` (voice) co-exist.
  - [x] Verify `speechService.speak` cancels previous speech before starting new one (implemented in 1.1).
- [x] Verify Global Mute
  - [x] Existing `isMuted` state should gate `speechService` calls too.

## Dev Notes

- **Architecture Patterns:**
  - **Orchestration:** `WorkoutPlayer` is the conductor. It observes state changes (`currentStepIndex`) and triggers effects (Speech, Sound).
  - **State Management:** Story 1.2 implemented `VoiceToggle` with internal state. **CRITICAL:** You must now lift that state or sync it so `WorkoutPlayer` knows whether to speak. Consolidating logic into a `useVoiceSettings` hook or simply passing state down from `WorkoutPlayer` to `VoiceToggle` is recommended.
  - **Latency:** Trigger speech immediately in the `useEffect` dependent on `currentStep`.

- **Source Tree Components:**
  - `src/components/WorkoutPlayer.jsx` (Logic Core)
  - `src/components/VoiceToggle.jsx` (Update to be controlled or observer)
  - `src/services/speechService.js` (Usage)

- **Testing Standards:**
  - Unit test `WorkoutPlayer`'s `useEffect` triggers. Mock `speechService.speak`.
  - Verify "Mute" prevents call.
  - Verify "Voice Off" prevents call.

### Project Structure Notes

- **Current State:** `VoiceToggle` currently reads/writes `localStorage` internally.
- **Refactor Opportunity:** Make `VoiceToggle` a dumb component (UI only) and manage persistence in `WorkoutPlayer` or a parent customized hook, OR add a storage event listener. **Lifting state to WorkoutPlayer** is cleanest for React.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Workout Audio Integration]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Hardware Service Abstraction]
- [Source: src/components/VoiceToggle.jsx] (Analyze existing state implementation)

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Debug Log References

- Implemented `useVoicePreference` hook to centralize voice setting logic.
- Refactored `VoiceToggle` to be a pure controlled component.
- Updated `WorkoutPlayer` to orchestrate speech based on step changes and preference.
- Added comprehensive integration tests in `WorkoutPlayer.test.jsx` mocking all services.
- Added unit tests for hook and dumb component.

### Completion Notes List

- Story focuses on the *integration* of the services built in 1.1 and 1.2.
- Addressing the state sharing between Toggle and Player is the key complexity here.

### File List

- `src/components/WorkoutPlayer.jsx`
- `src/components/VoiceToggle.jsx`
- `src/services/speechService.js`
- `src/hooks/useVoicePreference.js`
- `tests/unit/components/WorkoutPlayer.test.jsx`
- `tests/unit/hooks/useVoicePreference.test.js`
- `tests/unit/components/VoiceToggle.test.jsx`
