import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useWorkoutHistory from '../../../src/hooks/useWorkoutHistory';

const STORAGE_KEY = 'workout_history';

describe('useWorkoutHistory Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Mock Date.now for predictable IDs
        vi.spyOn(Date, 'now').mockReturnValue(1704067200000); // 2024-01-01 00:00:00
    });

    describe('Initialization', () => {
        it('should initialize with empty array if no localStorage', () => {
            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toEqual([]);
        });

        it('should load valid history from localStorage', () => {
            const savedHistory = [
                { id: 'test-1', date: '2024-01-01T10:00:00Z', workoutName: 'Morning Workout', duration: 1800 },
                { id: 'test-2', date: '2024-01-02T10:00:00Z', workoutName: 'Evening Workout', duration: 2400 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toEqual(savedHistory);
        });

        it('should reset to empty array if localStorage contains non-array data', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: 'data' }));

            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toEqual([]);
            expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
        });

        it('should reset to empty array if localStorage contains invalid JSON', () => {
            localStorage.setItem(STORAGE_KEY, 'not valid json');
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toEqual([]);
            expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
            expect(warnSpy).toHaveBeenCalled();

            warnSpy.mockRestore();
        });
    });

    describe('addWorkout', () => {
        it('should add a workout entry with correct structure', () => {
            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.addWorkout({
                    workoutName: 'Test Workout',
                    duration: 1800,
                });
            });

            expect(result.current.history).toHaveLength(1);
            const entry = result.current.history[0];
            expect(entry.workoutName).toBe('Test Workout');
            expect(entry.duration).toBe(1800);
            expect(entry.id).toBeDefined();
            expect(entry.date).toBeDefined();
        });

        it('should add new entries at the beginning (newest first)', () => {
            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.addWorkout({ workoutName: 'First Workout', duration: 1000 });
            });

            act(() => {
                result.current.addWorkout({ workoutName: 'Second Workout', duration: 2000 });
            });

            expect(result.current.history).toHaveLength(2);
            expect(result.current.history[0].workoutName).toBe('Second Workout');
            expect(result.current.history[1].workoutName).toBe('First Workout');
        });

        it('should use provided date if specified', () => {
            const { result } = renderHook(() => useWorkoutHistory());
            const customDate = '2024-06-15T14:30:00Z';

            act(() => {
                result.current.addWorkout({
                    workoutName: 'Custom Date Workout',
                    duration: 1500,
                    date: customDate,
                });
            });

            expect(result.current.history[0].date).toBe(customDate);
        });

        it('should include optional weekKey and day when provided', () => {
            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.addWorkout({
                    workoutName: 'Scheduled Workout',
                    duration: 1800,
                    weekKey: 'week-1',
                    day: 'day-1',
                });
            });

            const entry = result.current.history[0];
            expect(entry.weekKey).toBe('week-1');
            expect(entry.day).toBe('day-1');
        });

        it('should not include weekKey and day when not provided', () => {
            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.addWorkout({
                    workoutName: 'Basic Workout',
                    duration: 1200,
                });
            });

            const entry = result.current.history[0];
            expect(entry.weekKey).toBeUndefined();
            expect(entry.day).toBeUndefined();
        });

        it('should persist to localStorage when adding workout', () => {
            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.addWorkout({
                    workoutName: 'Persisted Workout',
                    duration: 900,
                });
            });

            const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(savedHistory).toHaveLength(1);
            expect(savedHistory[0].workoutName).toBe('Persisted Workout');
        });
    });

    describe('deleteWorkout', () => {
        it('should delete a workout entry by ID', () => {
            const savedHistory = [
                { id: 'entry-1', date: '2024-01-01T10:00:00Z', workoutName: 'Workout 1', duration: 1000 },
                { id: 'entry-2', date: '2024-01-02T10:00:00Z', workoutName: 'Workout 2', duration: 2000 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.deleteWorkout('entry-1');
            });

            expect(result.current.history).toHaveLength(1);
            expect(result.current.history[0].id).toBe('entry-2');
        });

        it('should persist to localStorage when deleting workout', () => {
            const savedHistory = [
                { id: 'entry-1', date: '2024-01-01T10:00:00Z', workoutName: 'Workout 1', duration: 1000 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.deleteWorkout('entry-1');
            });

            const persistedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(persistedHistory).toHaveLength(0);
        });

        it('should handle deleting non-existent ID gracefully', () => {
            const savedHistory = [
                { id: 'entry-1', date: '2024-01-01T10:00:00Z', workoutName: 'Workout 1', duration: 1000 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.deleteWorkout('non-existent-id');
            });

            expect(result.current.history).toHaveLength(1);
            expect(result.current.history[0].id).toBe('entry-1');
        });
    });

    describe('clearHistory', () => {
        it('should clear all workout history', () => {
            const savedHistory = [
                { id: 'entry-1', date: '2024-01-01T10:00:00Z', workoutName: 'Workout 1', duration: 1000 },
                { id: 'entry-2', date: '2024-01-02T10:00:00Z', workoutName: 'Workout 2', duration: 2000 },
                { id: 'entry-3', date: '2024-01-03T10:00:00Z', workoutName: 'Workout 3', duration: 3000 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toHaveLength(3);

            act(() => {
                result.current.clearHistory();
            });

            expect(result.current.history).toEqual([]);
        });

        it('should persist empty array to localStorage when clearing', () => {
            const savedHistory = [
                { id: 'entry-1', date: '2024-01-01T10:00:00Z', workoutName: 'Workout 1', duration: 1000 },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

            const { result } = renderHook(() => useWorkoutHistory());

            act(() => {
                result.current.clearHistory();
            });

            const persistedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(persistedHistory).toEqual([]);
        });

        it('should handle clearing already empty history', () => {
            const { result } = renderHook(() => useWorkoutHistory());
            expect(result.current.history).toEqual([]);

            act(() => {
                result.current.clearHistory();
            });

            expect(result.current.history).toEqual([]);
            expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
        });
    });
});
