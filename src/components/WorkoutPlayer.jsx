/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
    Play,
    Pause,
    SkipForward,
    RotateCcw,
    X,
    Volume2,
    VolumeX,
    Dumbbell,
    Coffee,
    Trophy,
    ChevronRight,
    Zap,
    Target,
} from "lucide-react";
import VoiceToggle from "./VoiceToggle";
import useVoicePreference from "../hooks/useVoicePreference";
import useWorkoutHistory from "../hooks/useWorkoutHistory";
import { linearizeWorkout, StepType, formatTime, calculateTotalDuration } from "../utils/linearizer";
import { audioManager } from "../utils/audioManager";
import speechService from "../services/speechService";
import wakeLockService from "../services/wakeLockService";
import { getExerciseImage } from "../assets/exercises";

// Progress Ring Component
function ProgressRing({ progress, size = 280, strokeWidth = 12 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    return (
        <svg className="progress-ring" width={size} height={size}>
            {/* Background circle */}
            <circle
                stroke="rgba(71, 85, 105, 0.3)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress circle */}
            <circle
                className="progress-ring-circle"
                stroke="url(#progressGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                }}
            />
            {/* Gradient definition */}
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// Exercise Visual Component - displays the exercise illustration
function ExerciseVisual({ exerciseId, exerciseName }) {
    const imageSrc = getExerciseImage(exerciseId);

    return (
        <div className="flex flex-col items-center justify-center">
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={exerciseName}
                    className="w-32 h-32 object-contain rounded-lg"
                    style={{ filter: 'invert(1) brightness(0.9)' }}
                />
            ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-slate-800/50 rounded-lg">
                    <Dumbbell className="w-12 h-12 text-slate-500" />
                </div>
            )}
        </div>
    );
}

// Block Start Screen Component
function BlockStartScreen({ step, onContinue }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="glass-card p-8 text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{step.blockName}</h2>
                <p className="text-slate-400 mb-4">
                    {step.rounds} round{step.rounds > 1 ? "s" : ""} • {step.drillCount} exercise
                    {step.drillCount > 1 ? "s" : ""}
                </p>
                <div className="text-sm text-slate-500 mb-6">
                    Block {step.blockIndex + 1} of {step.totalBlocks}
                </div>
                <button onClick={onContinue} className="btn btn-primary w-full">
                    <Play className="w-5 h-5" />
                    Start Block
                </button>
            </div>
        </div>
    );
}

