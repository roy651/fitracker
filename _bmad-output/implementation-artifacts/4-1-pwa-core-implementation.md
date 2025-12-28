# Story 4.1: PWA Core Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the application to work offline and be installable on my device,
so that I can use it in gyms with poor connectivity and access it quickly from my home screen.

## Acceptance Criteria

1. **Given** The application is being built/deployed
   **When** The build process completes
   **Then** A valid web manifest should be generated with correct icons (192px and 512px) and theme colors.
   
2. **Given** The user visits the app for the second time
   **When** A Service Worker is registered using `vite-plugin-pwa`
   **Then** It should precache all application assets (JS, CSS, HTML, Icons).

3. **Given** The user has no internet connection
   **When** They navigate to the application URL
   **Then** The application should load and allowed them to perform a workout (Offline Mode).

4. **Given** Legacy PWA files exist in `public/`
   **When** The new PWA system is implemented
   **Then** `public/sw.js` should be removed and the registration logic in `main.jsx` (if any) should be updated to use `virtual:pwa-register`.

## Tasks / Subtasks

- [x] **Infrastructure Setup** (AC: 1, 2)
  - [x] Install `vite-plugin-pwa` as a dev dependency.
  - [x] Update `vite.config.js` to include the `VitePWA` plugin.
  - [x] Configure `manifest` section in `vitePWA` with values from the existing `public/manifest.json`.
- [x] **Asset Management** (AC: 1)
  - [x] Ensure a 512x512 PNG icon exists. If not, generate it from `ski-icon.svg` or `icon-192.png`.
  - [x] Verify both 192x192 and 512x512 icons are correctly referenced in the PWA config.
- [x] **Service Worker Implementation** (AC: 2, 3)
  - [x] Use `generateSW` strategy with `registerType: 'autoUpdate'`.
  - [x] Ensure all static assets in `public/` (icons, beeps) are included in the glob patterns.
- [x] **Cleanup Legacy Logic** (AC: 4)
  - [x] Remove `public/sw.js`.
  - [x] Remove any manual service worker registration logic in `src/main.jsx` or `index.html`.
  - [x] Ensure `manifest.json` is no longer linked directly in `index.html` if the plugin handles it.
- [x] **Validation** (AC: 3)
  - [x] Build the app and run `npm run preview`.
  - [x] Use browser dev tools to go "Offline" and verify the app loads.

## Dev Notes

- **Architecture Patterns:**
  - **PWA Excellence:** We are moving from a hand-rolled service worker to a managed one via `vite-plugin-pwa`.
  - **Offline-First:** All workout routines and logic are client-side, so offline support is mostly about asset availability.
- **Source Tree Components:**
  - `vite.config.js` (Modification)
  - `public/manifest.json` (Source for migration, then removal)
  - `public/sw.js` (Removal)
  - `src/main.jsx` (Update registration logic)
- **Testing Standards:**
  - Manual verification in browser "Application" tab.
  - Verification of "Offline" functionality in DevTools.

### Project Structure Notes

- **Alignment:** This follows the move towards standard, managed tools in our modern React 19/Vite 7 stack.
- **Consistency:** Maintain the `theme_color` (#0f172a) from the existing manifest.

### References

-   [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1: PWA Core Implementation]
-   [Source: vite.config.js]
-   [Source: public/manifest.json]

## Dev Agent Record

### Agent Model Used

Amelia (Dev Agent) via Antigravity

### Debug Log References

-   Fixed 0-byte `icon-192.png` by generating it from `ski-icon.svg`.
-   Generated `icon-512.png` from `ski-icon.svg`.
-   Updated `tests/setup.js` to mock `virtual:pwa-register`.
-   **AI-Review Fixes**:
    -   Moved `sharp` to `devDependencies` in `package.json`.
    -   Added `test-results/` to `.gitignore`.
    -   Cleaned up extra lines in `index.html`.
    -   Tracked missing `public/icon-512.png` in git.
    -   Cleaned up git index to focus on story-related changes.

### Completion Notes List

-   Installed and configured `vite-plugin-pwa`.
-   Migrated manual SW and manifest logic to the plugin.
-   Verified PWA functionality using the browser subagent in a production preview build.

### File List

-   `vite.config.js`
-   `src/main.jsx`
-   `index.html`
-   `tests/setup.js`
-   `public/icon-192.png` (Updated)
-   `public/icon-512.png` (Added)
-   `.gitignore` (Updated)
-   `public/sw.js` (Removed)
-   `public/manifest.json` (Removed)
-   `package.json` (Updated dependencies)
-   `package-lock.json`
