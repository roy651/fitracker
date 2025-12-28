---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture.md
  - docs/component-inventory.md
  - docs/development-guide.md
  - docs/source-tree-analysis.md
documentCounts:
  prd: 1
  briefs: 0
  projectDocs: 6
workflowType: 'ux-design'
lastStep: 14
---

# UX Design Specification - Ski Prep Pro v1.1

**Author:** Roy
**Date:** 2025-12-27T18:31:11+02:00

---

## Executive Summary

### Project Vision

Ski Prep Pro v1.1 transforms the app from a "workout timer with pictures" into a "hands-free workout coach." Four pillars — Block Rest Timer, Voice Announcements, Screen Wake Lock, and PWA Excellence — work together to enable users to complete entire workouts without touching their device after pressing "Start."

The core UX goal: **Create an immersive, audio-visual coaching experience that is production-ready, accessible, and reliable across mobile platforms.**

### Target Users

**Primary User: Roy**
- Tech-savvy developer, intermediate fitness level
- Uses app in home gym (voice on) and office gym (voice off)
- Wants polished, professional feel — not a hobby project
- Phone propped 3-6 feet away during exercises

**Secondary Users: Family Members**
- Varying tech comfort levels
- First-time users guided entirely by voice
- Should understand app without explanation

### Key Design Challenges

1. **Hands-Free Visibility** — Timer and progress visible from 3-6 feet away
2. **Dual Audio Control** — Clear UX for beeps vs. voice toggles
3. **Seamless Block Rest** — New rest type matches existing UX patterns
4. **Graceful API Fallback** — Voice toggle disabled cleanly when unavailable
5. **First-Time Usability** — Voice serves as onboarding for new users
6. **Installation Awareness** — Guiding users to install the PWA for the best persistent experience
7. **Cross-Browser Hardware Reliability** — Ensuring Speech and Wake Lock beahve consistently during E2E testing

### Design Opportunities

1. **Voice as Coach** — Transform passive timer into active coaching experience
2. **Block Rest Moments** — Use rest as breathing room with preview/encouragement
3. **Audio Hierarchy** — Clear sonic distinction between beeps, chimes, and voice
4. **Rest Micro-Celebrations** — Visual polish during recovery periods

---

## Core User Experience

### Defining Experience

**Primary User Action:** Press "Start Workout" and follow along hands-free until completion.

**Critical Interaction:** The exercise announcement moment — when a new drill starts, voice + visual work together perfectly. This is the heartbeat of the hands-free coaching experience.

**Effortless Flow:** Users should never wonder "what's next?" or "how long?" — the app answers these questions continuously through audio and visual feedback.

### Platform Strategy

| Aspect | Decision |
|--------|----------|
| **Primary Platform** | Mobile web (PWA) — Chrome Android, Safari iOS |
| **Interaction Model** | Touch to start → Hands-free audio/visual guidance |
| **Offline Support** | Full offline functionality required |
| **Key APIs** | Web Audio API (beeps), Web Speech API (voice), Wake Lock API (screen) |
| **Physical Context** | Phone propped 3-6 feet away during exercise |

### Effortless Interactions

1. **Voice Starts Instantly** — No perceptible delay when drill begins
2. **Screen Stays Active** — Wake lock acquired/released invisibly
3. **Block Rest Seamless** — Same UX pattern as drill rest
4. **Toggle Voice** — One tap, immediate feedback, session-persistent
5. **Graceful Fallback** — Missing APIs disable features silently
6. **"Next Up" Preview** — During rest periods, show upcoming drill name/illustration in secondary position for mental preparation

### Critical Success Moments

| Moment | Success Criteria |
|--------|------------------|
| **First Voice Announcement** | Clear, timed with visual, no audio overlap |
| **Block Rest Transition** | Smooth, calming, clear countdown with "Next Up" preview |
| **Workout Completion** | Screen on, fanfare, voice celebration |
| **Voice Toggle** | Instant state feedback, unambiguous icon |
| **Rest Period** | User can see what's coming next without it dominating the rest UI |

### Experience Principles

1. **Audio-Visual Harmony** — Voice, beeps, and visuals complement, never compete
2. **Zero Mid-Workout Friction** — After "Start," interaction is optional
3. **Glanceable From Distance** — Timer and progress visible at 3-6 feet
4. **Seamless State Transitions** — One continuous coached experience
5. **Graceful Degradation** — Missing APIs fail silently, experience is still great
6. **Anticipation Over Surprise** — During rest, preview what's next to reduce cognitive load

