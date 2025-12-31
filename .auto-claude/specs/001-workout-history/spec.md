# Specification: Workout History Feature

## Overview

This feature adds workout history tracking functionality to the Ski Prep Pro fitness application. Users will be able to view their completed workouts in a table format showing date, workout name, and duration. The history persists using browser local storage. Users can delete individual workout entries or clear all history with appropriate confirmation dialogs. The existing Settings button in the Dashboard header will be expanded to a dropdown menu with two options: Settings and History.

## Workflow Type

**Type**: feature

**Rationale**: This is a new feature that adds significant new functionality (history tracking, new UI components, data persistence, and user management capabilities). It requires creating new components, a new custom hook, modifying existing components, and adding comprehensive tests.

## Task Scope

### Services Involved
- **main** (primary) - React frontend application containing all components, hooks, and services

### This Task Will:
- [ ] Expand the Settings button in Dashboard header to a dropdown menu with Settings and History options
- [ ] Create a History view component displaying completed workouts in a table format
- [ ] Implement a custom hook (`useWorkoutHistory`) for managing history data with localStorage persistence
- [ ] Add delete functionality for individual workout entries with confirmation dialog
- [ ] Add "Clear All History" functionality with warning confirmation dialog
- [ ] Hook into workout completion flow to save history entries automatically
- [ ] Add unit tests for the new hook and components
- [ ] Add E2E tests for the history flow

### Out of Scope:
- Backend/server-side storage (using localStorage only)
- Export/import history functionality
- Syncing history across devices
- History analytics or statistics dashboard
- Filtering or sorting history entries

## Service Context

### Main (React Frontend)

**Tech Stack:**
- Language: JavaScript
- Framework: React
- Build Tool: Vite
- Styling: Tailwind CSS
- Testing: Vitest (unit), Playwright (E2E)
- Key directories: `src/components`, `src/hooks`, `src/services`, `src/utils`

**Entry Point:** `src/App.jsx`

**How to Run:**
```bash
npm run dev
```

**Port:** 5173 (Vite default, BASE_URL configured in .env)

**Test Commands:**
```bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
```

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `src/components/Dashboard.jsx` | main | Replace Settings button with dropdown menu containing Settings and History options |
| `src/components/WorkoutPlayer.jsx` | main | Hook into workout completion (line ~122) to save workout history entry |
| `src/App.jsx` | main | Add History view state and rendering logic |

## Files to Create

| File | Service | Purpose |
|------|---------|---------|
| `src/hooks/useWorkoutHistory.js` | main | Custom hook for managing workout history with localStorage |
| `src/components/HistoryView.jsx` | main | Component displaying history table with delete actions |
| `src/components/ConfirmDialog.jsx` | main | Reusable confirmation dialog component |
| `src/components/MenuDropdown.jsx` | main | Dropdown menu component for Settings/History toggle |
| `tests/unit/hooks/useWorkoutHistory.test.js` | main | Unit tests for history hook |
| `tests/unit/components/HistoryView.test.jsx` | main | Unit tests for history component |
| `tests/e2e/history.spec.js` | main | E2E tests for history feature |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/hooks/useVoicePreference.js` | localStorage persistence pattern with useState/useEffect |
| `src/hooks/useProgramSelection.js` | Hook structure for data management with localStorage |
| `src/components/Dashboard.jsx` (lines 331-354) | Modal overlay pattern with slide-up animation |
| `src/components/ProgramSelector.jsx` | Component structure with PropTypes validation |
| `src/components/WorkoutPlayer.jsx` (lines 117-124) | Workout completion handling and localStorage tracking |
| `tests/unit/hooks/useVoicePreference.test.js` | Unit test structure for custom hooks |

## Patterns to Follow

### localStorage Hook Pattern

From `src/hooks/useVoicePreference.js`:

```javascript
const STORAGE_KEY = 'ski_prep_user_prefs';

