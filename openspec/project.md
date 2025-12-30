# Project Context

## Purpose

**Ski Prep Pro** is a Progressive Web App (PWA) designed to guide users through a structured 6-week ski preparation training program. The app provides:

- 📱 **Installable PWA** – Works offline and installs on any device (iOS & Android)
- 🗣️ **Voice Coaching** – Text-to-speech announces exercises so users don't need to watch the screen
- 🔊 **Audio Cues** – Sound effects for work/rest transitions and countdowns
- ⚡ **Wake Lock** – Keeps screen awake during workouts
- 🎯 **Sport-Specific Programming** – Builds quad stamina, core stability, and explosive power for skiing

**Live App:** https://roy651.github.io/fitracker/

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.2.0 | UI Component Library |
| **Build Tool** | Vite | 7.2.4 | Development & Build |
| **Styling** | TailwindCSS | 4.1.18 | Utility-First CSS (Zero-runtime) |
| **Icons** | Lucide React | 0.562.0 | SVG Icon Components |
| **Language** | JavaScript (ESM) | ES2022+ | Application Logic |
| **Unit Testing** | Vitest | 4.0.16 | Fast unit tests with React Testing Library |
| **E2E Testing** | Playwright | 1.57.0 | Cross-browser E2E tests |
| **Type Hints** | JSDoc | - | IntelliSense Support |

## Project Conventions

### Code Style

- **Components:** `PascalCase.jsx` (e.g., `Dashboard.jsx`, `WorkoutPlayer.jsx`)
- **Utilities/Services:** `camelCase.js` (e.g., `linearizer.js`, `speechService.js`)
- **Data Files:** `camelCase.js` (e.g., `workoutDatabase.js`)
- **Assets/Images:** `snake_case.png` (e.g., `box_jump.png`, `squat_jump.png`)
- **Test Files:** `*.test.jsx` for unit tests, `*.spec.js` for E2E tests
- **ESLint:** Flat config with React Hooks and React Refresh plugins

**Import Order:**
1. React imports
2. Third-party imports (lucide-react)
3. Local components
4. Local utilities/services
5. Styles/assets

### Architecture Patterns

**Component-Based SPA with Service Layer:**

```
src/
├── components/       # React UI components (presentation + local state)
├── services/         # Singleton services for hardware APIs (side-effects)
├── utils/            # Pure business logic (no side-effects)
├── hooks/            # Custom React hooks
├── data/             # Static embedded data
└── assets/           # Images and static resources
```

**Key Patterns:**
- **Singleton Services:** All hardware integrations (WakeLock, Speech) live in `src/services/` as singleton classes
- **Lazy Initialization:** Services must NOT initialize hardware APIs on import; use `init()` called from user gesture
- **Graceful Degradation:** ALL hardware API calls wrapped in try/catch; failures logged but never crash UI
- **State Management:** Local React useState hooks (no Redux/Zustand/Context for v1.x scope)
- **Data Strategy:** Modular JSON-based database with Vite glob imports (`src/data/db/`)
- **Offline Support:** Service Worker with cache-first strategy via vite-plugin-pwa

**Anti-Patterns to Avoid:**
- ❌ Components directly calling `navigator.wakeLock` or `speechSynthesis`
- ❌ Adding global state libraries for simple state needs
- ❌ Hardcoded hex colors (use Tailwind variables: `text-primary`, `bg-surface`)
- ❌ Separate `.css` files for components (use Tailwind utilities)

### Testing Strategy

**Two-Tier Testing:**

1. **Unit Tests (Vitest + React Testing Library)**
   - Location: `tests/unit/*.test.jsx`
   - Run: `npm run test:unit`
   - Focus: Component logic, service behavior, utility functions
   - Mocks: `vi.mock()` for services and browser APIs

2. **E2E Tests (Playwright)**
   - Location: `tests/e2e/*.spec.js`
   - Run: `npm run test:e2e`
   - Focus: User flows, PWA behavior, hardware integrations
   - Mobile profiles: "Mobile Chrome" and "Mobile Safari"
   - Hardware mocking: Custom fixtures inject `window.__HARDWARE_LOGS__`

**Test Patterns:**
- Fixtures at `tests/support/fixtures/` for dependency injection
- Factories use `@faker-js/faker` for realistic test data
- Hardware fakes at `tests/support/hardwareFakes.js` for CI reliability
- Prefer user-visible locators (Role, Text) or `data-testid`

### Git Workflow

- **Branch Strategy:** Feature branches off `main`
- **Deployment:** GitHub Pages at `roy651.github.io/fitracker`
- **CI:** Playwright tests run with 2 retries, `forbidOnly` enabled

## Domain Context

**6-Week Ski Preparation Program:**

- **Weeks 1-3:** Phase 1 (Foundation) – Build base strength and stability
- **Weeks 4-6:** Phase 2 (Performance) – Explosive power and ski-specific endurance
- **Frequency:** 3 days/week (Monday, Wednesday, Thursday)
- **Workout Types:**
  - Gym workouts (Monday/Wednesday) – Equipment-based strength
  - Home/BOSU workouts (Thursday) – Proprioception and balance

**Workout Structure:**
- Workouts consist of **Blocks** (logical groupings)
- Each Block has multiple **Rounds**
- Each Round has **Drills** (exercises with work/rest intervals)
- Block transitions include optional **Block Rest** periods

**Exercise Library:** 22+ exercises with AI-generated illustrations, categorized as Warmup, Strength, Stability, Power, Finisher

## Important Constraints

- **Client-Side Only:** No backend; all data embedded in app
- **Offline-First:** Must work completely offline after first load
- **Mobile-First:** Primary use is on mobile devices during workouts
- **Browser APIs:** Limited to Web Speech API, Screen Wake Lock API, Web Audio API
- **No Authentication:** Single-user app with no login required
- **Performance:** Exercise images ~150-200KB each; lazy loading recommended if bundle grows

## External Dependencies

**Browser APIs Used:**
- **Web Speech API** – Voice coaching announcements
- **Screen Wake Lock API** – Prevent screen sleep during workouts
- **Web Audio API** – Programmatic sound effects (no audio files)
- **Service Workers** – Offline caching via vite-plugin-pwa

**No External Services:** The app has zero network dependencies after initial load. All workout data, exercise library, and program schedule are statically embedded.
