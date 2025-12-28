# Story 1.1: Web Speech API Service Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to implement a centralized SpeechService wrapper around the Web Speech API,
so that the application can synthesize speech reliably across different browsers with graceful fallback.

## Acceptance Criteria

1. **Given** The application is running in a browser environment
   **When** The `SpeechService` is initialized
   **Then** It should detect if `window.speechSynthesis` is available and expose an `isSupported` flag

2. **Given** The application is running in a browser environment
   **When** The `SpeechService` is initialized
   **Then** It should detect if `window.speechSynthesis` is available and expose an `isSupported` flag

3. **Given** The `SpeechService` is initialized
   **When** (Test setup)
   **Then** It should provide a `speak(text)` method that queues the text for synthesis

4. **Given** The `SpeechService` is initialized
   **When** `speak(text)` is called
   **Then** It should select the default system voice for the current locale

5. **Given** The `SpeechService` is used
   **When** An error occurs (e.g. API failure)
   **Then** It should handle errors gracefully without crashing the app

## Tasks / Subtasks

- [x] Create `src/services/speechService.js` (Class Implementation)
  - [x] Implement Singleton pattern
  - [x] Implement `init()` logic with feature detection (`window.speechSynthesis`)
  - [x] Implement `isSupported` getter
  - [x] Implement `speak(text)` method with `SpeechSynthesisUtterance`
  - [x] Implement error handling wrapping API calls
- [x] Export singleton instance as default
- [x] Create `src/services/audioService.js` (Refactor existing utils/audioManager.js if needed, or just focus on speech here)
  - *Note: This story focuses on SpeechService. AudioService refactor is mentioned in architecture but might be best addressed here or in a separate task if tightly coupled. Architecture says "Refactor utils/audioManager.js to src/services/audioService.js". Let's stick to SpeechService primarily but ensure directory exists.*
- [x] Update `src/services/index.js` (if standardizing exports)

## Dev Notes

- **Architecture Patterns:**
  - **Singleton Service:** `SpeechService` must be a class exported as a singleton instance.
  - **Lazy Intialization:** Do not initialize hardware APIs top-level.
  - **Graceful Degradation:** Wrap all calls in `try/catch`. Feature detect `window.speechSynthesis`.
  - **Naming:** `speechService.js` (camelCase file), `SpeechService` (PascalCase class).

- **Source Tree Components:**
  - `src/services/speechService.js` (New)
  - `src/services/` (New directory)

- **Testing Standards:**
  - Manual testing required since hardware APIs are involved (or mock `window.speechSynthesis` in unit tests).
  - Verify on mobile browsers (Safari iOS often has strict auto-play policies requiring user interaction).

### Project Structure Notes

- **Unified Structure:** Move towards `src/services/` for all side-effects.
- **Constraints:** No dependencies on external speech libraries. Native API only.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Hardware Service Abstraction]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Web Speech API Service Implementation]
- [Source: _bmad-output/planning-artifacts/project-context.md#Service Layer Patterns (CRITICAL)]

## Dev Agent Record

### Agent Model Used

Antigravity (simulated)

### Debug Log References

- Implemented `SpeechService` with full browser feature detection and error handling.
- Refactored `AudioManager` into `AudioService` (singleton) and verified it works with tests.
- Installed `vitest` and configured `vite.config.js` for unit testing.
- Created `tests/setup.js` for `jest-dom` matchers.
- Added comprehensive unit tests for both services.
- Created `src/services/index.js` for clean exports.
- **Code Review Fixes:**
  - Strengthened singleton unit tests to verify instance identity explicitly.
  - Decisively implemented `cancel()` in `speak()` to prevent queue buildup.
  - Fixed typo in `AudioService` JSDoc.

### Completion Notes List

- Story context created based on Architecture and Epics.

### File List

- `src/services/speechService.js`
- `src/services/audioService.js`
- `src/services/index.js`
- `tests/unit/services/speechService.test.js`
- `tests/unit/services/audioService.test.js`
- `vite.config.js`
- `package.json`
- `tests/setup.js`