export default function useVoicePreference() {
    const [isEnabled, setIsEnabled] = useState(false);

    // Load preference on mount
    useEffect(() => {
        const savedPrefs = localStorage.getItem(STORAGE_KEY);
        if (savedPrefs) {
            try {
                const prefs = JSON.parse(savedPrefs);
                // ... handle data
            } catch (e) {
                console.warn('Failed to parse user prefs', e);
            }
        }
    }, []);

    const updatePreference = useCallback((newValue) => {
        setIsEnabled(newValue);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ voiceEnabled: newValue }));
    }, []);

    return { isEnabled, toggle, setEnabled: updatePreference };
}
```

**Key Points:**
- Use a unique STORAGE_KEY constant
- Load data in useEffect on mount
- Wrap in try/catch for JSON.parse safety
- Use useCallback for update functions
- Return object with state and handlers

### Modal Overlay Pattern

From `src/components/Dashboard.jsx` (lines 331-354):

```javascript
{showProgramSelector && (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 animate-fade-in"
         onClick={() => setShowProgramSelector(false)}>
        <div
            className="w-full max-w-lg bg-slate-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Content */}
        </div>
    </div>
)}
```

**Key Points:**
- Use fixed positioning with z-50
- Background overlay with bg-black/70
- Click outside to dismiss (onClick on overlay, stopPropagation on content)
- Use animate-fade-in and animate-slide-up classes
- Content uses glass-card or bg-slate-900 styling

### Component with PropTypes Pattern

From `src/components/ProgramSelector.jsx`:

```javascript
import PropTypes from 'prop-types';

export default function ProgramSelector({ programs, selectedProgramId, onSelect }) {
    // Component logic
}

