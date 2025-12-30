# Project Constitution

This document establishes the core principles and standards that govern the Ski Prep Pro codebase. These principles ensure consistency, quality, and maintainability across all development efforts.

---

## 1. Architecture Principles

### 1.1 Separation of Concerns

**Principle**: Maintain clear boundaries between presentation, business logic, and side effects.

**Implementation**:
- **Components** (`src/components/`): Handle UI rendering and local state only
- **Services** (`src/services/`): Encapsulate all hardware API integrations and side effects
- **Utils** (`src/utils/`): Contain pure business logic with no side effects
- **Hooks** (`src/hooks/`): Manage shared state logic and React-specific concerns

**Rationale**: Clear separation enables easier testing, better reusability, and prevents tight coupling between concerns.

### 1.2 Singleton Service Pattern

**Principle**: All hardware API integrations MUST be implemented as singleton services.

**Implementation**:
```javascript
class ServiceName {
    constructor() {
        if (ServiceName.instance) {
            return ServiceName.instance;
        }
        // Initialize private fields
        this._isSupported = false;
        ServiceName.instance = this;
    }
    
    init() {
        // Hardware API detection and initialization
        // Called on user gesture
    }
    
    get isSupported() {
        return this._isSupported;
    }
}

const serviceName = new ServiceName();
export default serviceName;
```

**Rationale**: Singleton pattern ensures single source of truth for hardware state, prevents multiple API instances, and provides consistent lifecycle management.

### 1.3 Lazy Initialization

**Principle**: Hardware APIs MUST NOT be initialized on module import.

**Requirements**:
- Services must provide an `init()` method
- `init()` must be called from a user gesture (click, tap)
- Service methods must check initialization state before use
- Graceful degradation when APIs are unavailable

**Rationale**: Browsers require user interaction to enable Speech API and Wake Lock API. Auto-initialization on import violates browser security policies and causes runtime errors.

### 1.4 Graceful Degradation

**Principle**: ALL hardware API calls MUST be wrapped in try/catch blocks and handle failures gracefully.

**Implementation**:
```javascript
try {
    if (!this._isSupported) {
        console.warn('ServiceName: API not supported');
        return;
    }
    // API call
} catch (error) {
    console.error('ServiceName: Error in operation:', error);
    // Never throw - log and continue
}
```

**Rationale**: Hardware APIs have varying browser support. The app must work even when features are unavailable, ensuring the core workout experience remains functional.

### 1.5 No Global State Libraries

**Principle**: For the v1.x scope, use local React state (useState, useContext) instead of Redux/Zustand/MobX.

**Rationale**: Current app complexity doesn't justify global state overhead. Local state keeps components self-contained and reduces dependencies.

**Exception**: If the app scales beyond 20+ components with deep prop drilling, reconsider this principle.

---

## 2. Code Quality Standards

### 2.1 Naming Conventions

**Files**:
- Components: `PascalCase.jsx` (e.g., `WorkoutPlayer.jsx`, `VoiceToggle.jsx`)
- Services/Utils: `camelCase.js` (e.g., `speechService.js`, `linearizer.js`)
- Data files: `camelCase.js` (e.g., `workoutDatabase.js`)
- Assets: `snake_case.png` (e.g., `box_jump.png`, `squat_jump.png`)
- Unit tests: `ComponentName.test.jsx` (matches component name)
- E2E tests: `feature.spec.js` (e.g., `wakeLock.spec.js`, `speech.spec.js`)

**Code**:
- React components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Private class fields: `_leadingUnderscore`

### 2.2 Import Order

**Standard order** (enforced in all files):
1. React imports (`react`, `react-dom`)
2. Third-party library imports (`lucide-react`, etc.)
3. Local component imports
4. Local service/utility imports
5. Data imports
6. Asset imports

**Rationale**: Consistent ordering improves code readability and reduces merge conflicts.

### 2.3 JSDoc Type Hints

**Principle**: Use JSDoc comments for IntelliSense support in JavaScript projects.

**Implementation**:
```javascript
/**
 * Acquire a screen wake lock to prevent the screen from sleeping
 * @returns {Promise<void>}
 */
async acquire() {
    // Implementation
}
```

**Required for**:
- All public service methods
- Complex utility functions
- Custom hook return values

### 2.4 ESLint Rules

**Enforced rules**:
- `no-unused-vars`: Error (with exception for UPPER_CASE variables)
- React Hooks rules: All violations are errors
- React Refresh: Fast refresh compatibility required