// Workout Complete Screen Component
function WorkoutCompleteScreen({ workoutName, totalTime, onFinish }) {
    useEffect(() => {
        audioManager.playComplete();

        // Track workout completion for PWA installation guidance
        const currentCount = parseInt(localStorage.getItem('workout_completed_count') || '0', 10);
        localStorage.setItem('workout_completed_count', (currentCount + 1).toString());
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="glass-card p-8 text-center max-w-sm">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
                <p className="text-xl text-sky-400 mb-4">{workoutName}</p>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                    <div className="text-4xl font-bold text-white timer-display">
                        {formatTime(totalTime)}
                    </div>
                    <div className="text-sm text-slate-400">Total Time</div>
                </div>
                <p className="text-slate-400 mb-6">
                    💪 Great work! You're one step closer to the slopes.
                </p>
                <button onClick={onFinish} className="btn btn-accent w-full">
                    <Zap className="w-5 h-5" />
                    Done
                </button>
            </div>
        </div>
    );
}

// Main Workout Player Component
export default function WorkoutPlayer({ workout, onExit }) {
    // Linearize the workout into steps
    const steps = useMemo(() => linearizeWorkout(workout), [workout]);
    const totalDuration = useMemo(() => calculateTotalDuration(steps), [steps]);

    // State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTotal, setElapsedTotal] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const { isEnabled: voiceEnabled, toggle: toggleVoice, isSupported: voiceSupported } = useVoicePreference();
    const { addWorkout } = useWorkoutHistory();

    // Refs
    const timerRef = useRef(null);
    const workoutSavedRef = useRef(false);
    const lastTickRef = useRef(0);
    // Initialize lastTickRef on mount (impure to do in render)
    useEffect(() => {
        lastTickRef.current = Date.now();
    }, []);
    const isTransitioningRef = useRef(false);
    const stepDurationRef = useRef(0);

    // Current step
    const currentStep = steps[currentStepIndex];

    /**
     * Initialize hardware services on first user interaction
     * This is required by browsers to enable Audio and Wake Lock APIs
     */
    const initHardwareServices = useCallback(() => {
        audioManager.init();
        wakeLockService.init();
        speechService.init();
    }, []);

    // Move to next step - now stops timer first to prevent race conditions
    const goToNextStep = useCallback(() => {
        // Prevent multiple rapid transitions
        if (isTransitioningRef.current) return;

        if (currentStepIndex < steps.length - 1) {
            isTransitioningRef.current = true;

            // Stop the timer immediately
            setIsRunning(false);

            // Cancel any pending animation frame
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }

            // Move to next step
            setCurrentStepIndex((prev) => prev + 1);

            // If we are on a BLOCK_START step, the next step will be the actual workout.
            // This is a good time to acquire the wake lock as it's triggered by a user gesture.
            if (steps[currentStepIndex].type === StepType.BLOCK_START) {
                wakeLockService.acquire();
            }
        }
    }, [currentStepIndex, steps]);

    // Skip current step
    const skipStep = useCallback(() => {
        // Add remaining time to elapsed (use the actual step duration minus remaining)
        const stepDuration = stepDurationRef.current || 0;
        const timeSpent = stepDuration - timeRemaining;
        if (timeSpent > 0) {
            setElapsedTotal((prev) => prev + timeSpent);
        }
        goToNextStep();
    }, [timeRemaining, goToNextStep]);

    // Restart workout
    const restartWorkout = useCallback(() => {
        isTransitioningRef.current = false;
        workoutSavedRef.current = false;
        if (timerRef.current) {
            cancelAnimationFrame(timerRef.current);
            timerRef.current = null;
        }
        setCurrentStepIndex(0);
        setTimeRemaining(0);
        setIsRunning(false);
        setIsPaused(false);
        setElapsedTotal(0);
    }, []);

    // Toggle pause
    const togglePause = useCallback(() => {
        if (isPaused) {
            lastTickRef.current = Date.now();
        }
        setIsPaused((prev) => !prev);
    }, [isPaused]);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        const newState = audioManager.toggle();
        setAudioEnabled(newState);
    }, []);

    // Handle step initialization
    useEffect(() => {
        if (!currentStep) return;

        // Reset transitioning flag when step changes
        isTransitioningRef.current = false;

        // Handle different step types
        switch (currentStep.type) {
            case StepType.WORK:
                stepDurationRef.current = currentStep.duration;
                setTimeRemaining(currentStep.duration);
                setIsRunning(true);
                setIsPaused(false);
                if (audioEnabled) audioManager.playWorkStart();
                break;

            case StepType.REST:
                stepDurationRef.current = currentStep.duration;
                setTimeRemaining(currentStep.duration);
                setIsRunning(true);
                setIsPaused(false);
                if (audioEnabled) audioManager.playRestStart();
                break;

            case StepType.BLOCK_REST:
                stepDurationRef.current = currentStep.duration;
                setTimeRemaining(currentStep.duration);
                setIsRunning(true);
                setIsPaused(false);
                if (audioEnabled) audioManager.playRestStart();
                break;

            case StepType.BLOCK_START:
                stepDurationRef.current = 0;
                setIsRunning(false);
                setIsPaused(false);
                break;

            case StepType.WORKOUT_COMPLETE:
                stepDurationRef.current = 0;
                setIsRunning(false);
                setIsPaused(false);
                wakeLockService.release();
                break;

            default:
                break;
        }

        lastTickRef.current = Date.now();
    }, [currentStepIndex, audioEnabled]); // Use currentStepIndex instead of currentStep to ensure fresh data

    // Handle speech announcements
    useEffect(() => {
        if (!currentStep) return;

        // Only announce on WORK steps, if audio is enabled (mute check) and voice is enabled/supported
        if (
            currentStep.type === StepType.WORK &&
            audioEnabled &&
            voiceEnabled &&
            voiceSupported
        ) {
            const text = `${currentStep.exerciseName}. ${currentStep.instruction}`;
            speechService.speak(text);
        }
    }, [currentStep, audioEnabled, voiceEnabled, voiceSupported]);

    // Timer effect
    useEffect(() => {
        if (!isRunning || isPaused) {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        let isActive = true;

        const tick = () => {
            if (!isActive || isTransitioningRef.current) return;

            const now = Date.now();
            const delta = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            setTimeRemaining((prev) => {
                // Don't process if we're transitioning
                if (isTransitioningRef.current) return prev;

                const newTime = prev - delta;

                // Play countdown beeps at 3, 2, 1 seconds
                if (audioEnabled && Math.ceil(newTime) !== Math.ceil(prev) && Math.ceil(newTime) <= 3 && Math.ceil(newTime) > 0) {
                    audioManager.playCountdownBeep();
                }

                if (newTime <= 0) {
                    // Step complete - add the full step duration to elapsed
                    const duration = stepDurationRef.current;
                    setElapsedTotal((prevElapsed) => prevElapsed + duration);

                    // Trigger transition (will be handled on next render)
                    setTimeout(() => {
                        if (isActive) {
                            goToNextStep();
                        }
                    }, 0);

                    return 0;
                }

                return newTime;
            });

            if (isActive && !isTransitioningRef.current) {
                timerRef.current = requestAnimationFrame(tick);
            }
        };

        timerRef.current = requestAnimationFrame(tick);

        return () => {
            isActive = false;
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isRunning, isPaused, audioEnabled, goToNextStep]);

    // Ensure wake lock is released when the player unmounts
    useEffect(() => {
        return () => {
            wakeLockService.release();
        };
    }, []);

    // Save workout to history when complete
    useEffect(() => {
        if (currentStep?.type === StepType.WORKOUT_COMPLETE && !workoutSavedRef.current) {
            workoutSavedRef.current = true;
            addWorkout({
                workoutName: workout.name,
                duration: Math.round(elapsedTotal),
                ...(workout.weekKey && { weekKey: workout.weekKey }),
                ...(workout.day && { day: workout.day }),
            });
        }
    }, [currentStep?.type, workout.name, workout.weekKey, workout.day, elapsedTotal, addWorkout]);

    // Render based on step type
    if (!currentStep) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-slate-400">No workout data available.</p>
            </div>
        );
    }

    // Block start screen
    if (currentStep.type === StepType.BLOCK_START) {
        return (
            <div className="min-h-screen flex flex-col p-4 safe-top safe-bottom" onClick={initHardwareServices}>
                {/* Header */}
                <header className="flex items-center justify-between mb-4">
                    <button onClick={onExit} className="btn btn-secondary btn-icon w-12 h-12" aria-label="Exit workout">
                        <X className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold text-white">{workout.name}</h1>
                    <button onClick={toggleAudio} className="btn btn-secondary btn-icon w-12 h-12" title="Sound FX">
                        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </header>

                <BlockStartScreen step={currentStep} onContinue={goToNextStep} />
            </div>
        );
    }

    // Workout complete screen
    if (currentStep.type === StepType.WORKOUT_COMPLETE) {
        return (
            <div className="min-h-screen flex flex-col p-4 safe-top safe-bottom">
                <WorkoutCompleteScreen
                    workoutName={currentStep.workoutName}
                    totalTime={elapsedTotal}
                    onFinish={onExit}
                />
            </div>
        );
    }

    // Work or Rest step (BLOCK_REST is treated as a rest variant for UI purposes)
    const isWorkStep = currentStep.type === StepType.WORK;
    const isBlockRest = currentStep.type === StepType.BLOCK_REST;
    const progress = currentStep.duration > 0 ? 1 - timeRemaining / currentStep.duration : 0;

    return (
        <div
            className={`min-h-screen flex flex-col p-4 safe-top safe-bottom transition-colors duration-500 ${isWorkStep ? "bg-gradient-to-b from-slate-900 to-sky-950" : "bg-gradient-to-b from-slate-900 to-emerald-950"
                }`}
            onClick={initHardwareServices}
        >
            {/* Header */}
            <header className="flex items-center justify-between mb-2">
                <button onClick={onExit} className="btn btn-secondary btn-icon w-12 h-12" aria-label="Exit workout">
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-medium text-slate-400">{currentStep.blockName}</h1>
                    {currentStep.round && currentStep.totalRounds && (
                        <p className="text-xs text-slate-500">
                            Round {currentStep.round}/{currentStep.totalRounds}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={toggleAudio} className={`btn btn-secondary btn-icon w-12 h-12 ${!audioEnabled ? 'opacity-50' : ''}`} title="Sound FX" aria-label="Toggle audio">
                        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <VoiceToggle
                        isEnabled={voiceEnabled}
                        onToggle={toggleVoice}
                        isSupported={voiceSupported}
                        className="btn btn-secondary btn-icon w-12 h-12"
                    />
                </div>
            </header>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Step type indicator */}
                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isWorkStep
                        ? "bg-sky-500/20 text-sky-400"
                        : "bg-emerald-500/20 text-emerald-400"
                        }`}
                >
                    {isWorkStep ? (
                        <>
                            <Dumbbell className="w-4 h-4" />
                            <span className="font-semibold uppercase text-sm tracking-wider">Work</span>
                        </>
                    ) : (
                        <>
                            <Coffee className="w-4 h-4" />
                            <span className="font-semibold uppercase text-sm tracking-wider">{isBlockRest ? "Block Rest" : "Rest"}</span>
                        </>
                    )}
                </div>

                {/* Timer ring */}
                <div className="relative mb-4">
                    <ProgressRing progress={progress} size={260} strokeWidth={10} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {isWorkStep ? (
                            <ExerciseVisual
                                exerciseId={currentStep.exerciseId}
                                exerciseName={currentStep.exerciseName}
                            />
                        ) : (
                            <div className="text-4xl">😮‍💨</div>
                        )}
                    </div>
                </div>

                {/* Timer display */}
                <div
                    className={`text-7xl font-bold timer-display mb-2 ${timeRemaining <= 3 ? "text-red-400 animate-countdown" : "text-white"
                        }`}
                >
                    {Math.ceil(timeRemaining)}
                </div>

                {/* Exercise name & instruction */}
                {isWorkStep ? (
                    <div className="text-center px-4 max-w-sm">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {currentStep.exerciseName}
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            {currentStep.instruction}
                        </p>
                    </div>
                ) : (
                    <div className="text-center px-4 max-w-sm">
                        <h2 className="text-xl font-semibold text-white mb-2">{isBlockRest ? "Block Rest" : "Rest"}</h2>
                        {isBlockRest && currentStep.blockName && (
                            <p className="text-slate-500 text-sm mb-2">{currentStep.blockName} complete</p>
                        )}
                        {currentStep.nextExercise && (
                            <p className="text-slate-400 flex items-center justify-center gap-2">
                                <span>Next:</span>
                                <span className="text-sky-400 font-medium">{currentStep.nextExercise}</span>
                                <ChevronRight className="w-4 h-4 text-sky-400" />
                            </p>
                        )}
                    </div>
                )}

                {/* Drill progress indicator */}
                {isWorkStep && (
                    <div className="flex gap-1.5 mt-4">
                        {Array.from({ length: currentStep.totalDrills }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx < currentStep.drillIndex
                                    ? "bg-sky-400"
                                    : idx === currentStep.drillIndex
                                        ? "bg-white"
                                        : "bg-slate-600"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
                {/* Restart */}
                <button
                    onClick={restartWorkout}
                    className="btn btn-secondary btn-icon"
                    aria-label="Restart workout"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                {/* Play/Pause */}
                <button
                    onClick={togglePause}
                    className={`btn btn-icon w-20 h-20 ${isPaused ? "btn-primary" : "btn-secondary"
                        }`}
                    aria-label={isPaused ? "Resume" : "Pause"}
                >
                    {isPaused ? (
                        <Play className="w-8 h-8 ml-1" />
                    ) : (
                        <Pause className="w-8 h-8" />
                    )}
                </button>

                {/* Skip */}
                <button
                    onClick={skipStep}
                    className="btn btn-secondary btn-icon"
                    aria-label="Skip step"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

            {/* Total elapsed time */}
            <div className="text-center mt-4 text-sm text-slate-500">
                Elapsed: {formatTime(Math.round(elapsedTotal))} / ~{formatTime(totalDuration)}
            </div>
        </div>
    );
}
