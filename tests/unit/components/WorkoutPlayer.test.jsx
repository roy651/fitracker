import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import WorkoutPlayer from '../../../src/components/WorkoutPlayer';
import speechService from '../../../src/services/speechService';
import { audioManager } from '../../../src/utils/audioManager';
import useVoicePreference from '../../../src/hooks/useVoicePreference';
import { getExercise } from '../../../src/data/workoutDatabase';
import wakeLockService from '../../../src/services/wakeLockService';


// Mocks
vi.mock('../../../src/data/workoutDatabase', () => ({
    getExercise: vi.fn(),
}));

vi.mock('../../../src/services/speechService', () => ({
    default: {
        init: vi.fn(),
        speak: vi.fn(),
        cancel: vi.fn(),
    }
}));

vi.mock('../../../src/utils/audioManager', () => ({
    audioManager: {
        init: vi.fn(),
        toggle: vi.fn(),
        playWorkStart: vi.fn(),
        playRestStart: vi.fn(),
        playCountdownBeep: vi.fn(),
        playComplete: vi.fn(),
    }
}));

vi.mock('../../../src/hooks/useVoicePreference', () => ({
    default: vi.fn()
}));

vi.mock('../../../src/services/wakeLockService', () => ({
    default: {
        init: vi.fn(),
        acquire: vi.fn(),
        release: vi.fn(),
        isSupported: true
    }
}));


// Mock window.scrollTo since it might be used
window.scrollTo = vi.fn();

describe('WorkoutPlayer Integration', () => {
    const mockWorkout = {
        name: 'Test Workout',
        blocks: [
            {
                name: 'Block 1',
                rounds: 1,
                work_sec: 10,
                rest_sec: 5,
                drills: ['drill-1']
            }
        ]
    };

    let originalRAF, originalCAF;

    beforeEach(() => {
        vi.clearAllMocks();
        // Default hook mock
        useVoicePreference.mockReturnValue({
            isEnabled: true,
            isSupported: true,
            toggle: vi.fn(),
        });

        // Mock getExercise
        getExercise.mockReturnValue({
            id: 'drill-1',
            name: 'Drill 1',
            instruction: 'Do drill 1',
            visual_ref: null
        });

        // Manual mock for RAF
        originalRAF = window.requestAnimationFrame;
        originalCAF = window.cancelAnimationFrame;

        window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
        window.cancelAnimationFrame = (id) => clearTimeout(id);

        // Mock Date.now to control time flow? 
        // We can just rely on real time being > 0. The test just checks that switching steps triggers speech.
        // Step switch happens on logic, but wait. WorkoutPlayer relies on timer ending to switch steps AUTOMATICALLY.
        // BUT here we are testing "Should speak ... when drill starts".
        // When we click "Start Block", it MANUALLY triggers `goToNextStep`.
        // `goToNextStep` sets index + 1.
        // This causes re-render.
        // `useEffect` runs.
        // Speech is triggered.
        // We do NOT need to wait for the timer to count down.
        // So we don't need complex time manipulation for these tests.
    });

    afterEach(() => {
        vi.restoreAllMocks();
        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;
    });

    it('should speak exercise name and instruction when drill starts and voice enabled', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        // Should be on Block Start screen
        const startButton = screen.getByText('Start Block');
        act(() => {
            startButton.click();
        });

        // Effect runs after render.
        // We might need a small delay or just expect immediately if act flushes effects.
        setTimeout(() => {
            expect(speechService.speak).toHaveBeenCalledWith('Drill 1. Do drill 1');
            done();
        }, 0);
    }));

    it('should NOT speak if voice preference is disabled', () => new Promise(done => {
        useVoicePreference.mockReturnValue({
            isEnabled: false,
            isSupported: true,
            toggle: vi.fn(),
        });

        render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        const startButton = screen.getByText('Start Block');
        act(() => {
            startButton.click();
        });

        setTimeout(() => {
            expect(speechService.speak).not.toHaveBeenCalled();
            done();
        }, 0);
    }));

    it('should NOT speak if global audio is muted', () => new Promise(done => {
        useVoicePreference.mockReturnValue({
            isEnabled: true,
            isSupported: true,
            toggle: vi.fn(),
        });

        audioManager.toggle.mockReturnValue(false); // Return muted state

        render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        // Click mute button (title="Sound FX")
        const muteButton = screen.getByTitle('Sound FX');
        act(() => {
            muteButton.click();
        });

        const startButton = screen.getByText('Start Block');
        act(() => {
            startButton.click();
        });

        setTimeout(() => {
            expect(speechService.speak).not.toHaveBeenCalled();
            done();
        }, 0);
    }));
});