**Special handling**:
```javascript
// Disable specific rules only when absolutely necessary with clear justification
/* eslint-disable react-hooks/set-state-in-effect */
// Justification: Timer implementation requires setState in effect cleanup
```

### 2.5 Component Design

**Principles**:
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Props**: Break large components into smaller ones
- **Controlled vs Uncontrolled**: Prefer controlled components for forms/inputs
- **PropTypes**: Define PropTypes for all component props (when using prop-types library)

**Anti-patterns**:
- ❌ Components with 500+ lines (break into sub-components)
- ❌ Components directly calling `navigator.*` APIs (use services)
- ❌ Mixing business logic with rendering (extract to utils/hooks)
- ❌ Deep prop drilling beyond 3 levels (use composition or context)

---

## 3. Testing Standards

### 3.1 Two-Tier Testing Strategy

**Tier 1: Unit Tests (Vitest + React Testing Library)**
- **Location**: `tests/unit/[category]/ComponentName.test.jsx`
- **Purpose**: Test component logic, service behavior, utility functions
- **Coverage Target**: 80%+ for services and utilities, 70%+ for components
- **Run Command**: `npm run test:unit`

**Tier 2: E2E Tests (Playwright)**
- **Location**: `tests/e2e/feature.spec.js`
- **Purpose**: User flows, PWA behavior, hardware integrations
- **Coverage Target**: Critical user paths (workout flow, installation, hardware features)
- **Run Command**: `npm run test:e2e`

### 3.2 Unit Test Patterns

**Mocking strategy**:
```javascript
// Mock services at module level
vi.mock('../../../src/services/speechService', () => ({
    default: {
        init: vi.fn(),
        speak: vi.fn(),
        isSupported: true
    }
}));

// Mock hooks
vi.mock('../../../src/hooks/useVoicePreference', () => ({
    default: vi.fn()
}));
```

**Test structure**:
```javascript
describe('Component/Service Name', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup mocks
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should [specific behavior]', () => {
        // Arrange
        // Act
        // Assert
    });
});
```

**Required test coverage**:
- ✅ Happy path scenarios
- ✅ Error handling and edge cases
- ✅ User interactions (clicks, toggles)
- ✅ State transitions
- ✅ API unavailability (graceful degradation)

### 3.3 E2E Test Patterns

**Fixture usage**:
```javascript
import { test, expect } from '../support/fixtures';

test('should perform action', async ({ page }) => {
    // Fixtures inject hardware fakes automatically
    await page.goto('/');
    // Test implementation
});
```

**Hardware testing**:
- Use `window.__HARDWARE_LOGS__` for verifying API calls in CI
- Custom fixtures (`tests/support/fixtures/`) inject hardware fakes
- Never rely on real hardware APIs in CI (unreliable/unavailable)

**Mobile testing**:
- Tests MUST run on both "Mobile Chrome" and "Mobile Safari" profiles
- Use role-based selectors or `data-testid` attributes
- Avoid brittle selectors (class names, tag names)

**Retry policy**:
- CI: 2 retries for flaky browser interactions
- Local: 0 retries (fail fast for development)

### 3.4 Test Data Strategy

**Principles**:
- Use `@faker-js/faker` for generating realistic test data
- Create data factories in `tests/support/factories/` (if needed)
- Keep test data minimal but representative
- Avoid hardcoding production data IDs in tests

---

## 4. User Experience Consistency

### 4.1 Design System Adherence

**Color Palette** (Tailwind CSS variables):
- Primary: `text-sky-400`, `bg-sky-500`
- Secondary: `text-purple-400`, `bg-purple-500`
- Surface: `bg-slate-800`, `bg-slate-900`
- Text: `text-white`, `text-slate-400`, `text-slate-500`
- Success: `text-emerald-400`, `bg-emerald-500`
- Warning: `text-yellow-400`, `bg-yellow-500`
- Error/Alert: `text-red-400`, `bg-red-500`

**Anti-pattern**:
❌ **NEVER** use hardcoded hex colors (e.g., `#0ea5e9`)
✅ **ALWAYS** use Tailwind utilities (e.g., `text-sky-500`)

**Rationale**: Tailwind utilities ensure design consistency and enable easy theme changes.

### 4.2 Typography Standards

**Headings**:
- H1: `text-2xl font-bold` (page titles)
- H2: `text-xl font-semibold` (section headers)
- H3: `text-lg font-medium` (subsections)

**Body text**:
- Primary: `text-base text-white`
- Secondary: `text-sm text-slate-400`
- Tertiary: `text-xs text-slate-500`

