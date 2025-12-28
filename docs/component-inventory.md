# Ski Prep Pro - Component Inventory

> Catalog of all React components and UI elements

---

## Component Summary

| Component | Type | Lines | Props | Purpose |
|-----------|------|-------|-------|---------|
| `App` | Container | 43 | - | Root app with routing state |
| `Dashboard` | Page | 305 | 1 | Week/day workout selection |
| `WorkoutPlayer` | Page | 544 | 2 | Timer-based workout execution |
| `ProgressRing` | Display | 42 | 3 | Circular progress indicator |
| `ExerciseVisual` | Display | 21 | 2 | Exercise illustration display |
| `BlockStartScreen` | Overlay | 24 | 2 | Block transition screen |
| `WorkoutCompleteScreen` | Overlay | 31 | 3 | Workout completion celebration |

---

## Page Components

### 1. App.jsx
**Role:** Application root and screen router

```jsx
// State
const [appState, setAppState] = useState('dashboard' | 'workout');
const [currentWorkout, setCurrentWorkout] = useState(null);

// Renders
<Dashboard /> or <WorkoutPlayer /> based on appState
```

**Functions:**
- `handleStartWorkout(weekKey, day, workout)` - Navigate to workout
- `handleExitWorkout()` - Return to dashboard

---

### 2. Dashboard.jsx
**Role:** Training program navigation interface

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onStartWorkout` | `(weekKey, day, workout) => void` | Callback to start workout |

**Internal State:**
| State | Type | Default | Description |
|-------|------|---------|-------------|
| `selectedWeek` | `string` | `'week_1'` | Currently selected week |
| `selectedDay` | `string \| null` | `null` | Currently selected day |

**UI Sections:**
1. **Header** - "Ski Prep Pro" title with mountain icon
2. **Week Selector** - Horizontal scrollable week pills with phase indicators
3. **Day Cards** - Monday/Wednesday/Thursday workout cards
4. **Workout Preview** - Exercise count, duration, rounds summary
5. **Start Button** - "Start Workout" action button

**Data Dependencies:**
- `weekKeys` - Array of week keys ('week_1' to 'week_6')
- `getDaysForWeek(weekKey)` - Get available days for week
- `getWorkoutTemplate(weekKey, day)` - Get workout template
- `getWorkoutSummary(template)` - Get statistics

---

### 3. WorkoutPlayer.jsx
**Role:** Interactive timer-based workout execution engine

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `workout` | `object` | Workout template object |
| `onExit` | `() => void` | Callback to exit workout |

**Internal State:**
| State | Type | Description |
|-------|------|-------------|
| `steps` | `array` | Linearized workout steps |
| `currentStepIndex` | `number` | Current step being executed |
| `timeRemaining` | `number` | Seconds remaining in current step |
| `isPlaying` | `boolean` | Is timer running |
| `isPaused` | `boolean` | Is timer paused |
| `isComplete` | `boolean` | Is workout finished |
| `isMuted` | `boolean` | Is audio muted |
| `showBlockStart` | `boolean` | Show block transition overlay |
| `elapsedTime` | `number` | Total elapsed seconds |

**Features:**
- Circular progress ring with countdown timer
- Exercise illustration display
- Play/Pause/Skip/Reset controls
- Audio toggle
- Block transition screens
- Completion celebration

---

## Sub-Components (in WorkoutPlayer.jsx)

### 4. ProgressRing
**Role:** SVG circular progress indicator

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | - | Progress 0-1 |
| `size` | `number` | 280 | Ring diameter |
| `strokeWidth` | `number` | 12 | Ring thickness |

**Implementation:** SVG circle with `stroke-dasharray` animation

---

### 5. ExerciseVisual
**Role:** Display exercise illustration image

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `exerciseId` | `string` | Exercise ID (e.g., 'cat_cow') |
| `exerciseName` | `string` | Display name for alt text |

**Dependencies:** `getExerciseImage(exerciseId)` from assets

---

### 6. BlockStartScreen
**Role:** Overlay shown when transitioning to new workout block

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `step` | `object` | Block start step with block info |
| `onContinue` | `() => void` | Callback to dismiss and continue |

**Display:** Block name, round count, drill count

---

### 7. WorkoutCompleteScreen
**Role:** Celebration screen when workout is finished

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `workoutName` | `string` | Name of completed workout |
| `totalTime` | `number` | Total workout duration in seconds |
| `onFinish` | `() => void` | Callback to exit to dashboard |

**Display:** Trophy icon, workout name, total time, "Finish" button

---

## UI Component Classes (from index.css)

### Buttons
| Class | Description |
|-------|-------------|
| `.btn` | Base button styling |
| `.btn-primary` | Blue gradient, primary actions |
| `.btn-secondary` | Gray, secondary actions |
| `.btn-accent` | Orange gradient, emphasis |
| `.btn-success` | Green gradient, completion |
| `.btn-danger` | Red gradient, destructive |
| `.btn-icon` | 56px circular icon button |

### Cards
| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphism with blur effect |

### Animations
| Class | Description |
|-------|-------------|
| `.animate-fade-in` | Fade in from below |
| `.animate-slide-up` | Slide up entrance |
| `.animate-pulse-glow` | Pulsing glow effect |
| `.animate-countdown` | Scale pulse for timers |

### Utilities
| Class | Description |
|-------|-------------|
| `.timer-display` | Tabular-nums font variant |
| `.progress-ring` | SVG progress ring styling |
| `.safe-bottom` | Safe area padding (iOS) |
| `.safe-top` | Safe area padding (iOS) |

---

## Icons (Lucide React)

| Icon | Used In | Purpose |
|------|---------|---------|
| `Mountain` | Dashboard | App header |
| `Calendar` | Dashboard | Week indicator |
| `Dumbbell` | Dashboard | Gym workout icon |
| `Home` | Dashboard | Home workout icon |
| `Timer` | Dashboard | Duration display |
| `ChevronRight` | Dashboard | Card navigation |
| `Snowflake` | Dashboard | Ski theme accent |
| `Zap` | Dashboard, Player | Power/intensity |
| `Target` | Dashboard, Player | Round indicator |
| `Play` | Player | Play button |
| `Pause` | Player | Pause button |
| `SkipForward` | Player | Skip step |
| `RotateCcw` | Player | Reset workout |
| `X` | Player | Exit workout |
| `Volume2` | Player | Sound on |
| `VolumeX` | Player | Sound off |
| `Coffee` | Player | Rest indicator |
| `Trophy` | Player | Completion icon |

---

*Generated by BMad Document Project Workflow on 2025-12-27*