ProgramSelector.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedProgramId: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};
```

**Key Points:**
- Import PropTypes from 'prop-types'
- Define propTypes after component export
- Use shape() for object types
- Mark required props with .isRequired

## Requirements

### Functional Requirements

1. **Dropdown Menu**
   - Description: Replace single Settings button with dropdown showing Settings and History options
   - Acceptance: Clicking the menu button reveals both options; clicking outside closes the menu

2. **History View**
   - Description: Display completed workouts in a table with Date, Workout Name, and Duration columns
   - Acceptance: Table shows all completed workouts sorted by date (newest first)

3. **Save Workout on Completion**
   - Description: Automatically save workout data when user completes a workout
   - Acceptance: After completing a workout and returning to dashboard, the workout appears in history

4. **Delete Individual Entry**
   - Description: Each history row has a delete button with confirmation
   - Acceptance: User can delete single entries after confirming the action

5. **Clear All History**
   - Description: Button to delete all history entries with warning dialog
   - Acceptance: Clear All shows warning, requires confirmation, and removes all entries

6. **Data Persistence**
   - Description: History survives page refresh and browser restarts
   - Acceptance: Closing and reopening the app shows previously saved workouts

### Edge Cases

1. **Empty History State** - Show a friendly message when no workouts have been completed yet
2. **localStorage Full** - Handle gracefully if localStorage quota is exceeded
3. **Corrupted Data** - If localStorage data is corrupted, reset to empty array without crashing
4. **Large History** - Consider pagination or virtual scrolling if history grows very large (future consideration)
5. **Concurrent Tabs** - History should be readable across tabs (storage event optional)

## Data Structure

### Workout History Entry

```javascript
{
  id: string,           // Unique ID (timestamp-based or UUID)
  date: string,         // ISO date string (e.g., "2025-01-15T10:30:00.000Z")
  workoutName: string,  // Name of the completed workout
  duration: number,     // Duration in seconds
  weekKey: string,      // Optional: Week identifier (e.g., "week_1")
  day: string          // Optional: Day identifier (e.g., "Monday")
}
```

### localStorage Key

```javascript
const HISTORY_STORAGE_KEY = 'workout_history';
```

## Implementation Notes

### DO
- Follow the hook pattern in `useVoicePreference.js` for localStorage management
- Use the modal pattern from Dashboard.jsx for the History view overlay
- Reuse existing Tailwind classes like `glass-card`, `btn`, `btn-primary`, `btn-danger`
- Use lucide-react icons consistently (already used throughout the app)
- Add PropTypes validation to all new components
- Hook into the existing `WorkoutCompleteScreen` component for saving history
- Use `formatTime` from `src/utils/linearizer.js` for duration display

### DON'T
- Create new CSS classes when Tailwind utilities or existing classes work
- Store sensitive data (there is none, but as a principle)
- Block the UI while saving to localStorage (it's synchronous but fast)
- Forget to handle the empty state in the history view
- Skip confirmation dialogs for destructive actions

## Development Environment

### Start Services

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

### Service URLs
- Main App: http://localhost:5173

### Required Environment Variables
- `TEST_ENV`: local
- `BASE_URL`: http://localhost:5173
- `FEATURE_FLAG_VOICE_COACH`: true
- `FEATURE_FLAG_WAKE_LOCK`: true

## Success Criteria

The task is complete when:

1. [ ] Settings button is replaced with a dropdown menu showing Settings and History options
2. [ ] Clicking Settings in dropdown opens the program selector (existing behavior preserved)
3. [ ] Clicking History in dropdown opens the History view with workout table
4. [ ] Completing a workout automatically saves it to history with date, name, and duration
5. [ ] History table displays entries sorted by date (newest first)
6. [ ] Individual workouts can be deleted with a confirmation dialog
7. [ ] "Clear All" button removes all history after confirmation
8. [ ] History persists across page refreshes
9. [ ] Empty state is displayed when no history exists
10. [ ] No console errors
11. [ ] Existing tests still pass
12. [ ] New functionality verified via browser

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests

| Test | File | What to Verify |
|------|------|----------------|
| useWorkoutHistory initialization | `tests/unit/hooks/useWorkoutHistory.test.js` | Hook initializes with empty array or existing data from localStorage |
| useWorkoutHistory addEntry | `tests/unit/hooks/useWorkoutHistory.test.js` | Adding entry updates state and localStorage |
| useWorkoutHistory deleteEntry | `tests/unit/hooks/useWorkoutHistory.test.js` | Deleting entry by ID removes it from state and localStorage |
| useWorkoutHistory clearAll | `tests/unit/hooks/useWorkoutHistory.test.js` | Clear all removes all entries |
| HistoryView renders empty state | `tests/unit/components/HistoryView.test.jsx` | Shows message when history is empty |
| HistoryView renders entries | `tests/unit/components/HistoryView.test.jsx` | Displays table with workout entries |
| HistoryView delete button | `tests/unit/components/HistoryView.test.jsx` | Delete button triggers confirmation and callback |
| ConfirmDialog confirmation | `tests/unit/components/ConfirmDialog.test.jsx` | Confirm and cancel buttons work correctly |

### Integration Tests

| Test | Services | What to Verify |
|------|----------|----------------|
| WorkoutPlayer saves history | WorkoutPlayer ↔ useWorkoutHistory | Completing workout adds entry to history |
| Dashboard menu opens History | Dashboard ↔ App | Menu selection navigates to History view |

### End-to-End Tests

| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Complete workout and view history | 1. Start workout 2. Complete it 3. Open History | Workout appears in history table |
| Delete single entry | 1. Open History 2. Click delete on entry 3. Confirm | Entry is removed from table |
| Clear all history | 1. Open History with entries 2. Click Clear All 3. Confirm | Table shows empty state |
| History persists | 1. Complete workout 2. Refresh page 3. Open History | Previous workout still visible |
| Cancel delete | 1. Click delete 2. Click Cancel | Entry remains in table |

### Browser Verification (if frontend)

| Page/Component | URL | Checks |
|----------------|-----|--------|
| Dashboard with menu | `http://localhost:5173` | Settings button shows dropdown on click |
| History View | `http://localhost:5173` (via menu) | Table displays, delete buttons work |
| Confirm Dialog | `http://localhost:5173` | Dialog appears for delete/clear actions |
| Empty History | `http://localhost:5173` | Shows friendly message when no history |

### Database Verification (if applicable)

| Check | Query/Command | Expected |
|-------|---------------|----------|
| localStorage key exists | `localStorage.getItem('workout_history')` | Returns JSON array or null |
| Entry format correct | Parse stored JSON | Each entry has id, date, workoutName, duration |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Browser verification complete
- [ ] localStorage state verified
- [ ] No regressions in existing functionality (Settings, Workout Player, voice toggle)
- [ ] Code follows established patterns (hooks, components, PropTypes)
- [ ] No security vulnerabilities introduced
- [ ] Confirmation dialogs appear for all destructive actions
- [ ] History persists across page refresh