**Special text**:
- Timer displays: `text-7xl font-bold timer-display`
- Countdown warnings: `text-red-400 animate-countdown` (when ≤ 3 seconds)

### 4.3 Component States

**Interactive elements** must have clear visual feedback:
- **Hover**: Brightness/opacity change
- **Active/Pressed**: Scale transform (`scale-95`)
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading**: Spinner or skeleton state

**Button variants** (defined in CSS):
- `btn-primary`: Main actions (Start, Continue)
- `btn-secondary`: Supporting actions (Exit, Restart)
- `btn-accent`: Completion/celebration actions (Done)
- `btn-icon`: Icon-only buttons (consistent size: `w-12 h-12`)

### 4.4 Accessibility Requirements

**ARIA labels**:
- All icon-only buttons MUST have `aria-label`
- Screen reader announcements for state changes (when applicable)
- Semantic HTML elements (`<button>`, `<nav>`, `<header>`)

**Color contrast**:
- Text on dark backgrounds: Minimum AA contrast ratio (4.5:1)
- Use light text colors on dark surfaces

**Focus management**:
- Visible focus indicators on all interactive elements
- Logical tab order matching visual layout

**Touch targets**:
- Minimum size: 44x44px (iOS guidelines)
- Adequate spacing between adjacent buttons (minimum 8px gap)

### 4.5 Animation Principles

**Transitions**:
- Duration: 300ms for most transitions
- 500ms for background color changes (e.g., work → rest states)
- Easing: Default `ease-in-out` or `transition-all`

**Micro-interactions**:
- Button presses: Scale effect
- Countdown: Pulse/glow at ≤ 3 seconds
- Progress indicators: Smooth updates (avoid jarring jumps)

**Performance consideration**:
- Use CSS transforms (`scale`, `translate`) instead of layout properties
- Prefer `opacity` changes over color interpolation
- Limit simultaneous animations to avoid jank

---

## 5. Performance Requirements

### 5.1 Bundle Size Targets

**Initial load**:
- JavaScript bundle: < 200KB gzipped
- Total page weight: < 500KB (excluding exercise images)
- Time to Interactive (TTI): < 3 seconds on 3G

**Strategies**:
- Code splitting not required for v1.x scope (simple SPA)
- Tree-shaking enabled (ESM format)
- No large third-party libraries (current stack is minimal)

### 5.2 Asset Optimization

**Images**:
- Exercise illustrations: 150-200KB each (AI-generated PNGs)
- App icons: Optimized with `sharp` library
- Lazy loading: Consider if total asset size exceeds 3MB

**Service Worker caching**:
- Cache-first strategy for all assets
- Network-first for `index.html` (always get latest)
- Offline fallback for failed network requests

### 5.3 Runtime Performance

**Timer precision**:
- Use `requestAnimationFrame` for smooth countdown timers
- Delta-time calculation prevents drift
- Cancel animation frames on component unmount (prevent memory leaks)

**State updates**:
- Batch state updates in effects when possible
- Use `useCallback` and `useMemo` for expensive computations
- Avoid unnecessary re-renders with proper dependency arrays

**Memory management**:
- Clean up event listeners on unmount
- Cancel pending async operations when components unmount
- Release hardware resources (wake lock, speech) when inactive

### 5.4 Mobile Performance

**Considerations**:
- Minimize DOM size (avoid rendering hidden elements)
- Use CSS transforms for animations (GPU-accelerated)
- Throttle/debounce frequent events if added (none currently)
- Test on real devices, not just desktop emulators

**Progressive Web App optimizations**:
- Service worker precaches all static assets
- Offline mode works after first load
- App shell architecture (fast initial render)

---

## 6. Data Architecture Principles

### 6.1 Embedded Data Strategy

**Principle**: All workout data is statically embedded in the application.

**Structure**:
```
src/data/
├── workoutDatabase.js          # Main workout programs
└── db/
    ├── exercises/
    │   ├── warmup.json
    │   ├── strength.json
    │   ├── stability.json
    │   ├── power.json
    │   └── finisher.json
    └── workouts/
        └── [future workout files]
```

**Loading mechanism**:
- Vite glob imports for modular JSON files
- Tree-shaking eliminates unused data
- No runtime data fetching (zero network dependencies)

**Rationale**: Client-side-only architecture, offline-first requirement, and simplicity. No backend complexity needed.

### 6.2 Data Immutability

**Principle**: Treat all workout data as immutable at runtime.

**Implementation**:
- Never mutate imported workout objects
- Use pure functions to transform data (e.g., `linearizeWorkout()`)
- Clone data structures if modification needed (currently not required)

