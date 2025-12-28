# Story 4.2: Installation UX & Guidance

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to be clearly guided on how to install the app on my specific device,
so that I can easily move the app to my home screen for better access.

## Acceptance Criteria

1. **Given** The user is on a browser that supports native installation (e.g., Chrome on Android)
   **When** They have completed at least one workout or are on the Dashboard
   **Then** A non-intrusive "Install App" prompt (banner or button) should appear.
   **And** Clicking it should trigger the browser's native `beforeinstallprompt` event.

2. **Given** The user is on iOS Safari (which doesn't support the installation event)
   **When** They are on the Dashboard
   **Then** A subtle "Installation Guide" or tip should appear explaining how to use "Add to Home Screen" via the Share menu.

3. **Given** The user has already installed the app (standalone mode)
   **When** They open the app
   **Then** No installation prompts or guides should be visible.

4. **Given** The user dismisses the installation prompt
   **When** They return to the app later
   **Then** The prompt should remain hidden for that session (or use a cooldown period like 7 days).

## Tasks / Subtasks

- [x] **State Management** (AC: 1, 2)
  - [x] Implement detection for `display-mode: standalone` to hide prompts when already installed.
  - [x] Implement logic to capture and store the `beforeinstallprompt` event.
  - [x] Add `localStorage` tracking for "Prompt Dismissed" status.
- [x] **UI Component Creation** (AC: 1, 2)
  - [x] Create an `InstallPrompt` component (Floating Banner).
  - [x] Design the "Native Install" version (using the saved prompt event).
  - [x] Design the "iOS Guide" version (text + icons explaining the Share -> Add to Home Screen flow).
- [x] **Integration** (AC: 1, 2, 4)
  - [x] Add `InstallPrompt` to the `App` component layout (Dashboard view).
  - [x] Trigger visibility based on Dashboard presence.
  - [x] Ensure dismissal stores the timestamp to prevent immediate re-prompting.
- [x] **OS Detection** (AC: 1, 2)
  - [x] Implement a utility hook (`usePWAInstall`) to detect iOS vs Android/Desktop.

## Dev Notes

- **Architecture Patterns:**
  - **Graceful Degradation:** The app functions perfectly without installation; this is a pure "Experience Enhancement."
  - **UI Consistency:** Use existing `.surface` (Elevated card) styling and Tailwind colors.
- **Source Tree Components:**
  - `src/components/InstallPrompt.jsx` (New)
  - `src/components/Dashboard.jsx` (Integration)
  - `src/App.jsx` (Global event listener for `beforeinstallprompt`)
- **Testing Standards:**
  - Simulate different User Agents in DevTools (Chrome Android vs iOS Safari).
  - Verify `localStorage` persistence of dismissal.

### Project Structure Notes

- **Alignment:** This follows the "PWA Excellence" pillar of v1.1.
- **UX Requirements:** Per the spec, the prompt should be "non-intrusive" (AC: 1, 2).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2: Installation UX & Guidance]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#PWA Installation Prompt/Guide]

### Dev Agent Record

### Agent Model Used

Amelia (Dev Agent) via Antigravity

### Debug Log References

- Created `src/hooks/usePWAInstall.js` for clean state management.
- Integrated `InstallPrompt` in `App.jsx` to ensure it's available on the dashboard.
- **AI-Review Fixes**:
  - Implemented **workout completion gate**: Prompt now only shows after at least 1 workout is completed (UX funnel compliance).
  - Centralized visibility logic in `usePWAInstall` hook via `shouldShowPrompt`.
  - Added comprehensive **unit test coverage** for the hook and component.
  - Staged all implementation and test files in git.

### Completion Notes List

- Implemented `usePWAInstall` hook with `localStorage` persistence (7-day cooldown).
- Implemented `InstallPrompt` with separate paths for native installation and iOS guidance.
- Added workout completion tracking (`workout_completed_count`) in `WorkoutPlayer.jsx`.
- Verified logic via unit tests (100% pass).

### File List

- `src/hooks/usePWAInstall.js`
- `src/components/InstallPrompt.jsx`
- `src/App.jsx`
- `src/components/WorkoutPlayer.jsx`
- `tests/unit/hooks/usePWAInstall.test.js`
- `tests/unit/components/InstallPrompt.test.jsx`
