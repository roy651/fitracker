
# Test Infrastructure

This project uses **Playwright** for End-to-End (E2E) testing, optimized for a Mobile PWA experience.

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Setup Environment:**
   ```bash
   cp .env.example .env
   ```
3. **Run Tests:**
   ```bash
   npm run test:e2e
   ```

## Architecture

We follow the **Test Architect (TEA)** patterns:

- **Fixtures (`tests/support/fixtures/`)**: Dependency injection for tests.
  - `workoutFactory`: Generates realistic workout data.
  - `mockHardware`: Mocks `WakeLock` and `SpeechSynthesis` APIs for reliable headless testing.
- **Factories (`tests/support/fixtures/factories/`)**: Centralized logic for creating test data using `@faker-js/faker`.
- **Hardware Fakes (`tests/support/hardwareFakes.js`)**: Comprehensive mocks for hardware APIs that bypass browser security restrictions in CI/headless environments.
- **Selector Strategy**: We prefer user-visible locators (Role, Text) or `data-testid` where necessary.

## E2E Test Suites

### Hardware Integration Tests

- **`wakeLock.spec.js`**: Verifies Wake Lock API integration
  - Acquire lock when workout starts
  - Release lock when workout finishes or user exits
  - Maintains lock throughout workout session

- **`speech.spec.js`**: Verifies Speech Synthesis integration
  - Announces exercise names and instructions during WORK steps
  - Respects audio mute settings
  - Only speaks on WORK steps, not REST periods

- **`pwa.spec.js`**: Verifies PWA offline functionality
  - App loads and functions while offline
  - Service worker caches assets correctly
  - Workout player maintains state during offline navigation

All hardware tests use the `mockHardware` fixture to inject `hardwareFakes.js`, which logs all API calls to `window.__HARDWARE_LOGS__` for verification.

## Running Modes

- **UI Mode (Interactive):** `npx playwright test --ui`
- **Debug Mode:** `npx playwright test --debug`
- **Mobile emulation:** The config includes "Mobile Chrome" and "Mobile Safari" projects to test PWA responsiveness.

## CI/CD

Tests are configured to run in CI with:
- `forbidOnly`: Prevents committing `.only` focused tests.
- `retries`: 2 retries on CI vs 0 locally.
- `webServer`: Automatically starts the Vite dev server before testing.
