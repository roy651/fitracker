---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-complete']
inputDocuments:
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture.md
  - docs/component-inventory.md
  - docs/development-guide.md
  - docs/source-tree-analysis.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 6
workflowType: 'prd'
lastStep: 10
projectType: brownfield
---

# Product Requirements Document - Ski Prep Pro v1.1

**Author:** Roy  
**Date:** 2025-12-27T17:44:13+02:00

## PRD Scope

**Focus:** Three near-term feature enhancements for the existing Ski Prep Pro PWA

### In-Scope Features:
1. Rest Timer Between Blocks (block_rest support)
2. Voice Announcements (exercise info, timing, encouragement)
3. Screen Wake Lock API (keep screen on during workouts)
4. Production Readiness & PWA Excellence (Offline mode, Installation UX, E2E Testing, Accessibility)

### Out-of-Scope (Logged in Backlog):
- Exercise Illustration Improvements (mid-term)
- Custom Workout Builder (long-term)

---

## Executive Summary

**Ski Prep Pro v1.1** enhances the existing 6-week ski preparation PWA with three features focused on creating an **immersive, hands-free workout experience**. These additions address the practical reality of exercising with a mobile device: users can't easily interact with screens while performing drills, need verbal guidance, require recovery time between blocks, and depend on the screen staying visible.

This PRD defines additions to an existing, production-ready React PWA. All features will integrate with the established component architecture (`WorkoutPlayer.jsx`, `audioManager.js`, `linearizer.js`) and respect existing patterns (local state, Web APIs, offline-first).

### What Makes This Special

These features work together to transform the app from a **workout timer with pictures** into a **hands-free workout coach**:

1. **Rest Timer Between Blocks** - Configurable recovery periods defined per-block in workout templates, giving athletes proper rest between high-intensity segments
2. **Voice Announcements** - Exercise name and instructions spoken aloud when each drill begins, eliminating the need to look at the screen
3. **Screen Wake Lock** - Keeps the display active during workouts only, ensuring visibility without draining battery during non-workout use

### Target Outcome

Users complete entire workouts without needing to touch their device after pressing "Start" - hearing exercise guidance, seeing progress, and recovering between blocks automatically.

## Project Classification

| Classification | Value |
|----------------|-------|
| **Technical Type** | `web_app` (Progressive Web App) |
| **Domain** | General / Consumer Fitness |
| **Complexity** | Low-Medium |
| **Project Context** | Brownfield - extending existing system |

**Existing Tech Stack:** React 19 + Vite 7 + TailwindCSS 4  
**Architecture Pattern:** Component-Based SPA with local state  
**Extension Points:** `audioManager.js` (voice), `linearizer.js` (rest steps), `WorkoutPlayer.jsx` (wake lock)

---

## Success Criteria

### User Success

Users experience Ski Prep Pro v1.1 as a **polished, professional hands-free workout coach**:

| Success Indicator | Measurable Outcome |
|-------------------|-------------------|
| **Hands-free completion** | User completes entire workout without touching device after pressing "Start" |
| **Clear rest periods** | Block rest displays visible countdown timer, identical UX to drill rest |
| **Audible guidance** | Voice announces exercise name and instructions at drill start |
| **Voice control** | Prominent on-screen toggle allows quick enable/disable of voice |
| **Uninterrupted visibility** | Screen never dims or locks during workout session |
| **Seamless experience** | No jarring transitions, errors, or interruptions throughout workout |

**User "aha!" moment:** First workout where voice announces the next exercise while resting between blocks - "I didn't have to look at my phone once."

### Business Success

This is a personal/family-use project. Success is measured by:

| Metric | Target |
|--------|--------|
| **Personal usage** | Roy uses v1.1 for actual ski prep workouts |
| **Family adoption** | At least one family member uses it without issues |
| **Polish perception** | App feels "well-tailored and professional" - not a hobby project |
| **Feature completeness** | All 3 features work reliably on primary devices |

### Technical Success

| Metric | Target |
|--------|--------|
| **Browser compatibility** | Works on Chrome, Safari, Firefox (mobile + desktop) |
| **Offline support** | Rest timer and wake lock work fully offline |
| **Voice fallback** | Graceful degradation if Web Speech API unavailable |
| **Wake lock reliability** | Screen stays on for workout duration (up to 45 min) |
| **Battery impact** | No noticeable additional battery drain |
| **Integration quality** | New features work with existing components without regressions |
| **PWA Installability** | App is installable on Android/iOS via correct manifest/guidance |
| **Quality Gate** | All hardware APIs (Speech, Wake Lock) verified in E2E tests |
| **Audited Performance** | Lighthouse scores for Performance and Accessibility are >= 90 |

