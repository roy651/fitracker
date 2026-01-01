# Refine Dashboard UI

## Summary
Simplify the Dashboard interface by removing the explicit "Phase" banner panel to reduce visual clutter. Additionally, fix a UI bug where the workout preview flickers (loads twice) when first opening.

## Motivation
- **Simplicity**: Users find the "Phase #: Name" panel redundant as the week selector already conveys phase information (color-coded).
- **Quality**: The flicker when opening the workout preview degrades the user experience and feels unpolished.

## Proposed Changes
- **Remove Phase Panel**: Delete the banner component showing the Phase name and description from `Dashboard.jsx`.
- **Update Requirements**: Modify `workout-planning` spec to remove the requirement for a phase banner.
- **Fix Flicker**: logic investigation suggests this might be related to strict mode or redundant state updates; will investigate and fix.
