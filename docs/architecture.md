# Ski Prep Pro - Architecture Document

> Technical architecture reference for AI-assisted development

---

## 1. System Overview

**Ski Prep Pro** is a client-side React Progressive Web Application (PWA) with no backend dependencies. All workout data is embedded in the application, and state is managed locally within React components.

### Architecture Style
- **Pattern:** Component-Based Single Page Application (SPA)
- **State Management:** React useState hooks (local component state)
- **Data Strategy:** Static embedded data (no API calls)
- **Offline Support:** Service Worker with cache-first strategy

---

## 2. Technology Decisions

### 2.1 Frontend Framework: React 19
**Rationale:** Modern React with improved performance and StrictMode support. Component model ideal for reusable UI pieces.

### 2.2 Build Tool: Vite 7
**Rationale:** Fast HMR, native ES modules, minimal configuration. Tailwind plugin integration.

### 2.3 Styling: TailwindCSS 4
**Rationale:** Utility-first approach with custom CSS variables for theming. Dark mode by default with glassmorphism design.

### 2.4 PWA Implementation
**Rationale:** Offline capability, installable on mobile devices, native-like experience for workout sessions.

---

## 3. Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        App.jsx                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ State:                                              ││
│  │   - appState: 'dashboard' | 'workout'               ││
│  │   - currentWorkout: { weekKey, day, workout }       ││
│  └─────────────────────────────────────────────────────┘│
│                          │                              │
│         ┌────────────────┴─────────────────┐           │
│         ▼                                  ▼           │
│  ┌──────────────┐                 ┌─────────────────┐  │
│  │  Dashboard   │                 │  WorkoutPlayer  │  │
│  │              │                 │                 │  │
│  │ Props:       │                 │ Props:          │  │
│  │ onStartWorkout│                │ workout, onExit │  │
│  │              │                 │                 │  │
│  │ Features:    │                 │ Features:       │  │
│  │ - Week select│                 │ - Timer         │  │
│  │ - Day select │                 │ - Progress ring │  │
│  │ - Workout    │                 │ - Exercise viz  │  │
│  │   preview    │                 │ - Audio cues    │  │
│  └──────────────┘                 └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.1 App.jsx (Root Component)
- **Purpose:** Application router and global state container
- **State:** `appState` (dashboard/workout), `currentWorkout` (selected workout data)
- **Functions:** 
  - `handleStartWorkout(weekKey, day, workout)` - Transition to workout player
  - `handleExitWorkout()` - Return to dashboard

### 3.2 Dashboard.jsx (Complex Component)
- **Purpose:** Week and day selection interface with workout preview
- **State:** `selectedWeek`, `selectedDay`
- **Features:**
  - Week carousel with phase indicators (Foundation/Performance)
  - Day selection cards (Monday/Wednesday/Thursday)
  - Workout summary preview (duration, exercises, rounds)
- **Data Sources:** `weekKeys`, `getDaysForWeek()`, `getWorkoutTemplate()`

### 3.3 WorkoutPlayer.jsx (Complex Component)
- **Purpose:** Timer-based workout execution engine
- **State:** `currentStepIndex`, `timeRemaining`, `isPlaying`, `isPaused`, `isComplete`, `isMuted`
- **Sub-components:**
  - `ProgressRing` - Circular progress visualization
  - `ExerciseVisual` - Exercise illustration display
  - `BlockStartScreen` - Block transition overlay
  - `WorkoutCompleteScreen` - Completion celebration

---

## 4. Data Architecture

### 4.1 Data Model

```javascript
// workoutDatabase.js structure
{
  exercise_library: {
    [exercise_id]: {
      name: string,
      instruction: string,
      visual_ref: string  // PNG filename
    }
  },
  
  workout_templates: {
    [template_id]: {
      name: string,
      blocks: [{
        name: string,
        rounds: number,
        drills: string[],  // exercise_id references
        work_sec: number,
        rest_sec: number
      }]
    }
  },
  
  program_schedule: {
    [week_key]: {
      [day]: template_id
    }
  }
}
```

### 4.2 Exercise Library
- **Count:** 22 unique exercises
- **Categories:** Warmup, Strength, Stability, Power, Finisher
- **Data:** Name, instruction text, visual reference (PNG illustration)

