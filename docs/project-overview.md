# Ski Prep Pro - Project Overview

> **6-Week Data-Driven Ski Preparation Program**  
> A Progressive Web App (PWA) for athletes preparing for ski season

---

## Executive Summary

**Ski Prep Pro** is a mobile-first fitness workout application designed to guide users through a structured 6-week ski preparation training program. Built as a Progressive Web App, it can be installed on any device and works offline, providing an immersive workout experience with exercise illustrations, audio cues, and automatic workout progression.

### Key Value Proposition
- 📱 **PWA** - Install on any device, works offline
- 🎯 **Guided Workouts** - Visual exercise demonstrations with timers
- 🔊 **Audio Feedback** - Transition beeps and countdown warnings
- 📊 **Structured Program** - 6-week progressive training phases
- 🏋️ **Mixed Training** - Gym and home/BOSU workout options

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.2.0 | UI Component Library |
| **Build Tool** | Vite | 7.2.4 | Development & Build |
| **Styling** | TailwindCSS | 4.1.18 | Utility-First CSS |
| **Icons** | Lucide React | 0.562.0 | SVG Icon Components |
| **Language** | JavaScript (JSX) | ES2022+ | Application Logic |
| **Type Hints** | JSDoc | - | IntelliSense Support |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Ski Prep Pro                           │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   App.jsx  │───▶│   Dashboard.jsx  │    │ WorkoutPlayer│ │
│  │ (Router)   │    │  (Week/Day View) │    │   (Timer UI) │ │
│  └────────────┘    └─────────────────┘    └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              workoutDatabase.js                       │  │
│  │  • Exercise Library (22 exercises)                    │  │
│  │  • Workout Templates (6 templates)                    │  │
│  │  • Program Schedule (6 weeks)                         │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    UTILITY LAYER                            │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │  linearizer.js  │    │  audioManager.js │               │
│  │ (Workout Steps) │    │   (Audio Cues)   │               │
│  └─────────────────┘    └──────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│                      ASSETS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐       │
│  │ 23 Exercise  │  │   PWA Icons  │  │  manifest   │       │
│  │ Illustrations│  │  (192, 512)  │  │   + SW      │       │
│  └──────────────┘  └──────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

**Type:** Monolith (Single Codebase)

```
fitracker/
├── src/                    # Source code
│   ├── App.jsx             # Main application router
│   ├── main.jsx            # Entry point + SW registration
│   ├── index.css           # Global styles + Tailwind
│   ├── components/         # React components
│   │   ├── Dashboard.jsx   # Week/day selection UI
│   │   └── WorkoutPlayer.jsx # Timer-based workout player
│   ├── data/               # Application data
│   │   └── workoutDatabase.js # Exercise & workout definitions
│   ├── utils/              # Utility modules
│   │   ├── linearizer.js   # Workout step sequencer
│   │   └── audioManager.js # Web Audio API sounds
│   └── assets/             # Static assets
│       └── exercises/      # 23 exercise illustrations (PNG)
├── public/                 # Static public files
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service Worker
│   └── icon-*.png          # App icons
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

---

## Quick Links

- [Architecture Details](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

*Generated by BMad Document Project Workflow on 2025-12-27*