**Rationale**: Prevents accidental data corruption and makes debugging easier.

### 6.3 Exercise Library Standards

**Required fields** (every exercise):
```javascript
{
    "id": "squat_jump",           // Unique, snake_case
    "name": "Squat Jump",          // Display name
    "instruction": "...",          // Brief how-to
    "category": "power",           // warmup|strength|stability|power|finisher
    "visual_ref": "squat_jump.png" // Matches asset filename (or null)
}
```

**Validation**:
- IDs must be unique across all categories
- Visual references must match actual files in `src/assets/exercises/`
- Categories must match defined enum

---

## 7. Browser API Integration Standards

### 7.1 Web Speech API

**Implementation requirements**:
- Initialize only on user gesture
- Cancel previous utterances before new speech
- Check `speechSynthesis.speaking` before queuing
- Provide visual feedback (voice toggle shows state)

**User control**:
- Must respect global audio mute setting
- Must respect voice preference toggle
- Never speak without user consent

### 7.2 Screen Wake Lock API

**Lifecycle management**:
- Acquire lock when workout starts (block start → first drill)
- Release lock on workout complete
- Release lock on component unmount
- Re-acquire on page visibility change (if previously acquired)

**Error handling**:
- Gracefully handle unsupported browsers (log warning, continue)
- Handle permission errors (already implemented)
- Clean up listeners on service destroy

### 7.3 Web Audio API

**Audio cues**:
- Programmatically generated beeps (no audio files)
- Initialized in `audioManager.init()` on user gesture
- Respect global mute setting

**Sound design**:
- Work start: High-pitched beep (motivating)
- Rest start: Lower-pitched tone (calming)
- Countdown: Triple beep at 3-2-1 seconds
- Complete: Success jingle

---

## 8. PWA Excellence Standards

### 8.1 Installability

**Manifest requirements**:
- `name`: "Ski Prep Pro - 6 Week Training"
- `short_name`: "Ski Prep"
- `display`: "standalone"
- `orientation`: "portrait"
- Icons: 192x192 and 512x512 (maskable)

**Install prompt**:
- Trigger after 2+ workout completions
- Use `beforeinstallprompt` event
- Defer prompt to appropriate moment (not mid-workout)
- Allow dismissal with "Don't show again" option

### 8.2 Offline Strategy

**Service Worker caching**:
- Cache-first for static assets (JS, CSS, images)
- Network-first for HTML (always get latest app shell)
- Fallback to cache on network failure

**Offline UI**:
- App must work 100% offline after first load
- No "You're offline" messages during workouts
- Only show online status if attempting network features (none in v1.x)

### 8.3 Performance Metrics

**Target scores** (Lighthouse):
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- PWA: 100

**Critical metrics**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

---

## 9. Error Handling Philosophy

### 9.1 Never Crash the UI

**Principle**: The workout experience must never be interrupted by JavaScript errors.

**Implementation**:
- Try/catch around all hardware API calls
- Default values for missing data
- Error boundaries for React component trees (if needed)
- Console logging for debugging (not user-facing errors)

### 9.2 Graceful Feature Degradation

**Priority levels**:
1. **Critical**: Workout timer, exercise display, navigation (must always work)
2. **Enhanced**: Voice announcements, audio cues, wake lock (nice to have)
3. **Optional**: PWA installation, analytics tracking (not yet implemented)

**Degradation strategy**:
- Level 2 features fail silently with console warnings
- Level 1 features have fallback implementations
- Level 3 features can be completely disabled without user notice

### 9.3 User Feedback

**When to show errors**:
- ❌ Never show errors for unsupported browser APIs
- ❌ Never interrupt workouts with error modals
- ✅ Show non-blocking warnings for critical issues (none currently)
- ✅ Use visual state indicators (muted icon, disabled toggle)

---

## 10. Version Control & Deployment

### 10.1 Git Workflow

**Branch strategy**:
- `main`: Production-ready code
- Feature branches: `feature/description`
- Hotfix branches: `hotfix/description`

**Commit messages**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(workout): add block rest UI support

- Render "Block Rest" label during BLOCK_REST steps
- Display block completion context
- Show next exercise preview

