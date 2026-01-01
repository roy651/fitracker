# Design: Refine Dashboard UI

## Phase Panel Removal
The Phase Panel is implemented in `Dashboard.jsx` as a `div` with `glass-card` class, using `phaseInfo` to determine content and gradient.

**Impact:**
- `getPhaseInfo` function might still be needed for Week Selector styling (which uses phase colors), so we keep the helper but remove the banner render.
- The Week Selector buttons use `isPhase2` logic which might be sufficient without the top banner.

## Content Flicker Fix
**Issue:** User reports "loads twice" when opening preview.
**Potential Causes:**
1. **Strict Mode:** In development, React mounts components twice. If animations are triggered on mount, they might play twice or resetting confusingly.
2. **State Jitter:** `setSelectedDay` might be triggering a render, followed by another implicit update?
3. **Animation Conflicts:** `animate-slide-up` combined with dynamic rendering.

**Investigation Plan:**
- Check if `selectedWorkout` logic allows for intermediate states.
- Verify if `animate-slide-up` is CSS-only or JS-driven.
- If it's Strict Mode, it won't happen in production, but "fix this" implies it bothers the user.
- We will try to stabilize the key or memoization.
