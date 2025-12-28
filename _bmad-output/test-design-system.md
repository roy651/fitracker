# System-Level Test Design

## Testability Assessment

- **Controllability: PASS**
  - **Service Architecture:** The decision to encapsulate active hardware APIs (`WakeLock`, `SpeechSynthesis`) into singleton services (`WakeLockService`, `SpeechService`) allows for straightforward mocking. We can inject mock services during testing to simulate hardware states (e.g., wake lock acquired/released) without needing physical devices.
  - **State Management:** The `WorkoutPlayer` state is driven by the `linearizer` output and local React state, which is easily settable in component tests.
  - **Persistence:** User preferences are stored in `localStorage` (`ski_prep_user_prefs`), which is trivial to seed and inspect in automated tests.

- **Observability: PASS**
  - **Deterministic State:** The transition logic in `linearizer.js` is pure and deterministic. Given a workout definition, the sequence of steps is predictable.
  - **Component Feedback:** The UI provides clear visual indicators (icons, text) for internal states (Rest vs Block Rest, Voice On/Off), making E2E and Component assertion verification reliable.
  - **No Background Magic:** There are no complex background syncs or server-side dependencies that hide state.

- **Reliability: PASS**
  - **Feature Detection:** The architecture mandates wrapping hardware calls with feature detection (`if ('wakeLock' in navigator)`). This path is testable by mocking the absence of these APIs.
  - **Graceful Degradation:** Service methods use `try/catch` blocks, ensuring that hardware failures do not crash the React application. This resilience can be verified via automation.
  - **Isolation:** Services are singletons but do not maintain complex cross-session state (reset on reload), limiting "state pollution" risks.

## Architecturally Significant Requirements (ASRs)

| ASR ID | Requirement | Probability | Impact | Score | Risk Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ASR-1** | **Wake Lock Stability** (NFR6): Screen must remain active for 45 minutes without dimming. | 3 (Likely env issues) | 3 (Critical UX) | **9** | PERF/OPS |
| **ASR-2** | **Voice Reliability** (NFR8): Announcements must complete 100% of the time before next action. | 2 (Possible) | 2 (Degraded UX) | **4** | PERF |
| **ASR-3** | **Hardware Fallback** (NFR13): Must not crash on browsers lacking WakeLock/Speech APIs. | 2 (Possible) | 3 (Critical Crash) | **6** | TECH |
| **ASR-4** | **Audio Synchronization** (NFR3): Voice latency < 500ms from visual transition. | 2 (Possible) | 2 (Degraded UX) | **4** | PERF |
| **ASR-5** | **Offline Operation** (NFR10): Full workout functionality (minus voice depends on OS) without network. | 1 (Unlikely fail) | 3 (Critical) | **3** | OPS |

## Test Levels Strategy

Given the "Mobile Web PWA" architecture with heavy hardware integration logic:

- **Unit: 60%**
  - **Focus:** `linearizer.js` (complex step logic, block rest insertion), `workoutDatabase.js` (schema validation), `AudioService` (beep logic), pure logic within `WakeLockService`/`SpeechService` (mock interactions).
  - **Rationale:** High logic density in the linearizer and utility functions. Fastest feedback loop.

- **Component: 30%** (Integration)
  - **Focus:** `WorkoutPlayer.jsx`, `VoiceToggle.jsx`, `BlockStartScreen.jsx`.
  - **Rationale:** Validating the integration between UI components and the Mocked Services. Verifying that "Voice Toggle" actually calls `speechService.cancel()` or `setState`.

- **E2E: 10%**
  - **Focus:** The "Golden Path" - Start workout -> Verify Speech Trigger -> Wait for Rest -> Verify Block Rest UI -> Complete.
  - **Rationale:** Critical user journey validation. Simulating the passage of time and verifying that "screen lock" was requested (via browser API mocks).

## NFR Testing Approach

- **Security (Client-Side):**
  - **Scope:** No authentication/backend.
  - **Focus:** `localStorage` safety (no injection) and ensuring no sensitive data (if any ever added) is leaked.
  - **Tooling:** Basic Playwright checks to ensure XSS vectors (if user input exists) are sanitized. *Current status: Low risk (Read-only app).*

- **Performance (Responsiveness):**
  - **Metric:** Audio latency and UI responsiveness.
  - **Approach:** E2E tests using `performance.now()` markers to verify that "Speech Start" events occur within <500ms of "Step Start".
  - **Tooling:** Playwright Trace Viewer + Custom performance markers.

- **Reliability (Hardware Simulation):**
  - **Focus:** Simulating hardware failures.
  - **Approach:**
    - **Wake Lock Failure:** Inject mock where `navigator.wakeLock.request` throws error. Verify UI doesn't crash.
    - **Speech Absence:** Inject mock where `window.speechSynthesis` is undefined. Verify Toggle is Disabled.
  - **Tooling:** Playwright `page.addInitScript` to override `navigator` and `window` objects.

- **Maintainability:**
  - **Focus:** strict patterns defined in Architecture doc.
  - **Approach:** Linting rules forbidding direct `navigator.wakeLock` calls in components (must import from `services/`).

## Test Environment Requirements

- **Local:** `vitest` for Unit/Component. `playwright` with mocked browser APIs.
- **CI/CD:** GitHub Actions runner.
  - *Constraint:* Real `WakeLock` and `SpeechSynthesis` do not work in Headless CI.
  - *Strategy:* Heavy reliance on **Mocks/Stubs** for CI. "Real" validation requires manual Testing on real devices (Chrome Android / iOS Safari).

## Testability Concerns (if any)

- **Concern:** `window.speechSynthesis` behavior varies significantly across browsers (iOS vs Android) and is asynchronous/unreliable.
  - **Impact:** Automated tests in CI (Headless Linux) cannot validate *actual* audio output, only the *invocation* of the API.
  - **Mitigation:**
    1. Trust the *invocation* in CI (if we called `speak()`, we pass).
    2. Manual acceptance testing on real devices is mandatory for the "Voice" feature.
    3. Document this limitation in `test-design-system.md`.

## Recommendations for Sprint 0

1. **Scaffold Mocks First:** Before implementing `WorkoutPlayer`, create `src/tests/mocks/mockWakeLockService.js` and `mockSpeechService.js`.
2. **Setup Vitest:** Ensure Vitest is configured to handle ESM and JSX transforms for React 19.
3. **Hardware Test Helper:** Create a Playwright fixture that allows easy enabling/disabling of "Hardware Support" in tests (e.g., `use({ hasWakeLock: false })`).