### Measurable Outcomes

1. ✅ **Complete a full 30-minute workout** using all 3 new features
2. ✅ **Zero screen lockouts** during workout sessions
3. ✅ **Voice announces correctly** for all 22 exercises
4. ✅ **Rest timer displays** between blocks matching existing drill rest UX
5. ✅ **Toggle controls** work intuitively for voice and sound

---

## Product Scope

### MVP - Minimum Viable Product (v1.1)

All three features fully functional:

| Feature | MVP Scope |
|---------|-----------|
| **Rest Timer** | Block rest periods configurable in workout template JSON (`block_rest` field), displayed identically to drill rest with countdown timer and audio cue |
| **Voice Announcements** | Exercise name + instruction spoken at drill start using Web Speech API, with visible on/off toggle button |
| **Screen Wake Lock** | Acquire wake lock on workout start, release on exit/completion, no user configuration needed |
| **Production Readiness** | Hardened Service Worker for offline logic, installation guidance/prompts, and real-browser E2E verification |

### Growth Features (Post-MVP)

Potential v1.2 enhancements (out of scope for this PRD):

- **Countdown voice** - "3... 2... 1..." spoken before drill starts
- **Encouragement phrases** - Random motivational interjections mid-workout
- **Voice language selection** - Support for multiple languages
- **Custom rest sounds** - User-selectable audio for rest periods
- **Rest duration override** - In-app setting to adjust rest globally

### Vision (Future)

From the feature backlog (separate PRD cycles):

- **Illustration improvements** - Better contrast, larger size, clearer exercise depiction
- **Custom workout builder** - JSON import + AI-assisted workout generation

---

## User Journeys

### Journey 1: Roy - First Real Workout with the Complete Experience

**Context:** It's a Monday morning in early January. Roy has been building Ski Prep Pro for weeks, and today is the first day of his actual 6-week ski preparation program. He's in his basement home gym, phone propped against a weight rack, ready to test everything for real.

**The Setup:**
Roy opens the app, selects Week 1 → Monday → Gym workout. Before hitting "Start," he notices the new voice toggle button - he turns it ON because his AirPods are in. He presses "Start Workout" and sets his phone down on a nearby bench.

**The Workout:**
The first block begins - a warmup. As each drill starts, Roy hears: *"Cat-Cow Stretch. Start on hands and knees, alternate between arching and rounding your back."* He doesn't need to look at the screen. The countdown beeps at 3-2-1, and he transitions smoothly to the next exercise.

When the warmup block ends, something new happens: a **block rest timer** appears, showing 60 seconds. Roy grabs water, catches his breath, and hears *"Rest complete"* as the next block begins.

Throughout the 30-minute workout, he never touches his phone. The screen **stays on the entire time** - visible from across the room. When he finishes the final exercise, a completion fanfare plays and he sees his total time.

**The Outcome:**
Roy wipes down his equipment, thinking: "That was exactly what I needed. No squinting at the phone, no screen lockouts, no rushing between blocks." He shares the app link with his brother who's also preparing for their ski trip.

---

### Journey 2: Roy - Office Gym Session with Voice Off

**Context:** It's Wednesday, Week 2. Roy is at his office gym during lunch break. The gym is shared space - other people are working out nearby. He doesn't want voice announcements disturbing others.

**The Setup:**
Roy opens Ski Prep Pro and navigates to Week 2 → Wednesday. Before starting, he taps the **voice toggle to OFF** - the button clearly shows voice is disabled. He positions his phone on a treadmill dashboard where he can see it while working on the floor nearby.

**The Workout:**
The workout begins. No voice announcements - but the visual display is crisp and clear. Exercise names, illustrations, and the countdown timer are all visible. Between blocks, the rest timer gives him 45 seconds (this workout template has shorter rest periods configured).

The screen stays on throughout the session. Roy glances at it occasionally to confirm the next exercise, but mostly just follows the countdown beeps.

