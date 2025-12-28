# Story 3.1: Wake Lock Service Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to implement a centralized WakeLockService wrapper around the Screen Wake Lock API,
so that the application can prevent the screen from sleeping during critical activities.

## Acceptance Criteria

1. **Given** The application is running in a browser environment
   **When** The `WakeLockService` is initialized
   **Then** It should detect if `navigator.wakeLock` is available and expose an `isSupported` flag

2. **Given** The `acquire()` method is called
   **When** The browser supports the API
   **Then** It should request a screen wake lock
   **And** It should store the `WakeLockSentinel` internally

3. **Given** The app loses focus or visibility (e.g., user switches tabs)
   **When** The app regains visibility
   **Then** The service should automatically attempt to re-acquire the lock if it was previously held

4. **Given** The `release()` method is called
   **When** A lock is currently held
   **Then** It should release the `WakeLockSentinel` and clear the internal reference

5. **Given** The Wake Lock API is NOT supported (e.g., Firefox, older browsers)
   **When** `acquire()` or `release()` are called
   **Then** The methods should gracefully no-op without throwing errors or crashing

## Tasks / Subtasks

- [x] Task 1: Create `wakeLockService.js` file scaffold (AC: 1)
  - [x] 1.1: Create `src/services/wakeLockService.js` following the singleton pattern from `speechService.js`/`audioService.js`
  - [x] 1.2: Implement constructor with singleton pattern
  - [x] 1.3: Add `_isSupported` private flag, `_wakeLockSentinel` private property

- [x] Task 2: Implement `init()` method for feature detection (AC: 1)
  - [x] 2.1: Check `'wakeLock' in navigator` to detect API availability
  - [x] 2.2: Set `_isSupported` flag accordingly
  - [x] 2.3: Expose `isSupported` getter

- [x] Task 3: Implement `acquire()` method (AC: 2, 5)
  - [x] 3.1: Early return if `!_isSupported`
  - [x] 3.2: Call `navigator.wakeLock.request('screen')` inside try/catch
  - [x] 3.3: Store returned `WakeLockSentinel` in `_wakeLockSentinel`
  - [x] 3.4: Add `'release'` event listener on sentinel for cleanup logging

- [x] Task 4: Implement `release()` method (AC: 4, 5)
  - [x] 4.1: Early return if `!_isSupported` or `!_wakeLockSentinel`
  - [x] 4.2: Call `_wakeLockSentinel.release()` inside try/catch
  - [x] 4.3: Set `_wakeLockSentinel = null` after release

- [x] Task 5: Implement visibility change re-acquisition (AC: 3)
  - [x] 5.1: Add `_wasAcquired` flag to track intentional acquisition state
  - [x] 5.2: In `acquire()`, set `_wasAcquired = true`
  - [x] 5.3: In `release()`, set `_wasAcquired = false`
  - [x] 5.4: Add `visibilitychange` event listener on document
  - [x] 5.5: On visibility change, if `document.visibilityState === 'visible' && _wasAcquired`, re-call `acquire()`

- [x] Task 6: Update service index export (AC: N/A - housekeeping)
  - [x] 6.1: Add `wakeLockService` export to `src/services/index.js`

- [x] Task 7: Write unit tests (All ACs)
  - [x] 7.1: Create `tests/unit/services/wakeLockService.test.js`
  - [x] 7.2: Test: `isSupported` returns `true` when `navigator.wakeLock` exists
  - [x] 7.3: Test: `isSupported` returns `false` when `navigator.wakeLock` missing
  - [x] 7.4: Test: `acquire()` calls `navigator.wakeLock.request('screen')`
  - [x] 7.5: Test: `acquire()` stores sentinel internally
  - [x] 7.6: Test: `release()` calls `sentinel.release()` and clears reference
  - [x] 7.7: Test: `acquire()` is no-op when API not supported (no errors)
  - [x] 7.8: Test: Re-acquisition on visibility change when `_wasAcquired` is true

## Dev Notes

- **Architecture Patterns:**
  - **Singleton Service:** Follows the exact same pattern as `speechService.js` and `audioService.js`. Create a class, instantiate once at bottom, export the instance.
  - **Graceful Degradation:** ALL native API calls MUST be wrapped in `try/catch`. This is a CRITICAL project rule from `project-context.md`.
  - **Lazy Initialization:** The `init()` method does feature detection but DOES NOT acquire the lock. Lock acquisition is triggered explicitly by calling `acquire()`.