### 4.3 Workout Templates
- **Count:** 6 workout templates
- **Types:**
  - `gym_monday_p1/p2` - Foundation/Explosive Power
  - `gym_wednesday_p1/p2` - Stability/Speed & Endurance
  - `home_thursday_p1/p2` - Proprioception/Ski Endurance

### 4.4 Program Schedule
- **Duration:** 6 weeks
- **Phases:**
  - Weeks 1-3: Phase 1 (Foundation)
  - Weeks 4-6: Phase 2 (Performance)
- **Frequency:** 3 days/week (Mon, Wed, Thu)

---

## 5. Utility Modules

### 5.1 linearizer.js
**Purpose:** Transforms nested workout template into flat step sequence

```javascript
// Step Types
StepType = {
  BLOCK_START,     // Block transition marker
  WORK,            // Exercise interval
  REST,            // Rest interval
  WORKOUT_COMPLETE // Final step
}

// Key Functions
linearizeWorkout(template)      // Template → Step[]
calculateTotalDuration(steps)   // Steps → seconds
formatTime(seconds)             // 65 → "01:05"
getWorkoutSummary(template)     // Template → {exerciseCount, totalRounds, duration}
```

### 5.2 audioManager.js
**Purpose:** Web Audio API abstraction for workout sounds

```javascript
class AudioManager {
  init()              // Initialize AudioContext
  playWorkStart()     // High pitch double beep
  playRestStart()     // Low pitch calming tone
  playCountdownBeep() // Warning beep at 3,2,1
  playComplete()      // Victory fanfare
  toggle()            // Mute/unmute
}
```

---

## 6. PWA Configuration

### 6.1 manifest.json
```json
{
  "name": "Ski Prep Pro - 6 Week Training",
  "short_name": "Ski Prep",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0f172a",
  "theme_color": "#0f172a"
}
```

### 6.2 Service Worker (sw.js)
- **Strategy:** Cache-first for assets
- **Scope:** Root (`/`)
- **Cached:** Static assets, exercise images, app shell

---

## 7. Styling Architecture

### 7.1 Design System (CSS Variables)
```css
:root {
  --primary: #0ea5e9;      /* Sky blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #f97316;       /* Orange */
  --success: #22c55e;      /* Green */
  --background: #0f172a;   /* Dark navy */
  --surface: #1e293b;      /* Elevated surface */
}
```

### 7.2 Custom Components
- `.glass-card` - Glassmorphism card with backdrop blur
- `.btn-*` - Button variants (primary, secondary, accent, success, danger, icon)
- `.animate-*` - Animation classes (fade-in, slide-up, pulse-glow, countdown)
- `.progress-ring` - SVG circular progress indicator
- `.timer-display` - Tabular numeric font styling

---

## 8. File Dependencies

```
main.jsx
└── App.jsx
    ├── index.css
    ├── Dashboard.jsx
    │   ├── workoutDatabase.js (getDaysForWeek, getWorkoutTemplate)
    │   └── linearizer.js (getWorkoutSummary, formatTime)
    └── WorkoutPlayer.jsx
        ├── workoutDatabase.js (getExercise)
        ├── linearizer.js (linearizeWorkout, formatTime, calculateTotalDuration)
        ├── audioManager.js
        └── assets/exercises/index.js (getExerciseImage)
```

---

## 9. Key Patterns & Decisions

| Decision | Rationale |
|----------|-----------|
| **No routing library** | Simple two-screen app, manual state-based navigation sufficient |
| **Static data over API** | Offline-first PWA, no network dependency |
| **Local component state** | No complex shared state requiring Redux/Context |
| **Web Audio API** | Cross-browser audio, no external audio files needed |
| **PNG illustrations** | AI-generated minimalist exercise visuals, ~150KB each |

---

## 10. Extension Points

For future development, the architecture supports:

1. **Custom Workout Builder** - Add UI to create/edit workout templates
2. **Progress Tracking** - Add localStorage persistence for completed workouts
3. **Voice Announcements** - Extend audioManager with Web Speech API
4. **Rest Timers** - Add configurable rest between blocks
5. **Multi-program Support** - Extend database for different training programs

---

*Generated by BMad Document Project Workflow on 2025-12-27*
