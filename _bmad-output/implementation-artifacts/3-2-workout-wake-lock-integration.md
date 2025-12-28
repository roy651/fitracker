# Story 3.2: Workout Wake Lock Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the screen to stay awake while I am performing a workout,
so that I don't have to touch the screen with sweaty hands just to keep the timer visible.

## Acceptance Criteria

1. **Given** The user starts a workout (clicks "Start Block")
   **When** The `WorkoutPlayer` component is active
   **Then** It should call `wakeLockService.acquire()` to keep the screen on

2. **Given** The user finishes a workout or exits the player
   **When** The `WorkoutPlayer` component unmounts or the "Done" button is clicked
   **Then** It should call `wakeLockService.release()` to let the screen sleep normally again

3. **Given** The user interacts with the player (click/tap)
   **When** The interaction occurs
   **Then** It should call `wakeLockService.init()` to ensure the hardware API is ready (matches `audioManager.init()` pattern)

4. **Given** The user is on a browser that does NOT support Wake Lock (e.g., Firefox)
   **When** Within a workout
   **Then** The app should function normally (timer runs, etc.) without crashing/erroring
   **And** The service calls should gracefully no-op (handled by `wakeLockService`)

## Tasks / Subtasks

- [x] Task 1: Integrate `wakeLockService` into `WorkoutPlayer.jsx` (AC: 1, 2, 3)
  - [x] 1.1: Import `wakeLockService` from `../services`
  - [x] 1.2: Update `initAudio` function to also call `wakeLockService.init()`
  - [x] 1.3: Call `wakeLockService.acquire()` in the `goToNextStep` handler when transitioning from `BLOCK_START` (the user gesture)
  - [x] 1.4: Add a `useEffect` cleanup function to call `wakeLockService.release()` to ensure the lock is released when the player unmounts

- [x] Task 2: Refactor Hardware Initialization (Optional/Enhancement)
  - [x] 2.1: Rename `initAudio` to `initHardwareServices` for clarity, as it now handles both Audio and Wake Lock

- [x] Task 3: Write Integration Tests (All ACs)
  - [x] 3.1: Update `tests/unit/components/WorkoutPlayer.test.jsx` to include `wakeLockService` mocks
  - [x] 3.2: Add test: Verify `wakeLockService.init` is called on user interaction
  - [x] 3.3: Add test: Verify `wakeLockService.acquire` is called when starting a block
  - [x] 3.4: Add test: Verify `wakeLockService.release` is called on unmount

## Dev Notes

- **Architecture Patterns:**
  - **Service Consumption:** Components should call service methods directly. The `init()` call satisfies the user gesture requirement for hardware APIs.
  - **Lifecycle Management:** Use the `useEffect` cleanup function for the most reliable screen-off trigger.
  - **Single Source of Truth:** `wakeLockService` already manages its own `_wasAcquired` state and `visibilitychange` listeners, so the component just needs to trigger the initial `acquire()`.

- **Source Tree Components:**
  - `src/components/WorkoutPlayer.jsx` (MODIFY - integrate service)
  - `tests/unit/components/WorkoutPlayer.test.jsx` (MODIFY - add integration tests)

- **Testing Standards:**
  - Mock `wakeLockService` using the same pattern as `speechService`:
    ```javascript
    vi.mock('../../../src/services/wakeLockService', () => ({
        default: {
            init: vi.fn(),
            acquire: vi.fn(),
            release: vi.fn(),
            isSupported: true
        }
    }));
    ```
  - Use `act()` for clicks and verify service calls.
  - Use `unmount()` from `@testing-library/react` to test cleanup.

### Project Structure Notes

- **Hardware Service Initialization:**
  Existing pattern in `WorkoutPlayer.jsx` (lines 385, 424):
  ```jsx
  <div className="..." onClick={initAudio}>
  ```
  This is a broad catch-all for clicks. `wakeLockService.init()` should be added to this handler.

- **Acquisition Timing:**
  The the most explicit user gesture is the "Start Block" button (line 106). Since `acquire()` is async and returns a promise, it's safe to call it there.

### Previous Story Intelligence

- **Story 3.1 (WakeLockService):** The service is fully implemented, singleton-exported, and handles SSR/Graceful degradation. It includes an `init()` method that must be called during a user gesture.
- **Story 1.3 (Audio Integration):** Established the pattern of calling hardware init on the root element's `onClick`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2: Workout Wake Lock Integration]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Hardware Service Abstraction]
- [Source: src/components/WorkoutPlayer.jsx#lines 176-178] (Existing initAudio)
- [Source: src/services/wakeLockService.js] (API: init, acquire, release)
- [Source: _bmad-output/implementation-artifacts/3-1-wake-lock-service-implementation.md] (Implementation details of the service)

## Dev Agent Record

### Agent Model Used

Claude 3.5 Sonnet

### Debug Log References

- No major issues. Initialized both services (Audio, WakeLock) on user interaction as required.

### Completion Notes List

- Integrated `wakeLockService` into `WorkoutPlayer`.
- Refactored `initAudio` to `initHardwareServices` to handle Audio, WakeLock, and Speech service initializations.
- Successfully implemented `acquire()` call when leaving `BLOCK_START` (user gesture).
- Added `useEffect` cleanup to ensure `release()` is called on player unmount.
- Added explicit `release()` call when reaching `WORKOUT_COMPLETE` state to satisfy AC 2.
- Fixed a potential memory leak in `wakeLockService.init()` where listeners were added on every call.
- Added 3 new integration tests in `WorkoutPlayer.test.jsx`.
- Verified all hardware integration acceptance criteria pass.

### File List

- `src/components/WorkoutPlayer.jsx`
- `tests/unit/components/WorkoutPlayer.test.jsx`

