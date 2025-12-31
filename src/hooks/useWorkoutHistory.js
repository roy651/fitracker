import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'workout_history';

/**
 * Custom hook to manage workout history with localStorage persistence.
 * Handles saving, loading, deleting, and clearing workout history entries.
 * @returns {Object} { history, addWorkout, deleteWorkout, clearHistory }
 */
export default function useWorkoutHistory() {
    const [history, setHistory] = useState([]);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                } else {
                    // Corrupted data - reset to empty array
                    setHistory([]);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
                }
            } catch (e) {
                console.warn('Failed to parse workout history', e);
                // Reset corrupted data
                setHistory([]);
                localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            }
        }
    }, []);

    /**
     * Save history to localStorage
     * @param {Array} newHistory - The updated history array to persist
     */
    const persistHistory = useCallback((newHistory) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        } catch (e) {
            // Handle localStorage quota exceeded
            console.warn('Failed to save workout history to localStorage', e);
        }
    }, []);

    /**
     * Add a new workout entry to history
     * @param {Object} workout - The workout to add
     * @param {string} workout.workoutName - Name of the completed workout
     * @param {number} workout.duration - Duration in seconds
     * @param {string} [workout.date] - ISO date string (defaults to now)
     * @param {string} [workout.weekKey] - Week identifier
     * @param {string} [workout.day] - Day identifier
     */
    const addWorkout = useCallback((workout) => {
        const entry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: workout.date || new Date().toISOString(),
            workoutName: workout.workoutName,
            duration: workout.duration,
            ...(workout.weekKey && { weekKey: workout.weekKey }),
            ...(workout.day && { day: workout.day }),
        };

        setHistory((prevHistory) => {
            // Add new entry at the beginning (newest first)
            const newHistory = [entry, ...prevHistory];
            persistHistory(newHistory);
            return newHistory;
        });
    }, [persistHistory]);

    /**
     * Delete a workout entry by ID
     * @param {string} id - The ID of the workout entry to delete
     */
    const deleteWorkout = useCallback((id) => {
        setHistory((prevHistory) => {
            const newHistory = prevHistory.filter((entry) => entry.id !== id);
            persistHistory(newHistory);
            return newHistory;
        });
    }, [persistHistory]);

    /**
     * Clear all workout history
     */
    const clearHistory = useCallback(() => {
        setHistory([]);
        persistHistory([]);
    }, [persistHistory]);

    return {
        history,
        addWorkout,
        deleteWorkout,
        clearHistory,
    };
}