---

## Desired Emotional Response

### Primary Emotional Goals

| Emotion | Context |
|---------|--------|
| **Guided & Supported** | Voice coaching creates feeling of personal trainer |
| **Confident & In Control** | Always know what's happening and what's next |
| **Accomplished & Proud** | Workout completion feels like an achievement |
| **Calm During Rest** | Recovery periods feel intentional and peaceful |

### Emotional Journey Mapping

| Stage | Desired Emotion |
|-------|-----------------|
| **Press Start** | Excited confidence — "Here we go!" |
| **First Voice** | Delighted surprise — "Oh, this is nice!" |
| **Mid-Workout** | Flow state — guided without conscious thought |
| **Block Rest** | Calm anticipation — ready for what's next |
| **Final Exercise** | Energized push — "Almost there!" |
| **Completion** | Pride and celebration — "I did it!" |

### Micro-Emotions

**Critical positive states to cultivate:**
- Confidence over confusion (clear voice, visible countdown)
- Trust over worry (wake lock reliability)
- Flow over interruption (seamless transitions)
- Calm over anxiety (peaceful rest periods)

**Negative emotions to prevent:**
- Confusion from overlapping audio
- Abandonment from screen lockout
- Frustration from unclear toggle states

### Design Implications

| Emotional Goal | Design Approach |
|----------------|----------------|
| **"I feel coached"** | Voice announces exercise name + instructions |
| **"I'm never lost"** | Large timer, "Next Up" preview, progress visible |
| **"Rest feels restful"** | Softer visual treatment, calmer audio cue |
| **"I accomplished it"** | Completion fanfare, total time, trophy icon |
| **"This feels premium"** | Smooth animations, polished transitions |

### Emotional Design Principles

1. **Coaching Over Timing** — App should feel like a trainer, not a stopwatch
2. **Calm During Recovery** — Rest periods should feel peaceful and intentional
3. **Celebration Over Completion** — Finishing should feel like an achievement
4. **Trust Through Reliability** — Features that "just work" build emotional trust
5. **Clarity Prevents Anxiety** — Always show what's happening and what's next

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Peloton / Apple Fitness+**
- Voice coaching feels like a personal trainer
- "Coming up next" preview during transitions
- Dark theme with high contrast for visibility

**Nike Training Club / Seven**
- Large countdown timer dominates screen
- Exercise illustration prominent and clear
- Rest periods visually distinct from work

**Timer Apps (Seconds Pro, Tabata Timer)**
- Voice speaks when interval starts
- Screen stays awake during workout
- Voice toggle easily accessible

### Transferable UX Patterns

**Navigation:**
- Single-focus UI during workout (minimal controls)
- Easy exit with confirmation

**Interaction:**
- Large touch targets for pause/play
- Audio toggle always visible
- Auto-progress with countdown at rest end

**Visual:**
- Progress ring around timer (already using)
- "Next Up" in secondary position during rest
- Distinct visual state for rest vs. work

### Anti-Patterns to Avoid

| Anti-Pattern | Prevention |
|--------------|------------|
| Tiny timer text | Large, high-contrast countdown |
| Hidden audio controls | Always visible voice/mute toggles |
| Jarring transitions | Audio cue + visual warning before work starts |
| Voice/beep overlap | Sequence voice, then countdown beeps |
| Screen timeout | Reliable wake lock implementation |

### Design Inspiration Strategy

**Adopt:**
- Progress ring timer pattern (already have)
- Voice-first coaching feel (v1.1 addition)
- "Next Up" preview during rest (v1.1 addition)

**Adapt:**
- Rest state visual distinction (calmer, softer than work)
- Audio toggle prominence (more visible than current mute button?)

**Avoid:**
- Complex controls during workout
- Audio chaos from overlapping sounds
- Screen lockout mid-exercise

---

## Design System Foundation

### Design System Choice

**Approach:** Extend existing TailwindCSS 4 + Custom CSS system  
**Rationale:** Brownfield project with established design language — maintain consistency

### Existing Design Tokens