**A Small Issue:**
Halfway through, Roy's phone battery drops to 15% and shows a low battery warning. He realizes wake lock + screen brightness might drain faster than expected. He makes a mental note to plug in next time, but the workout continues without interruption.

**The Outcome:**
Roy finishes his lunch workout in 25 minutes, showers, and is back at his desk on time. The experience was smooth despite no voice - the visual-first design still works perfectly. He considers whether he should add battery percentage info to the dashboard (future backlog item).

---

### Journey 3: Family Member - First Time Using the App

**Context:** Roy's brother Dan is visiting for the weekend. He wants to try the ski prep workout Roy keeps talking about. Dan has never seen the app before.

**The Setup:**
Roy hands Dan his phone with the app open. Dan looks at the Dashboard - he sees Week 1 selected, three day options. Roy says "Just pick Monday and hit Start." Dan taps Monday, sees the workout preview (exercises, duration), and presses "Start Workout."

**The Experience:**
Dan is immediately guided by voice: *"Get ready. First block: Warmup."* He follows along, the voice announcing each exercise clearly. When he doesn't recognize an exercise from the name alone, he glances at the illustration on screen. 

The **block rest timer** appears between segments - Dan appreciates the breather, not knowing how long he'd get otherwise. The rest countdown gives him time to prepare mentally for the next block.

**The Outcome:**
Dan completes the workout and says: "That was really smooth. I didn't have to figure anything out - it just told me what to do." He asks Roy to send him the link so he can install it on his own phone.

---

### Journey Requirements Summary

| Journey | Key Capabilities Required |
|---------|---------------------------|
| **Roy - Full Experience** | Voice ON, wake lock active, block rest timer, hands-free completion |
| **Roy - Office Gym** | Voice OFF toggle, visual-first UX still works, wake lock active |
| **Family Member - First Use** | Voice as default guide, clear block rest UX, intuitive without explanation |

**Capabilities Revealed:**

1. **Voice Toggle** - Must be prominently visible and easy to toggle before/during workout
2. **Voice Announcements** - Exercise name + instruction spoken clearly at drill start
3. **Block Rest Timer** - Visual countdown displayed identically to drill rest UX
4. **Rest Audio Cue** - Sound when rest ends (matches existing audio pattern)
5. **Screen Wake Lock** - Acquired on workout start, released on exit/completion
6. **Battery Consideration** - Long workouts with wake lock may drain battery (future: battery indicator?)
7. **First-Time UX** - Voice provides guidance that makes app usable without training

---

## Web App Specific Requirements

### Project-Type Overview

Ski Prep Pro v1.1 is a **Progressive Web App (PWA)** built as a Single Page Application using React. The new features leverage modern Web APIs (Web Speech API, Wake Lock API) that have varying browser support. This section documents browser compatibility strategy and technical constraints.

### Browser Compatibility Matrix

| Browser | Wake Lock API | Web Speech API | Priority |
|---------|---------------|----------------|----------|
| **Chrome (Android/Desktop)** | ✅ Full | ✅ Full | Primary |
| **Edge (Desktop)** | ✅ Full | ✅ Full | Primary |
| **Safari (iOS/macOS)** | ✅ Full | ⚠️ Limited | Primary |
| **Firefox (Android/Desktop)** | ❌ Not supported | ⚠️ Limited | Secondary |
| **Samsung Internet** | ✅ Full | ✅ Full | Secondary |

**Notes:**
- Chrome on Android is the expected primary use case
- Safari iOS support is important for family sharing

### Feature Fallback Strategy

| Feature | If Not Supported | User Indication |
|---------|------------------|------------------|
| **Screen Wake Lock** | Timer still works, screen may dim | No indicator needed (graceful fail) |
| **Web Speech API** | Voice toggle shows "disabled" state | Voice icon visually disabled, non-interactive |

**Implementation Note:** When Web Speech API is unavailable, the voice toggle button should:
- Appear visually disabled (grayed out, reduced opacity)
- Not be interactive (no toggle action)
- Optionally show tooltip: "Voice not available in this browser"

### Responsive Design

This is a **mobile-first PWA** with the following considerations:

| Breakpoint | Target | Notes |
|------------|--------|-------|
| **Mobile (primary)** | 320px - 768px | Phone in portrait, propped up during workout |
| **Tablet** | 768px - 1024px | iPad on floor or bench |
| **Desktop** | 1024px+ | Nice-to-have, not primary use case |

