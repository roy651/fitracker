# Ski Prep Pro - Development Guide

> Setup, commands, and development workflow

---

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 18+ (LTS recommended) | JavaScript runtime |
| **npm** | 9+ (comes with Node) | Package manager |

---

## Quick Start

```bash
# Clone or navigate to project
cd fitracker

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser (usually http://localhost:5173)
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |

---

## Development Server

The dev server runs on **http://localhost:5173** by default.

**Features:**
- ⚡ Hot Module Replacement (HMR)
- 🔄 Fast refresh for React components
- 🌐 Exposed on local network (`host: true` in config)

To access on mobile device:
1. Run `npm run dev`
2. Note the Network URL (e.g., `http://192.168.x.x:5173`)
3. Open that URL on your mobile device (same WiFi network)

---

## Project Configuration

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,  // Expose on local network
  },
})
```

### TailwindCSS
- Uses Vite plugin `@tailwindcss/vite`
- Custom CSS variables defined in `src/index.css`
- Dark theme by default

### ESLint
- Flat config format (`eslint.config.js`)
- React Hooks plugin enabled
- React Refresh plugin enabled

---

## Environment Setup

No environment variables required. The app has no backend dependencies.

If adding environment variables in the future:
1. Create `.env` file in project root
2. Prefix variables with `VITE_` (e.g., `VITE_API_URL`)
3. Access in code: `import.meta.env.VITE_API_URL`

---

## Building for Production

```bash
# Build
npm run build

# Output: /dist folder
# Contents:
#   - index.html
#   - assets/
#     - index-[hash].js
#     - index-[hash].css
#     - exercise images
```

### Deployment
The `/dist` folder is ready for static hosting:
- **Vercel:** Push to connected Git repo
- **Netlify:** Drag & drop `/dist` or connect Git
- **GitHub Pages:** Copy `/dist` contents to `gh-pages` branch
- **Any static host:** Upload `/dist` contents

---

## Testing PWA Features

### Install PWA Locally
1. Run `npm run build`
2. Run `npm run preview`
3. Open browser DevTools → Application → Manifest
4. Check PWA installability
5. Click browser's "Install" button

### Test Service Worker
1. Open DevTools → Application → Service Workers
2. Verify SW is registered and active
3. Toggle "Offline" in Network tab
4. Confirm app still works

---

## Adding New Features

### Adding a New Exercise

1. Add exercise image to `/src/assets/exercises/`:
   - Filename: `exercise_id.png` (lowercase, underscores)
   - Size: ~500x500px recommended

2. Update `/src/assets/exercises/index.js`:
   ```javascript
   import newExercise from './new_exercise.png';
   // Add to imageMap
   ```

3. Add to exercise library in `/src/data/workoutDatabase.js`:
   ```javascript
   new_exercise: {
     name: "Exercise Name",
     instruction: "Brief instruction text",
     visual_ref: "new_exercise.png"
   }
   ```

4. Use in workout template drills array:
   ```javascript
   drills: ["existing_exercise", "new_exercise"]
   ```

### Adding a New Workout Template

1. Add template to `/src/data/workoutDatabase.js`:
   ```javascript
   workout_templates: {
     new_workout_id: {
       name: "Display Name",
       blocks: [
         {
           name: "Block Name",
           rounds: 3,
           drills: ["exercise_id_1", "exercise_id_2"],
           work_sec: 45,
           rest_sec: 15
         }
       ]
     }
   }
   ```

2. Add to program schedule:
   ```javascript
   program_schedule: {
     week_7: {
       Monday: "new_workout_id"
     }
   }
   ```

---

## Code Style

### File Naming
- Components: `PascalCase.jsx` (e.g., `Dashboard.jsx`)
- Utilities: `camelCase.js` (e.g., `linearizer.js`)
- Data: `camelCase.js` (e.g., `workoutDatabase.js`)
- Images: `snake_case.png` (e.g., `box_jump.png`)

### Import Order
1. React imports
2. Third-party imports (lucide-react)
3. Local components
4. Local utilities
5. Styles

### Component Structure
```jsx
// 1. Imports
// 2. Constants/helpers
// 3. Sub-components (if any)
// 4. Main component function
// 5. Export default
```

---

## Debugging Tips

### React DevTools
Install browser extension for:
- Component tree inspection
- Props/state viewing
- Component highlighting

### Audio Issues
If audio doesn't play:
1. Check user interaction requirement (first click initializes)
2. Check `audioManager.isEnabled`
3. Check browser autoplay policies

### PWA Not Installing
1. Verify HTTPS (or localhost for dev)
2. Check manifest.json validity
3. Confirm service worker is registered
4. Check for console errors

---

## Performance Notes

- Exercise images are ~150-200KB each (23 total = ~4MB)
- Consider lazy loading for exercise images if bundle grows
- All audio is generated programmatically (no audio files)
- Service worker caches all static assets

---

*Generated by BMad Document Project Workflow on 2025-12-27*