```css
--primary: #0ea5e9;      /* Sky blue - timer ring, primary actions */
--secondary: #8b5cf6;    /* Purple - accents */
--accent: #f97316;       /* Orange - emphasis, warnings */
--success: #22c55e;      /* Green - completion, success states */
--background: #0f172a;   /* Dark navy - app background */
--surface: #1e293b;      /* Elevated surface - cards, modals */
```

### New Components for v1.1

**Voice Toggle Button:**
- Pattern: Extend `.btn-icon` (56px circular)
- Icon: Voice-specific icon (to be determined)
- States: On (active), Off (inactive), Disabled (API unavailable)
- Disabled treatment: 50% opacity, cursor-default, non-interactive

**Block Rest Screen:**
- Pattern: Match existing drill rest visual treatment
- Label: "Block Rest" to differentiate from drill rest
- Timer: Same countdown ring pattern
- Audio: Use existing rest chime sound

**"Next Up" Preview:**
- Position: Below main timer during rest periods
- Size: Secondary/smaller text hierarchy
- Content: Exercise name, optional thumbnail illustration
- Visibility: Appears during drill rest and block rest

**PWA Installation Prompt/Guide:**
- Pattern: Bottom sheet or floating banner
- Content: "Add to Home Screen" instructions tailored to OS (Android prompt vs iOS Share guide)
- Trigger: Non-intrusive, appearing after the first successful workout or on dedicated dashboard link

### Implementation Approach

1. **No new color tokens** — use existing palette
2. **Follow existing animation patterns** — fade-in, slide-up
3. **Match component sizes** — 56px icon buttons, existing font scales
4. **Consistent spacing** — use existing Tailwind spacing scale

---

## Defining Core Experience

### The Defining Experience

**Core Interaction:** "Start a workout and complete it hands-free while a voice guides you through every exercise."

**User Description:** "I just press Start and put my phone down. It tells me what to do, shows me what's next, and the screen never turns off. I didn't touch it once."

### User Mental Model

Users expect workout apps to guide them. v1.1 removes the need to constantly watch the screen by:
- Voice announcing each exercise
- Screen staying awake throughout
- Block rest providing intentional recovery
- "Next Up" preview reducing surprise

**Mental Model:** "I press Start, listen, glance when I want, complete hands-free."

### Success Criteria

| Indicator | Experience |
|-----------|------------|
| "This just works" | Voice starts immediately, no lag |
| "I feel coached" | Exercise name + instructions spoken clearly |
| "I can focus" | Screen stays on, no interruptions |
| "I'm ready" | "Next Up" preview during rest |
| "I earned this rest" | Block rest feels intentional |
| "I did it!" | Fanfare + voice celebration |

### Pattern Analysis

**Established Patterns (no education needed):**
- Timer countdown, play/pause, progress ring, toggle buttons

**Innovation Within Patterns:**
- Voice coaching at drill start
- Block rest between blocks
- "Next Up" preview during rest
- Dual audio controls (beeps vs. voice)

### Experience Mechanics

**Drill Active:** Voice announces → Timer counts → Beeps at 3-2-1 → Transition

**Drill Rest:** Chime → "Rest" display → "Next Up" preview → Auto-progress

**Block Rest:** Same as drill rest, labeled "Block Rest", shows next block info

**Completion:** Fanfare → Voice "Complete!" → Trophy screen → Wake lock release

---

## Visual Design Foundation

### Color System

**Existing Palette (maintained for v1.1):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | #0ea5e9 | Timer ring, primary buttons, active states |
| `--secondary` | #8b5cf6 | Accents, secondary actions |
| `--accent` | #f97316 | Emphasis, warnings, countdown alerts |
| `--success` | #22c55e | Completion, success states |
| `--background` | #0f172a | App background |
| `--surface` | #1e293b | Cards, elevated surfaces |

**v1.1 Color Additions:**

