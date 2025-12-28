# Ski Prep Pro - Source Tree Analysis

> Annotated directory structure for AI-assisted development

---

## Project Root Structure

```
fitracker/                          # Project root
├── 📄 index.html                   # HTML entry point with PWA meta tags
├── 📄 package.json                 # NPM dependencies & scripts
├── 📄 package-lock.json            # Locked dependency versions
├── 📄 vite.config.js               # Vite + React + Tailwind config
├── 📄 eslint.config.js             # ESLint flat config
├── 📄 README.md                    # Vite template README
│
├── 📁 public/                      # Static assets (copied as-is)
│   ├── 📄 manifest.json            # PWA manifest definition
│   ├── 📄 sw.js                    # Service Worker for offline
│   ├── 🖼️ ski-icon.svg             # App favicon (SVG)
│   └── 🖼️ icon-192.png             # PWA icon (192x192)
│
├── 📁 src/                         # Application source code
│   ├── 📄 main.jsx                 # ⚡ ENTRY POINT - React bootstrap + SW registration
│   ├── 📄 App.jsx                  # Root component with app state/routing
│   ├── 📄 index.css                # Global CSS + Tailwind + Design tokens
│   │
│   ├── 📁 components/              # React UI components
│   │   ├── 📄 Dashboard.jsx        # Week/day selection screen (305 lines)
│   │   └── 📄 WorkoutPlayer.jsx    # Timer workout player (544 lines)
│   │
│   ├── 📁 data/                    # Application data layer
│   │   └── 📄 workoutDatabase.js   # Exercise library + workout templates (319 lines)
│   │
│   ├── 📁 utils/                   # Utility modules
│   │   ├── 📄 linearizer.js        # Workout step sequencer (179 lines)
│   │   └── 📄 audioManager.js      # Web Audio beep generator (108 lines)
│   │
│   └── 📁 assets/                  # Bundled assets
│       ├── 📄 react.svg            # React logo (unused)
│       └── 📁 exercises/           # Exercise illustrations
│           ├── 📄 index.js         # Image import/export helper
│           ├── 🖼️ bird_dog.png     # Exercise: Bird-Dog
│           ├── 🖼️ bosu_bal.png     # Exercise: BOSU Balance
│           ├── 🖼️ bosu_bridge.png  # Exercise: BOSU Bridge
│           ├── 🖼️ bosu_sq.png      # Exercise: BOSU Squat
│           ├── 🖼️ box_jump.png     # Exercise: Box Jump
│           ├── 🖼️ bulgarian.png    # Exercise: Bulgarian Split Squat
│           ├── 🖼️ calf_raise.png   # Exercise: Calf Raises
│           ├── 🖼️ cat_cow.png      # Exercise: Cat-Cow Stretch
│           ├── 🖼️ cossack.png      # Exercise: Cossack Squat
│           ├── 🖼️ curl.png         # Exercise: Hamstring Curl
│           ├── 🖼️ dead_bug.png     # Exercise: Dead Bug
│           ├── 🖼️ goblet_sq.png    # Exercise: Goblet Squat
│           ├── 🖼️ ham_scoop.png    # Exercise: Dynamic Hamstring Scoop
│           ├── 🖼️ hip_opener.png   # Exercise: Hip Opener
│           ├── 🖼️ leg_press.png    # Exercise: Single Leg Press
│           ├── 🖼️ nordic.png       # Exercise: Nordic Drops
│           ├── 🖼️ pallof.png       # Exercise: Pallof Press
│           ├── 🖼️ plank.png        # Exercise: Forearm Plank
│           ├── 🖼️ rdl.png          # Exercise: Single Leg RDL
│           ├── 🖼️ skater.png       # Exercise: Skater Hops
│           ├── 🖼️ step_up.png      # Exercise: Step-Ups
│           └── 🖼️ twist.png        # Exercise: Russian Twist
│
├── 📁 docs/                        # Generated documentation (you are here)
│   ├── 📄 index.md                 # Documentation index
│   ├── 📄 project-overview.md      # Executive summary
│   ├── 📄 architecture.md          # Technical architecture
│   ├── 📄 source-tree-analysis.md  # This file
│   ├── 📄 component-inventory.md   # UI components
│   └── 📄 development-guide.md     # Dev setup & commands
│
├── 📁 node_modules/                # Dependencies (not committed)
│
├── 📁 _bmad/                       # BMad methodology files
└── 📁 _bmad-output/                # BMad workflow outputs
```

---

## Critical Folders Explained

### `/src/` - Application Source
The main application code. All React components, data, and utilities live here.

| Subfolder | Purpose | Key Files |
|-----------|---------|-----------|
| `/components/` | React UI components | `Dashboard.jsx`, `WorkoutPlayer.jsx` |
| `/data/` | Static data store | `workoutDatabase.js` |
| `/utils/` | Helper modules | `linearizer.js`, `audioManager.js` |
| `/assets/exercises/` | Exercise images | 23 PNG illustrations |

### `/public/` - Static Public Files
Files served directly without bundling. Used for PWA assets.

| File | Purpose |
|------|---------|
| `manifest.json` | PWA installation configuration |
| `sw.js` | Service Worker for offline caching |
| `icon-192.png` | App icon for installation |
| `ski-icon.svg` | Favicon |

---

## Entry Points

| Entry Point | Description |
|-------------|-------------|
| `index.html` | HTML shell, loads `/src/main.jsx` |
| `src/main.jsx` | React bootstrap, mounts `<App/>`, registers SW |
| `src/App.jsx` | Application root, handles screen routing |

---

## File Size Summary

| Category | Files | Total Size |
|----------|-------|------------|
| **Components** | 2 | ~33 KB |
| **Data** | 1 | ~10 KB |
| **Utils** | 2 | ~9 KB |
| **CSS** | 1 | ~4 KB |
| **Exercise Images** | 23 | ~4 MB |
| **Total Source** | ~29 files | ~4.1 MB |

---

## Import Dependency Graph

```
main.jsx
│
└── App.jsx
    ├── index.css (styles)
    │
    ├── Dashboard.jsx
    │   ├── lucide-react (icons)
    │   ├── workoutDatabase.js
    │   │   └── (exports: weekKeys, getDaysForWeek, getWorkoutTemplate)
    │   └── linearizer.js
    │       └── (exports: getWorkoutSummary, formatTime)
    │
    └── WorkoutPlayer.jsx
        ├── lucide-react (icons)
        ├── linearizer.js
        │   └── (exports: linearizeWorkout, StepType, formatTime, calculateTotalDuration)
        ├── audioManager.js
        │   └── (exports: audioManager singleton)
        └── assets/exercises/index.js
            └── (exports: getExerciseImage)
```

---

*Generated by BMad Document Project Workflow on 2025-12-27*
