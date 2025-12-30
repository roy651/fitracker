# Ski Prep Pro Constitution

<!--
Sync Impact Report:
- Version change: Initial creation → 1.0.0
- Distilled from comprehensive 814-line constitution (openspec/constitution.md)
- Core principles extracted from 14 detailed sections
- Templates requiring updates: ✅ All templates inherit from this constitution
- Reference: See openspec/constitution.md for detailed implementation guidelines
-->

## Core Principles

### I. Service-Oriented Architecture (NON-NEGOTIABLE)

**Hardware API Integration Pattern:**
- ALL browser APIs (Speech, Wake Lock, Audio) MUST be wrapped in singleton services
- Services MUST use lazy initialization via `init()` methods called from user gestures
- Services MUST implement graceful degradation with try/catch around all API calls
- Services MUST never throw errors - log warnings and continue
- Component separation: UI in `components/`, business logic in `utils/`, side effects in `services/`

**Rationale:** Browser security policies require user interaction for hardware APIs. Singleton pattern ensures single source of truth, prevents multiple API instances, and enables consistent lifecycle management. Graceful degradation ensures core workout functionality works even when browser features are unavailable.

### II. Test-First Quality Assurance (NON-NEGOTIABLE)

**Two-Tier Testing Strategy:**
- **Unit Tests** (Vitest + React Testing Library): 80%+ coverage for services/utils, 70%+ for components
- **E2E Tests** (Playwright): Critical user flows, PWA behavior, hardware integrations on mobile profiles
- Red-Green-Refactor cycle enforced: Tests written → Tests fail → Implementation → Tests pass
- Mock services at module level, never rely on real hardware APIs in tests
- Use `window.__HARDWARE_LOGS__` for E2E verification in CI environments

**Rationale:** Hardware integrations are complex and error-prone. Comprehensive testing prevents regressions and ensures reliability across browsers and devices.

### III. Design System Consistency

**Tailwind-Only Styling:**
- **NEVER** use hardcoded hex colors - ALWAYS use Tailwind utilities (`text-sky-500`, `bg-slate-800`)
- Consistent color palette: Primary (sky), Secondary (purple), Surface (slate), Success (emerald)
- Standard button variants: `btn-primary`, `btn-secondary`, `btn-accent`, `btn-icon`
- Typography scale: H1 (`text-2xl font-bold`), H2 (`text-xl font-semibold`), body (`text-base`)
- All icon-only buttons MUST have `aria-label` attributes
- Minimum touch targets: 44x44px with 8px spacing
- Transitions: 300ms for interactions, 500ms for state changes (work → rest)

**Rationale:** Design system adherence ensures visual consistency, improves accessibility (AA contrast ratios), and enables easy theming. Tailwind utilities prevent ad-hoc styling that fragments the design.

### IV. Performance & PWA Excellence

**Bundle & Performance Targets:**
- JavaScript bundle: <200KB gzipped, Time to Interactive: <3s on 3G
- Lighthouse scores: Performance 90+, Accessibility 95+, PWA 100
- Core Web Vitals: FCP <1.5s, LCP <2.5s, CLS <0.1
- Service Worker cache-first for assets, network-first for HTML
- App MUST work 100% offline after first load (embedded data, no network dependencies)

**PWA Requirements:**
- Standalone display mode, portrait orientation, maskable icons (192x192, 512x512)
- Install prompt deferred to appropriate moment (after 2+ workout completions)
- Wake Lock acquired during workouts, released on completion/unmount
- Re-acquire lock on visibility change for uninterrupted sessions

**Rationale:** Mobile-first design requires optimal performance on constrained devices. PWA excellence enables app-like experience with offline reliability and battery-efficient screen management.

### V. Error Handling & Graceful Degradation

**Never Crash Philosophy:**
- Workout experience MUST NEVER be interrupted by JavaScript errors
- Feature priority levels:
  1. **Critical**: Workout timer, exercise display, navigation (must always work)
  2. **Enhanced**: Voice announcements, audio cues, wake lock (fail silently)
  3. **Optional**: PWA install prompts, analytics (can be disabled)
- Try/catch around ALL hardware API calls with console warnings, never user-facing errors
- Default values for missing data, error boundaries for React trees
- Visual state indicators instead of error modals (muted icon, disabled toggle)

**Rationale:** The core value is workout guidance. Enhanced features should augment, not block, the experience. Users on older browsers or restrictive environments must still get full workout functionality.

### VI. Data Immutability & Embedded Architecture

**Client-Side-Only Data:**
- All workout data statically embedded in application (zero network dependencies)
- Data structure: `src/data/workoutDatabase.js` + modular JSON in `db/exercises/`
- Treat all workout data as immutable at runtime - never mutate imported objects
- Use pure functions for transformations (e.g., `linearizeWorkout()`)
- Exercise IDs must be unique, snake_case, with matching visual references

**Rationale:** Offline-first requirement and simplicity. No backend complexity, no data fetching errors, predictable behavior. Immutability prevents accidental corruption and simplifies debugging.

### VII. Code Quality & Maintainability

**Naming & Organization:**
- Files: Components in `PascalCase.jsx`, services/utils in `camelCase.js`, assets in `snake_case.png`
- Import order: React → Libraries → Components → Services → Data → Assets
- JSDoc type hints required for all public service methods and complex utilities
- ESLint rules enforced: `no-unused-vars` (error), React Hooks rules (error), React Refresh compliance

**Component Anti-Patterns:**
- ❌ Components >500 lines (break into sub-components)
- ❌ Direct `navigator.*` calls (use services)
- ❌ Business logic in rendering (extract to utils/hooks)
- ❌ Deep prop drilling >3 levels (use composition/context)

**Rationale:** Consistent conventions reduce cognitive load and merge conflicts. Service abstraction prevents scattered API calls. JSDoc enables IntelliSense in JavaScript projects without TypeScript overhead.

## Code Review & Quality Gates

**Pre-Merge Requirements:**
- [ ] All unit tests pass (`npm run test:unit`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Build succeeds without warnings
- [ ] Follows naming conventions
- [ ] Hardware APIs wrapped in services with graceful degradation
- [ ] Tests added for new features
- [ ] No hardcoded colors (Tailwind utilities only)
- [ ] Accessibility attributes present (aria-labels, semantic HTML)
- [ ] Mobile-tested or screenshots provided

**Technical Debt Policy:**
- **Acceptable** (documented with plan): Manual timer testing, audio integration tests
- **Unacceptable**: Skipped tests, memory leaks, accessibility violations, performance regressions

## Governance

**Constitution Authority:**
This constitution supersedes all other development practices and guidelines. All PRs and code reviews MUST verify compliance with these principles.

**Amendment Process:**
1. Propose changes via PR to this document
2. Document rationale and impact analysis in PR description
3. Require approval from maintainers
4. Update related code, templates, and documentation to comply
5. Increment version according to semantic versioning:
   - **MAJOR**: Breaking principle changes (removal/redefinition)
   - **MINOR**: New principles or material expansions
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements

**Compliance Review:**
Constitution reviewed quarterly or when adding major features. When principles conflict, prioritize: **User Experience** > **Reliability** > **Developer Convenience** > **Features**.

**Detailed Implementation Guidance:**
For comprehensive implementation guidelines, code examples, and detailed standards, refer to `openspec/constitution.md` (814-line reference document).

---

**Version**: 1.0.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2025-12-30
