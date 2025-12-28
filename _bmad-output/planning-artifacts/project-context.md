---
project_name: 'fitracker'
user_name: 'Roy'
date: '2025-12-27'
sections_completed: ['technology_stack', 'critical_rules']
status: 'complete'
rule_count: 15
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---


## Technology Stack & Versions

- **Runtime:** React 19.2 + Vite 7.2
- **Language:** JavaScript (ESM)
- **Styling:** TailwindCSS 4.1.18 (Zero-runtime)
- **Icons:** Lucide React 0.562
- **State:** Local React State + Native Hardware API State (via Services)

## Critical Implementation Rules

### Service Layer Patterns (CRITICAL)
- **Singleton Services:** All hardware integrations (WakeLock, Speech) MUST live in `src/services/` as singleton classes.
- **Lazy Initialization:** Services MUST NOT initialize hardware APIs on import. Use an `init()` or `acquire()` method called from a user gesture (Start Workout).
- **Graceful Degradation:** ALL hardware API calls MUST be wrapped in `try/catch`. Failures should be logged to console but MUST NOT crash the UI.

### Framework & Language Rules
- **React 19:** Use functional components and hooks. Avoid class components.
- **ESM Only:** Use `import/export`, not `require`.
- **Tailwind v4:** Use utility classes. Do not create separate `.css` files for components.
- **Strict Logic Separation:** Pure business logic (e.g., workout linearization) goes in `utils/`. Side-effects go in `services/`. UI goes in `components/`.

### Naming Conventions
- **Files:** `PascalCase.jsx` for Components. `camelCase.js` for Services/Utils.
- **Assets:** `snake_case` for images/media.
- **Classes:** `PascalCase` for Service Classes (e.g., `WakeLockService`).
- **Instances:** `camelCase` for Service Instances (e.g., `wakeLockService`).

### Critical Anti-Patterns
- ❌ **No Direct API Calls:** Components must NEVER call `navigator.wakeLock` or `speechSynthesis` directly. Always use the Service layer.
- ❌ **No Global State Libraries:** Do not introduce Redux, Zustand, or Context for this v1.1 scope. Use direct service subscription or simple prop drill.
- ❌ **No Hardcoded Colors:** Always use Tailwind variables (e.g., `text-primary`, `bg-surface`) instead of hex codes.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2025-12-27

