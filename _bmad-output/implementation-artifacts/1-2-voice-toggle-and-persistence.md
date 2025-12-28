# Story 1.2: Voice Toggle and Persistence

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to be able to toggle voice announcements on and off and have the app remember my preference,
so that I can customize my experience based on my environment (e.g., gym vs. home).

## Acceptance Criteria

1. **Given** The user is on the workout player screen
   **When** They view the control bar
   **Then** A voice toggle button should be visible adjacent to the mute button
   **And** It should show the current state (On/Off) using distinct icons/colors

2. **Given** The Web Speech API is NOT supported in the current browser
   **When** The toggle is rendered
   **Then** It should appear in a disabled state (grayed out, non-interactive)

3. **Given** The user toggles the voice setting
   **When** They reload the app or start a new workout
   **Then** Their preference (On or Off) should be persisted in `localStorage`

## Tasks / Subtasks

- [x] Create `src/components/VoiceToggle.jsx` component
  - [x] Implement toggle button logic
  - [x] Use `speechService.isSupported` to disable if unavailable
  - [x] Use `localStorage` to read/write `ski_prep_user_prefs`
  - [x] Add distinct icons for On/Off states (Active/Inactive)
  - [x] Apply accessibility attributes (`aria-label`, `aria-pressed`)
- [x] Integrate `VoiceToggle` into `src/components/WorkoutPlayer.jsx`
  - [x] Place adjacent to Mute button
- [x] Verify persistence logic
  - [x] Load preference on mount
  - [x] Save preference on toggle change

## Dev Notes

- **Architecture Patterns:**
  - **Component Structure:** `PascalCase` filename (`VoiceToggle.jsx`).
  - **Service Integration:** Use `speechService.isSupported` to gate the UI. Do not import `window.speechSynthesis` directly.
  - **Persistence:** Use `localStorage` key `ski_prep_user_prefs`.
  - **Styling:** Use Tailwind utility classes. Reuse existing mute button styles for consistency.

- **Source Tree Components:**
  - `src/components/VoiceToggle.jsx` (New)
  - `src/components/WorkoutPlayer.jsx` (Modify)
  - `src/services` (Reference `speechService`)

- **Testing Standards:**
  - Unit test `VoiceToggle` rendering and click handlers.
  - Mock `localStorage` verify reads/writes.
  - Verify disabled state when `speechService.isSupported` returns false.

### Project Structure Notes

- **Unified Structure:** Components in `src/components/`.
- **Dependencies:** `lucide-react` for icons (Speech bubble icons likely).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Voice Toggle and Persistence]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: User Preference Persistence]
- [Source: _bmad-output/implementation-artifacts/1-1-web-speech-api-service-implementation.md#Completion Notes List]

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Debug Log References

- None

### Completion Notes List

- Story builds upon completed Story 1.1 (`speechService` availability).
- Leverages existing `lucide-react` library for icons.
- **Implementation Details:**
  - Created `VoiceToggle` component with isolated state and persistence logic.
  - Used `localStorage` key `ski_prep_user_prefs` as requested.
  - Handled disabled state when `speechService.isSupported` is false.
  - Integrated into `WorkoutPlayer` alongside existing sound FX toggle.
- **Testing:**
  - Added unit tests for `VoiceToggle` covering render, toggle, persistence, and disabled states.
  - Verified no regression in existing tests.
- **Code Review Fixes:**
  - Memoized `VoiceToggle` to prevent unnecessary re-renders in the player loop.
  - Refactored `VoiceToggle` unit tests to use a robust mock that mimics the class getter contract.
  - Updated File List to include dependency updates (`prop-types`).

### File List

- `src/components/VoiceToggle.jsx`
- `src/components/WorkoutPlayer.jsx`
- `tests/unit/components/VoiceToggle.test.jsx`
- `src/components/VoiceToggle.jsx`
- `src/components/WorkoutPlayer.jsx`
- `tests/unit/components/VoiceToggle.test.jsx`
- `vite.config.js`
- `package.json`
- `package-lock.json`