**Workout Player Layout:**
- Timer/countdown must be visible from 3-6 feet away (large font)
- Exercise illustration should be large and clear
- Control buttons (play/pause, mute, voice) should be thumb-accessible

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|----------|
| **Time to Interactive** | < 3s | Quick startup for workout sessions |
| **Workout Timer Accuracy** | ±100ms | Countdown must feel precise |
| **Audio Latency** | < 200ms | Beeps should sync with visual countdown |
| **Voice Announcement Delay** | < 500ms | Voice should start promptly at drill begin |
| **Wake Lock Duration** | Up to 45 min | Longest workout is ~40 min |

### Offline Support

| Feature | Offline Capability |
|---------|-----------------------|
| **Timer/Countdown** | ✅ Full (no network needed) |
| **Audio Beeps** | ✅ Full (Web Audio API, local) |
| **Voice Announcements** | ⚠️ Depends on browser | Speech synthesis may require network on some browsers |
| **Exercise Illustrations** | ✅ Full (cached by service worker) |
| **Wake Lock** | ✅ Full (local API) |

### Accessibility Level

**Target:** Maintain current accessibility level (adequate for personal/family use)

| Aspect | Current State | v1.1 Additions |
|--------|---------------|----------------|
| **Screen reader support** | Basic | Voice announcements help screen reader users |
| **Color contrast** | Good (dark theme) | No changes |
| **Touch targets** | 44px minimum | Voice toggle should be 44px+ |
| **Motion sensitivity** | Animations can be intense | No changes |

### Implementation Considerations

1. **Feature Detection First**
   - Check for Wake Lock API support before attempting to acquire
   - Check for Web Speech API support before enabling voice toggle
   - Use `navigator.wakeLock` and `window.speechSynthesis` detection

2. **Battery Awareness**
   - Wake lock + active screen may drain battery during long workouts
   - Consider documenting "plug in for long workouts" in user tips (future)

3. **Audio Context Handling**
   - Web Audio API requires user interaction to initialize (existing pattern)
   - Web Speech API may need similar user gesture to activate on some browsers

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP - Deliver the hands-free workout coaching experience  
**Resource Requirements:** Solo developer, estimated 1-2 focused weekends  
**Target:** Personal use + family sharing before ski season

### MVP Feature Set (v1.1)

**Core User Journeys Supported:**
- ✅ Journey 1: Complete workout with voice + wake lock + block rest
- ✅ Journey 2: Office gym with voice off
- ✅ Journey 3: Family member first-time use

**Must-Have Capabilities:**

| Feature | Scope | Notes |
|---------|-------|-------|
| **Block Rest Timer** | `block_rest` field in template JSON, displayed like drill rest | Reuses existing rest timer UX |
| **Voice Announcements** | Exercise name + instruction at drill start | Web Speech API, toggle control |
| **Screen Wake Lock** | Acquire on workout start, release on exit | Wake Lock API, no config needed |
| **Voice Toggle UI** | Visible button to enable/disable voice | Shows disabled state if API unavailable |

### Explicitly Out of Scope (v1.1)

| Feature | Deferred To | Reason |
|---------|-------------|--------|
| Countdown voice ("3...2...1...") | v1.2 | Enhancement, not essential |
| Encouragement phrases | v1.2 | Nice-to-have |
| Illustration improvements | Mid-term | Separate concern, logged in backlog |
| Custom workout builder | Long-term | Complex, needs dedicated planning |
| Battery indicator | Future | Edge case discovered in journey |
| Voice language selection | Future | English-only for MVP |

### Post-MVP Features

**Phase 2 (v1.2 - Polish):**
- Countdown voice announcements
- Encouragement phrases (random motivational interjections)
- Voice language selection
- Custom rest sounds

**Phase 3 (Future):**
- Illustration quality improvements
- Custom workout builder (JSON import)
- AI-assisted workout generation
- Progress tracking / workout history

### Risk Mitigation Strategy

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | Web Speech API limited on some browsers | Graceful fallback with disabled toggle |
| **Technical** | Wake Lock API not supported on Firefox | Graceful fail, workout still works |
| **Technical** | Battery drain during long workouts | Document "plug in for long workouts" |
| **Market** | N/A - personal project | No market risk |
| **Resource** | Limited dev time before ski season | Focused 3-feature scope, no scope creep |