- **Source Tree Components:**
  - `src/services/wakeLockService.js` (NEW - create this file)
  - `src/services/index.js` (MODIFY - add export)
  - `tests/unit/services/wakeLockService.test.js` (NEW - create tests)

- **Testing Standards:**
  - Mock `navigator.wakeLock` using Vitest's `vi.stubGlobal()` or by assigning to `globalThis.navigator`.
  - Mock `document.addEventListener` for visibility change tests.
  - Use `vi.fn()` for sentinel methods to verify calls.

### Project Structure Notes

- **Alignment with existing service pattern:**
  ```javascript
  // Pattern from speechService.js and audioService.js:
  class WakeLockService {
    constructor() {
      if (WakeLockService.instance) {
        return WakeLockService.instance;
      }
      this._isSupported = false;
      this._wakeLockSentinel = null;
      this._wasAcquired = false;
      WakeLockService.instance = this;
    }
    // ...
  }
  const wakeLockService = new WakeLockService();
  export default wakeLockService;
  ```

- **Naming Conventions (from project-context.md):**
  - File: `camelCase` → `wakeLockService.js` ✓
  - Class: `PascalCase` → `WakeLockService` ✓
  - Instance: `camelCase` → `wakeLockService` ✓

- **Critical Anti-Patterns to AVOID:**
  - ❌ Do NOT call `navigator.wakeLock` directly in components.
  - ❌ Do NOT throw errors from `acquire()` or `release()` - always graceful fail.
  - ❌ Do NOT initialize hardware on import - use `init()` method.

### Previous Epic Learnings (Retrospective)

From Epic 1 Retro (`epic-1-retro-2025-12-28.md`):
1. **TDD Reduces Integration Friction:** Write tests first for complex logic.
2. **Interface Definition:** The service interface (`init`, `acquire`, `release`, `isSupported`) should be defined before implementation to ensure `WorkoutPlayer` integration (Story 3.2) goes smoothly.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1: Wake Lock Service Implementation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Hardware Service Abstraction]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern Examples (Good Example)]
- [Source: _bmad-output/planning-artifacts/project-context.md#Service Layer Patterns (CRITICAL)]
- [Source: src/services/speechService.js] (Reference implementation for singleton pattern)
- [Source: src/services/audioService.js] (Reference implementation for singleton + init pattern)

### Technology Reference: Wake Lock API

**Browser Support (2024):**
- ✅ Chrome 84+ (Desktop & Android)
- ✅ Safari 16.4+ (iOS & macOS)
- ✅ Edge 84+
- ❌ Firefox (Not supported - requires graceful degradation)

**API Shape:**
```javascript
// Feature detection
if ('wakeLock' in navigator) {
  // Request lock
  const sentinel = await navigator.wakeLock.request('screen');
  
  // Listen for release (e.g., tab hidden)
  sentinel.addEventListener('release', () => {
    console.log('Wake Lock was released');
  });
  
  // Release manually
  await sentinel.release();
}
```

**Re-acquisition Pattern:**
The Wake Lock is automatically released when the page loses visibility. The standard pattern is to listen for `visibilitychange` and re-acquire when the page becomes visible again, but ONLY if the app intentionally held the lock before.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (Gemini Dev Agent)

### Debug Log References

No blocking issues encountered.

### Completion Notes List

- Implemented `WakeLockService` following the singleton pattern from `speechService.js` and `audioService.js`
- All native API calls wrapped in try/catch for graceful degradation (per project-context.md)
- Feature detection via `'wakeLock' in navigator` check in `init()` method
- Visibility change re-acquisition implemented using `visibilitychange` event listener
- 30 comprehensive unit tests covering all acceptance criteria and edge cases (up from 23)
- Fixed potential memory leak by storing visibility handler reference and adding `destroy()`
- Added robust environment guards for SSR/Node.js compatibility
- Added JSDoc documentation and public `isLocked` getter
- Full test suite passes (71 tests total, no regressions)

### File List

- `src/services/wakeLockService.js` (NEW)
- `src/services/index.js` (MODIFIED - added wakeLockService export)
- `tests/unit/services/wakeLockService.test.js` (NEW)

### Change Log

- 2025-12-28: Initial implementation of WakeLockService with full test coverage
- 2025-12-28: AI Code Review fixes: added memory leak protection, SSR guards, and JSDoc documentation
