import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutPreview from '../../../src/components/WorkoutPreview';
import { getExercise } from '../../../src/data/workoutDatabase';

// Mocks
vi.mock('../../../src/data/workoutDatabase', () => ({
    getExercise: vi.fn(),
}));

vi.mock('../../../src/components/ExerciseTile', () => ({
    default: ({ exerciseId, exerciseName, onClick }) => (
        <button
            data-testid={`exercise-tile-${exerciseId}`}
            onClick={onClick}
            aria-label={`View ${exerciseName}`}
        >
            {exerciseName}
        </button>
    ),
}));

vi.mock('../../../src/components/ExerciseDetailModal', () => ({
    default: ({ isOpen, exerciseName, exerciseDescription, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="exercise-modal">
                <h2>{exerciseName}</h2>
                <p>{exerciseDescription}</p>
                <button onClick={onClose} aria-label="Close">Close</button>
            </div>
        );
    },
}));

describe('WorkoutPreview', () => {
    const mockOnBack = vi.fn();
    const mockOnStart = vi.fn();

    const mockWorkout = {
        name: 'Test Workout',
        blocks: [
            {
                name: 'Block 1',
                rounds: 3,
                drills: ['drill-1', 'drill-2'],
            },
            {
                name: 'Block 2',
                rounds: 2,
                drills: ['drill-3'],
            },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock getExercise to return exercise data
        getExercise.mockImplementation((id) => ({
            id,
            name: `Exercise ${id}`,
            instruction: `Instructions for ${id}`,
        }));
    });

    it('renders workout name', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('Test Workout')).toBeInTheDocument();
    });

    it('renders helper text', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('Tap an exercise to see details')).toBeInTheDocument();
    });

    it('renders all blocks with correct names', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('Block 1')).toBeInTheDocument();
        expect(screen.getByText('Block 2')).toBeInTheDocument();
    });

    it('displays correct rounds and exercise count for each block', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('3x 2 exercises')).toBeInTheDocument();
        expect(screen.getByText('2x 1 exercises')).toBeInTheDocument();
    });

    it('renders ExerciseTile components for all drills', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByTestId('exercise-tile-drill-1')).toBeInTheDocument();
        expect(screen.getByTestId('exercise-tile-drill-2')).toBeInTheDocument();
        expect(screen.getByTestId('exercise-tile-drill-3')).toBeInTheDocument();
    });

    it('calls getExercise for each drill', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(getExercise).toHaveBeenCalledWith('drill-1');
        expect(getExercise).toHaveBeenCalledWith('drill-2');
        expect(getExercise).toHaveBeenCalledWith('drill-3');
    });

    it('displays "Unknown Exercise" when getExercise returns null', () => {
        getExercise.mockReturnValue(null);

        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const tiles = screen.getAllByText('Unknown Exercise');
        expect(tiles.length).toBeGreaterThan(0);
    });

    it('opens ExerciseDetailModal when tile is clicked', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const tile = screen.getByTestId('exercise-tile-drill-1');
        fireEvent.click(tile);

        expect(screen.getByTestId('exercise-modal')).toBeInTheDocument();
        expect(screen.getByText('Exercise drill-1')).toBeInTheDocument();
        expect(screen.getByText('Instructions for drill-1')).toBeInTheDocument();
    });

    it('does not open modal when clicking tile for exercise that does not exist', () => {
        getExercise.mockReturnValue(null);

        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const tile = screen.getByTestId('exercise-tile-drill-1');
        fireEvent.click(tile);

        expect(screen.queryByTestId('exercise-modal')).not.toBeInTheDocument();
    });

    it('closes ExerciseDetailModal when close is clicked', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        // Open modal
        const tile = screen.getByTestId('exercise-tile-drill-1');
        fireEvent.click(tile);

        expect(screen.getByTestId('exercise-modal')).toBeInTheDocument();

        // Close modal
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('exercise-modal')).not.toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const backButton = screen.getByRole('button', { name: /back to dashboard/i });
        fireEvent.click(backButton);

        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('calls onStart when Start Workout button is clicked', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const startButton = screen.getByRole('button', { name: /start workout/i });
        fireEvent.click(startButton);

        expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('renders empty state when workout has no blocks', () => {
        const emptyWorkout = {
            name: 'Empty Workout',
            blocks: [],
        };

        render(<WorkoutPreview workout={emptyWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('No exercises found')).toBeInTheDocument();
        expect(screen.getByText("This workout doesn't have any exercises yet.")).toBeInTheDocument();
    });

    it('renders empty state when workout blocks is undefined', () => {
        const emptyWorkout = {
            name: 'Empty Workout',
        };

        render(<WorkoutPreview workout={emptyWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.getByText('No exercises found')).toBeInTheDocument();
    });

    it('renders Start Workout button even when workout is empty', () => {
        const emptyWorkout = {
            name: 'Empty Workout',
            blocks: [],
        };

        render(<WorkoutPreview workout={emptyWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        const startButton = screen.getByRole('button', { name: /start workout/i });
        expect(startButton).toBeInTheDocument();
    });

    it('modal starts closed by default', () => {
        render(<WorkoutPreview workout={mockWorkout} onBack={mockOnBack} onStart={mockOnStart} />);

        expect(screen.queryByTestId('exercise-modal')).not.toBeInTheDocument();
    });
});