### Definition of Done (v1.1)

MVP is complete when:
1. ✅ All 3 features implemented and tested
2. ✅ Works on Chrome Android (primary)
3. ✅ Works on Safari iOS (family)
4. ✅ One complete workout done using all features
5. ✅ Family member uses it successfully

---

## Functional Requirements

### Block Rest Timer

- **FR1:** System can display a rest countdown between workout blocks when `block_rest` is defined in the template
- **FR2:** User can see remaining rest time in the same visual format as drill rest timers
- **FR3:** System can play an audio cue when block rest ends
- **FR4:** System can automatically transition from rest to the next block when rest time completes

### Voice Announcements

- **FR5:** System can speak the exercise name aloud when a drill begins
- **FR6:** System can speak the exercise instruction aloud when a drill begins
- **FR7:** User can toggle voice announcements on or off during a workout
- **FR8:** User can see a clear visual indicator showing whether voice is enabled or disabled
- **FR9:** System can detect if Web Speech API is unavailable in the current browser
- **FR10:** User can see that voice toggle is disabled when Web Speech API is unavailable

### Screen Wake Lock

- **FR11:** System can acquire screen wake lock when a workout begins
- **FR12:** System can release screen wake lock when a workout ends or user exits
- **FR13:** System can gracefully handle browsers that do not support Wake Lock API

### Workout Data Model

- **FR14:** Workout templates can include a `block_rest` property specifying rest duration in seconds per block
- **FR15:** System can read and apply `block_rest` values during workout linearization

### User Controls

- **FR16:** User can access voice toggle button from the workout player interface
- **FR17:** User can access existing audio mute toggle from the workout player interface
- **FR18:** User can continue using existing workout controls (play, pause, skip, reset, exit)

### Visual Feedback

- **FR19:** User can see block name and "Block Rest" indicator during rest periods
- **FR20:** User can see the same progress ring animation during block rest as drill rest

### Production Readiness & PWA

- **FR21:** System provides a valid `manifest.json` and Service Worker for offline functionality
- **FR22:** System displays an install prompt (Android) or "Add to Home Screen" guide (iOS)
- **FR23:** System verified via E2E tests (Playwright) specifically for hardware API interactions
- **FR24:** All interactive elements provide correct ARIA labels and keyboard navigation support

---

## Non-Functional Requirements

### Performance

| NFR ID | Requirement | Target | Rationale |
|--------|-------------|--------|----------|
| **NFR1** | Timer countdown accuracy | ±100ms variance | Countdown must feel precise and match user expectations |
| **NFR2** | Audio cue latency | < 200ms from visual | Beeps should sync with countdown timer display |
| **NFR3** | Voice announcement delay | < 500ms from drill start | Voice should begin promptly when exercise starts |
| **NFR4** | App startup time | < 3 seconds to interactive | Quick access for workout sessions |
| **NFR5** | Smooth progress ring animation | 60 FPS on mobile | Visual polish, no jank during countdown |
| **NFR14** | Lighthouse Performance Score | >= 90 | Ensure fast loads and smooth UI |
| **NFR15** | Lighthouse Accessibility Score | >= 90 | Ensure inclusivity and premium feel |

### Reliability

| NFR ID | Requirement | Target | Rationale |
|--------|-------------|--------|----------|
| **NFR6** | Wake lock duration | Hold for up to 45 minutes continuously | Longest workout is ~40 min, buffer for safety |
| **NFR7** | Wake lock stability | No unexpected release during workout | Screen must not dim/lock while timer is active |
| **NFR8** | Voice synthesis completion | 100% of announcements complete before next action | Voice must not get cut off by timer transitions |
| **NFR9** | Graceful API unavailability | No errors shown to user when API unavailable | Fallback silently with visual indication |
| **NFR10** | Offline workout completion | Full workout runs offline (except voice may require network) | PWA must work without network |

### Browser Compatibility

| NFR ID | Requirement | Target | Rationale |
|--------|-------------|--------|----------|
| **NFR11** | Primary browser support | Chrome Android, Safari iOS | Main use cases for Roy and family |
| **NFR12** | Secondary browser support | Chrome Desktop, Edge, Firefox | Nice-to-have, graceful degradation allowed |
| **NFR13** | Feature detection before use | All Web APIs checked before use | Prevent runtime errors on unsupported browsers |

---

