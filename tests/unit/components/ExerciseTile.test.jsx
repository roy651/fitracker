import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseTile from '../../../src/components/ExerciseTile';
import * as exerciseAssets from '../../../src/assets/exercises';

// Mock the getExerciseImage function
vi.mock('../../../src/assets/exercises', () => ({
    getExerciseImage: vi.fn(),
}));

describe('ExerciseTile', () => {
    const mockOnClick = vi.fn();

    const defaultProps = {
        exerciseId: 'goblet_sq_tempo',
        exerciseName: 'Goblet Squat (Tempo)',
        onClick: mockOnClick,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders exercise name', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');
        render(<ExerciseTile {...defaultProps} />);

        expect(screen.getByText('Goblet Squat (Tempo)')).toBeInTheDocument();
    });

    it('renders with image when exercise image exists', () => {
        const mockImageSrc = '/path/to/goblet_sq.png';
        exerciseAssets.getExerciseImage.mockReturnValue(mockImageSrc);

        render(<ExerciseTile {...defaultProps} />);

        const image = screen.getByAltText('Goblet Squat (Tempo)');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockImageSrc);
        expect(image).toHaveClass('w-24', 'h-24', 'object-contain', 'rounded-lg');
    });

    it('applies correct filter style to image', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const image = screen.getByAltText('Goblet Squat (Tempo)');
        expect(image).toHaveStyle({ filter: 'invert(1) brightness(0.9)' });
    });

    it('renders fallback Dumbbell icon when image does not exist', () => {
        exerciseAssets.getExerciseImage.mockReturnValue(null);

        const { container } = render(<ExerciseTile {...defaultProps} />);

        // Check that image is not rendered
        const image = screen.queryByAltText('Goblet Squat (Tempo)');
        expect(image).not.toBeInTheDocument();

        // Check that fallback div with Dumbbell icon is rendered
        const fallbackContainer = container.querySelector('.bg-slate-800\\/50');
        expect(fallbackContainer).toBeInTheDocument();
        expect(fallbackContainer).toHaveClass('w-24', 'h-24', 'flex', 'items-center', 'justify-center', 'rounded-lg');

        // Check for Dumbbell icon (lucide-react renders as svg)
        const dumbbellIcon = container.querySelector('svg');
        expect(dumbbellIcon).toBeInTheDocument();
    });

    it('calls onClick when tile is clicked', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const button = screen.getByRole('button', { name: /view goblet squat \(tempo\)/i });
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('renders with correct aria-label', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const button = screen.getByRole('button', { name: 'View Goblet Squat (Tempo)' });
        expect(button).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(
            <ExerciseTile
                {...defaultProps}
                className="custom-class"
            />
        );

        const button = screen.getByRole('button', { name: /view goblet squat \(tempo\)/i });
        expect(button).toHaveClass('custom-class');
    });

    it('uses empty string as default className when not provided', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const button = screen.getByRole('button', { name: /view goblet squat \(tempo\)/i });
        // Should have base classes but no custom class
        expect(button).toHaveClass('glass-card', 'p-4');
    });

    it('has correct button styling classes', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const button = screen.getByRole('button', { name: /view goblet squat \(tempo\)/i });
        expect(button).toHaveClass(
            'glass-card',
            'p-4',
            'transition-all',
            'duration-200'
        );
    });

    it('calls getExerciseImage with correct exerciseId', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        expect(exerciseAssets.getExerciseImage).toHaveBeenCalledWith('goblet_sq_tempo');
        expect(exerciseAssets.getExerciseImage).toHaveBeenCalledTimes(1);
    });

    it('renders exercise name with correct styling', () => {
        exerciseAssets.getExerciseImage.mockReturnValue('/path/to/image.png');

        render(<ExerciseTile {...defaultProps} />);

        const name = screen.getByText('Goblet Squat (Tempo)');
        expect(name).toHaveClass('text-sm', 'font-medium', 'text-slate-200', 'text-center', 'line-clamp-2');
    });
});
