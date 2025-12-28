import { useState } from "react";
import Dashboard from "./components/Dashboard";
import WorkoutPlayer from "./components/WorkoutPlayer";
import InstallPrompt from "./components/InstallPrompt";
import { usePWAInstall } from "./hooks/usePWAInstall";
import { audioManager } from "./utils/audioManager";
import speechService from "./services/speechService";
import wakeLockService from "./services/wakeLockService";
import "./index.css";

// App States
const AppState = {
  DASHBOARD: "dashboard",
  WORKOUT: "workout",
};

function App() {
  const [appState, setAppState] = useState(AppState.DASHBOARD);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const {
    deferredPrompt,
    isStandalone,
    isIOS,
    isDismissed,
    shouldShowPrompt,
    handleInstall,
    dismissPrompt
  } = usePWAInstall();

  const handleStartWorkout = (weekKey, day, workout) => {
    // Initialize hardware services on user gesture (Start button click)
    audioManager.init();
    wakeLockService.init();
    speechService.init();

    setCurrentWorkout({ weekKey, day, workout });
    setAppState(AppState.WORKOUT);
  };

  const handleExitWorkout = () => {
    setAppState(AppState.DASHBOARD);
    setCurrentWorkout(null);
  };

  return (
    <main className="max-w-lg mx-auto">
      {appState === AppState.DASHBOARD && (
        <>
          <Dashboard onStartWorkout={handleStartWorkout} />
          <InstallPrompt
            deferredPrompt={deferredPrompt}
            isIOS={isIOS}
            isStandalone={isStandalone}
            isDismissed={isDismissed}
            onInstall={handleInstall}
            onDismiss={dismissPrompt}
            shouldShowPrompt={shouldShowPrompt}
          />
        </>
      )}

      {appState === AppState.WORKOUT && currentWorkout && (
        <WorkoutPlayer
          workout={currentWorkout.workout}
          onExit={handleExitWorkout}
        />
      )}
    </main>
  );
}

export default App;