Closes #42
```

### 10.2 Deployment

**Platform**: GitHub Pages (`roy651.github.io/fitracker`)

**Build process**:
```bash
npm run build
# Vite generates optimized bundle in dist/
# GitHub Actions deploys to gh-pages branch
```

**Pre-deployment checklist**:
- ✅ All unit tests pass (`npm run test:unit`)
- ✅ All E2E tests pass (`npm run test:e2e`)
- ✅ No ESLint errors (`npm run lint`)
- ✅ Build succeeds without warnings
- ✅ Manual smoke test on mobile device

### 10.3 CI/CD Standards

**GitHub Actions** (if configured):
- Run linting on all PRs
- Run unit tests on all PRs
- Run E2E tests on main branch pushes
- Deploy to GitHub Pages on main branch success
- Retry flaky E2E tests up to 2 times

---

## 11. Documentation Standards

### 11.1 Code Documentation

**When to document**:
- ✅ All service methods (JSDoc)
- ✅ Complex algorithms (inline comments)
- ✅ Non-obvious workarounds (with "why" explanation)
- ✅ Architecture decisions (ADRs in `docs/` if needed)
- ❌ Obvious code (avoid noise)

**Example**:
```javascript
/**
 * Linearize a workout structure into a flat array of steps for the player.
 * Converts nested blocks/rounds/drills into sequential WORK, REST, BLOCK_REST steps.
 * 
 * @param {Object} workout - Workout object from database
 * @returns {Array<Step>} Flat array of steps with type, duration, metadata
 */
export function linearizeWorkout(workout) {
    // Implementation
}
```

### 11.2 README Standards

**Required sections**:
- Features overview
- Live demo link
- Installation instructions
- Mobile installation guide (iOS & Android)
- Tech stack
- Testing commands
- Contributing guidelines

**Keep updated**:
- Update when adding major features
- Include screenshots for UI changes
- Link to external documentation if needed

---

## 12. Security Principles

### 12.1 Client-Side Only

**Constraint**: No backend, no authentication, no external APIs.

**Implications**:
- No sensitive data storage
- No user accounts or PII
- localStorage only for preferences and completion tracking
- Safe to expose all source code

### 12.2 Browser API Permissions

**Principle**: Always request permissions from user gestures, never on page load.

**Implementation**:
- Speech API: Request on first toggle or workout start
- Wake Lock: Request when entering workout mode
- PWA install: Defer to user-initiated moment

**Rationale**: Browser security policies require user interaction. Respecting this improves trust.

---

## 13. Future-Proofing Principles

### 13.1 Extensibility

**Design for**:
- Adding new workout programs (modular data structure)
- New exercise categories (category enum in data)
- Additional hardware features (service pattern is established)
- Internationalization (separate strings if needed)

**Avoid**:
- Hardcoding workout IDs in logic
- Tight coupling between components and data shape
- Global constants scattered across files

### 13.2 Breaking Changes

**When introducing breaking changes**:
- Increment version number (semantic versioning)
- Update migration guide in docs
- Consider localStorage schema migrations
- Test with real user data (completion counts, preferences)

### 13.3 Technical Debt Management

**Acceptable debt** (documented, with plan):
- Manual timer testing (complex to automate)
- No integration tests for audio (browser limitation)

**Unacceptable debt**:
- Skipped tests that should pass
- Known memory leaks
- Accessibility violations
- Performance regressions

---

## 14. Enforcement

### 14.1 Automated Checks

**Pre-commit** (or PR checks):
- ESLint (already configured)
- Prettier (consider adding for formatting)
- Unit test suite must pass

**Pre-merge**:
- All tests pass (unit + E2E)
- Lighthouse score thresholds met
- Manual review for UX changes

### 14.2 Code Review Checklist

When reviewing PRs, verify:
- [ ] Follows naming conventions
- [ ] Hardware APIs are properly wrapped in services
- [ ] Graceful degradation implemented
- [ ] Tests added for new features
- [ ] No hardcoded colors (Tailwind utilities only)
- [ ] Accessibility attributes present
- [ ] No console errors in browser
- [ ] Mobile-tested (or screenshots provided)

### 14.3 Constitution Updates

**Process**:
1. Propose changes via PR to this document
2. Document rationale in PR description
3. Require approval from maintainers
4. Update related code to comply with new principles

**Frequency**: Review constitution quarterly or when adding major features.

---

## Conclusion

This constitution represents the distilled wisdom from building Ski Prep Pro. Adhering to these principles ensures:

- **Consistency**: Predictable patterns across the codebase
- **Quality**: High standards for code, tests, and UX
- **Performance**: Fast, responsive experience on all devices
- **Maintainability**: Easy to understand and modify
- **User Trust**: Reliable, accessible, offline-first PWA

When in doubt, refer to these principles. When principles conflict, prioritize user experience over developer convenience, and reliability over features.