describe('WorkoutPlayer Block Rest UI', () => {
    // Workout with block_rest: Two blocks, first has block_rest = 30
    const mockWorkoutWithBlockRest = {
        name: 'Block Rest Workout',
        blocks: [
            {
                name: 'Block 1',
                rounds: 1,
                work_sec: 10,
                rest_sec: 5,
                drills: ['drill-1'],
                block_rest: 30
            },
            {
                name: 'Block 2',
                rounds: 1,
                work_sec: 10,
                rest_sec: 5,
                drills: ['drill-2']
            }
        ]
    };

    let originalRAF, originalCAF;

    beforeEach(() => {
        vi.clearAllMocks();
        useVoicePreference.mockReturnValue({
            isEnabled: true,
            isSupported: true,
            toggle: vi.fn(),
        });

        getExercise.mockImplementation((id) => ({
            id,
            name: id === 'drill-1' ? 'Drill 1' : 'Drill 2',
            instruction: 'Do drill',
            visual_ref: null
        }));

        originalRAF = window.requestAnimationFrame;
        originalCAF = window.cancelAnimationFrame;

        window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
        window.cancelAnimationFrame = (id) => clearTimeout(id);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;
    });

    it('should render "Block Rest" label during BLOCK_REST step', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkoutWithBlockRest} onExit={vi.fn()} />);

        // Navigate through: Block1 Start -> Work -> BLOCK_REST
        // Step 0: BLOCK_START (Block 1)
        const startButton = screen.getByText('Start Block');
        act(() => { startButton.click(); });

        // Now on Step 1: WORK (drill-1)
        // We need to skip to get to BLOCK_REST
        setTimeout(() => {
            const skipButton = screen.getByLabelText('Skip step');
            act(() => { skipButton.click(); });

            // Now on Step 2: BLOCK_REST (should be)
            setTimeout(() => {
                // Look for "Block Rest" text - it appears in both the indicator and heading
                const blockRestElements = screen.getAllByText('Block Rest');
                expect(blockRestElements.length).toBeGreaterThan(0);
                done();
            }, 50);
        }, 50);
    }));

    it('should play rest start audio when entering BLOCK_REST step', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkoutWithBlockRest} onExit={vi.fn()} />);

        // Navigate to BLOCK_REST
        const startButton = screen.getByText('Start Block');
        act(() => { startButton.click(); });

        // Clear mocks from WORK step
        vi.clearAllMocks();

        setTimeout(() => {
            const skipButton = screen.getByLabelText('Skip step');
            act(() => { skipButton.click(); });

            setTimeout(() => {
                expect(audioManager.playRestStart).toHaveBeenCalled();
                done();
            }, 50);
        }, 50);
    }));

    it('should display block context during BLOCK_REST', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkoutWithBlockRest} onExit={vi.fn()} />);

        const startButton = screen.getByText('Start Block');
        act(() => { startButton.click(); });

        setTimeout(() => {
            const skipButton = screen.getByLabelText('Skip step');
            act(() => { skipButton.click(); });

            setTimeout(() => {
                // Should show block name context - look for the specific "complete" context
                expect(screen.getByText('Block 1 complete')).toBeTruthy();
                done();
            }, 50);
        }, 50);
    }));

    it('should allow skip during BLOCK_REST step', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkoutWithBlockRest} onExit={vi.fn()} />);

        const startButton = screen.getByText('Start Block');
        act(() => { startButton.click(); });

        setTimeout(() => {
            // Skip WORK step
            const skipButton = screen.getByLabelText('Skip step');
            act(() => { skipButton.click(); });

            setTimeout(() => {
                // Now on BLOCK_REST, skip again to go to Block 2 Start
                act(() => { skipButton.click(); });

                setTimeout(() => {
                    // Should be on Block 2 Start screen
                    expect(screen.getByText('Block 2')).toBeTruthy();
                    done();
                }, 50);
            }, 50);
        }, 50);
    }));

    it('should render "Next:" preview with exercise name during BLOCK_REST', () => new Promise(done => {
        render(<WorkoutPlayer workout={mockWorkoutWithBlockRest} onExit={vi.fn()} />);

        const startButton = screen.getByText('Start Block');
        act(() => { startButton.click(); });

        setTimeout(() => {
            const skipButton = screen.getByLabelText('Skip step');
            act(() => { skipButton.click(); });

            setTimeout(() => {
                // Should show "Next:" label and the exercise name from next block
                expect(screen.getByText('Next:')).toBeTruthy();
                // "Drill 2" is the name returned by getExercise mock for drill-2
                expect(screen.getByText('Drill 2')).toBeTruthy();
                done();
            }, 50);
        }, 50);
    }));
});

describe('WorkoutPlayer Hardware Integration', () => {
    const mockWorkout = {
        name: 'HW Test Workout',
        blocks: [
            {
                name: 'Block 1',
                rounds: 1,
                work_sec: 10,
                rest_sec: 5,
                drills: ['drill-1']
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Since useVoicePreference is a default export, verify how it's mocked
        useVoicePreference.mockReturnValue({
            isEnabled: true,
            isSupported: true,
            toggle: vi.fn(),
        });
        getExercise.mockReturnValue({
            id: 'drill-1',
            name: 'Drill 1',
            instruction: 'Do drill',
            visual_ref: null
        });
    });

    it('should call wakeLockService.init on user interaction', () => {
        render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        // Root element click triggers initAudio (which should now call wakeLockService.init)
        const rootElement = screen.getByText('HW Test Workout').closest('div');
        act(() => {
            rootElement.click();
        });

        expect(wakeLockService.init).toHaveBeenCalled();
    });

    it('should call wakeLockService.acquire when starting a block', () => {
        render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        const startButton = screen.getByText('Start Block');
        act(() => {
            startButton.click();
        });

        expect(wakeLockService.acquire).toHaveBeenCalled();
    });

    it('should call wakeLockService.release on unmount', () => {
        const { unmount } = render(<WorkoutPlayer workout={mockWorkout} onExit={vi.fn()} />);

        unmount();

        expect(wakeLockService.release).toHaveBeenCalled();
    });
});