| State | Treatment |
|-------|----------|
| Voice Toggle ON | Primary color (active) |
| Voice Toggle OFF | Muted (#64748b) |
| Voice Toggle Disabled | 50% opacity, non-interactive |
| Rest States | Same as work (consistent for v1.1) |

### Typography System

**Maintained:**
- Timer: Large, tabular-nums for countdown precision
- Headings: Bold, high contrast for distance readability
- Body: Standard Tailwind typography

**v1.1 Typography Additions:**

| Element | Treatment |
|---------|-----------|
| "Next Up" Label | text-sm, muted color (#94a3b8) |
| "Next Up" Exercise | text-base, medium weight |
| "Block Rest" Label | Same as "Rest" label |

### Spacing & Layout Foundation

**Maintained:**
- 4px base unit (Tailwind scale)
- 56px icon buttons
- Glass card styling with blur

**v1.1 Layout Additions:**

| Element | Position | Spacing |
|---------|----------|---------|
| Voice Toggle | Adjacent to mute button | gap-2 (8px) |
| "Next Up" Preview | Below timer, centered | mt-4 (16px) |

### Accessibility Considerations

- High contrast dark theme (passes WCAG AA)
- Large touch targets (56px minimum)
- Color not sole indicator (icons + labels)
- Voice toggle shows clear state visually

---

## Design Direction Decision

### Design Directions Context

Ski Prep Pro v1.1 extends an established design direction (dark mode, glassmorphism, centered timer layout). This step confirms how v1.1 features integrate with existing UI.

### Chosen Direction

**Voice Toggle:**
- Position: Adjacent to mute button in control bar
- Icon: Speech bubble icon (MessageCircle or similar)
- States: Active (primary color), Inactive (muted), Disabled (50% opacity)

**Block Rest:**
- Treatment: Same as drill rest (Coffee icon, countdown timer)
- Differentiation: Labeled "Block Rest" instead of "Rest"
- Behavior: Same countdown UX, auto-progresses to next block

**"Next Up" Preview:**
- Position: Below main timer, centered
- Content: Text only — "Next: [Exercise Name]"
- Visibility: Appears during drill rest and block rest
- Size: Secondary typography (text-sm label, text-base name)

### Design Rationale

1. **Voice Toggle Adjacent to Mute** — Audio controls grouped logically
2. **Consistent Rest Treatment** — Block rest feels familiar, just labeled differently
3. **Text-Only "Next Up"** — Simple implementation, still reduces cognitive load
4. **Extend Don't Reinvent** — All additions follow established design patterns

### Implementation Approach

1. Add voice toggle button to WorkoutPlayer control bar
2. Add "Block Rest" label logic to rest state display
3. Add "Next Up" text component below timer during rest
4. Follow existing component patterns and spacing

---

## User Journey Flows

### Journey 1: Complete Hands-Free Workout

**User:** Roy (primary) | **Context:** Home gym, voice ON

**Flow Summary:**
1. Dashboard → Select Week/Day → Workout Preview
2. Toggle Voice ON (if not already)
3. Press "Start Workout" → Wake Lock Acquired
4. Block Start Screen → Auto-start first drill
5. Voice announces exercise → Timer counts → Beeps at 3-2-1
6. Drill Rest → "Next Up" preview → Next drill
7. Block Rest (if defined) → "Next Up: Block Name"
8. Repeat until complete
9. Completion: Fanfare + Voice "Complete!" + Trophy
10. User taps "Finish" → Wake Lock Released → Dashboard

### Journey 2: Office Gym (Voice OFF)

**User:** Roy | **Context:** Shared space, no voice

**Flow Summary:**
- Same as Journey 1, but voice announcements skipped
- Visual-only guidance remains fully functional
- Beeps still sound (unless muted separately)

### Journey 3: First-Time Family User

**User:** Family member | **Context:** Never used app before

**Flow Summary:**
- Voice ON by default serves as onboarding
- User understands app through audio guidance alone
- "Next Up" preview helps with anticipation
- Block Rest gives breathing room to process

### Journey Patterns

**Navigation:**
- Linear progression (no back navigation needed)
- Auto-advance from rest to next step
- Single exit point to Dashboard

**Feedback:**
- Audio cue at every transition
- Visual progress (ring, timer, block indicator)
- "Next Up" preview reduces cognitive load

**Error Recovery:**
- Pause/Resume from same point
- Exit confirmation before abandoning
- Wake lock re-acquisition if lost

---

## Component Strategy

### Existing Components (Reused)

| Component | v1.1 Usage |
|-----------|------------|
| `WorkoutPlayer` | Extended with voice toggle, wake lock, block rest |
| `ProgressRing` | Unchanged |
| `ExerciseVisual` | Unchanged |
| `BlockStartScreen` | Unchanged |
| `.btn-icon` | Used for voice toggle button |

### New Components for v1.1

**VoiceToggle Button:**
- Pattern: `.btn-icon` (56px circular)
- Icon: `MessageCircle` / `MessageCircleOff`
- States: ON (primary), OFF (muted), Disabled (50% opacity)
- Location: Control bar, adjacent to mute

**NextUpPreview:**
- Pattern: Text display
- Content: "Next: [Exercise Name]"
- Visibility: During rest periods only
- Animation: fade-in

**Block Rest Display:**
- Pattern: Same as drill rest
- Differentiation: "Block Rest" label
- Data: `block_rest` from template JSON

### Non-Visual Implementations

**Wake Lock Manager:**
- API: `navigator.wakeLock`
- Acquire on workout start, release on exit
- Reacquire on tab visibility change

**Voice Announcement:**
- API: `window.speechSynthesis`
- Trigger on WORK step start
- Content: exercise name + instruction

### Implementation Roadmap

**Phase 1 (Core):**
1. Wake Lock Manager
2. Voice Announcement
3. VoiceToggle Button
4. Block Rest Step Type

**Phase 2 (Enhancement):**
5. NextUpPreview component
6. Block Rest label differentiation

**Phase 3 (Production Readiness):**
7. PWA Manifest & Service Worker hardening
8. OS-specific Installation UX (Android prompts/iOS guides)
9. Hardware E2E testing (Playwright)
10. Accessibility & Performance audit (Lighthouse >= 90)

---

## UX Consistency Patterns

### Toggle Patterns

**Active State:**
- Filled icon, primary color
- Immediate visual feedback on tap

**Inactive State:**
- Outlined/crossed icon, muted color (#64748b)
- Immediate visual feedback on tap

**Disabled State:**
- 50% opacity, cursor-default
- Non-interactive, optional tooltip

### Audio Feedback Hierarchy

| Situation | Sound Type |
|-----------|------------|
| Workout Start | Double high beep |
| Drill Start | Voice announcement |
| Countdown 3-2-1 | Warning beeps |
| Rest Start | Low calming tone |
| Block Rest End | Single chime |
| Workout Complete | Victory fanfare |

**Sequencing Rule:** Voice completes before countdown beeps. No audio overlap.

### State Transition Patterns

| State | Indicator |
|-------|-----------|
| WORK | Primary ring, illustration, timer |
| REST | "Rest" label, Coffee icon |
| BLOCK_REST | "Block Rest" label |
| COMPLETE | Trophy, success color, total time |

**Transitions:** Fade animations between states, audio cues at transitions.

### Error/Fallback Patterns

**Philosophy:** Silent graceful degradation

| Unavailable API | Fallback |
|-----------------|-----------|
| Wake Lock | Workout continues normally |
| Speech Synthesis | Voice toggle disabled |
| Audio Context | Prompt for user interaction |

No visible error messages — features disable silently with visual indication.

---

## Responsive Design & Accessibility

### Responsive Strategy

**Approach:** Mobile-first, single-column layout

| Breakpoint | Target | Notes |
|------------|--------|-------|
| 320px - 767px | Phone (primary) | Core experience |
| 768px+ | Tablet/Desktop | Same layout, acceptable for personal use |

**Physical Context:** Phone propped 3-6 feet away, portrait orientation

**Key Elements:**
- Timer: Large enough to read from distance
- Controls: 56px touch targets
- "Next Up": Secondary but readable

### Accessibility Strategy

**Target:** WCAG 2.1 Level AA

**Existing Compliance:**
- High contrast dark theme
- 56px touch targets (exceeds 44px minimum)
- Semantic HTML structure
- **Audit Target:** Achieve a Lighthouse Accessibility score of >= 90.

**v1.1 Additions:**

| Element | Requirement |
|---------|-------------|
| Voice Toggle | `aria-label`, `aria-pressed` |
| Voice Disabled | `aria-disabled`, tooltip |
| Block Rest | `aria-live="polite"` |

**Voice as Enhancement:** Voice announcements improve accessibility for users with visual impairments.

### Testing Strategy

**Responsive Testing:**
- Primary: Chrome Android, Safari iOS
- Secondary: iPad Safari

**Accessibility Testing:**
- Lighthouse accessibility audit
- Keyboard navigation verification
- VoiceOver/TalkBack testing

---
