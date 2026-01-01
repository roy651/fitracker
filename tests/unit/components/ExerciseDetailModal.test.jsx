import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseDetailModal from '../../../src/components/ExerciseDetailModal';

describe('ExerciseDetailModal', () => {
    const mockOnClose = vi.fn();

    const defaultProps = {
        isOpen: true,
        exerciseName: 'Bench Press',
        exerciseDescription: 'A compound upper body exercise that targets chest, shoulders, and triceps.',
        onClose: mockOnClose,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when isOpen is false', () => {
        const { container } = render(
            <ExerciseDetailModal
                {...defaultProps}
                isOpen={false}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders exercise name when open', () => {
        render(<ExerciseDetailModal {...defaultProps} />);

        expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    it('renders exercise description when provided', () => {
        render(<ExerciseDetailModal {...defaultProps} />);

        expect(screen.getByText('A compound upper body exercise that targets chest, shoulders, and triceps.')).toBeInTheDocument();
    });

    it('renders "No description available" when description is not provided', () => {
        render(
            <ExerciseDetailModal
                {...defaultProps}
                exerciseDescription=""
            />
        );

        expect(screen.getByText('No description available')).toBeInTheDocument();
    });

    it('renders "No description available" when description is undefined', () => {
        render(
            <ExerciseDetailModal
                {...defaultProps}
                exerciseDescription={undefined}
            />
        );

        expect(screen.getByText('No description available')).toBeInTheDocument();
    });

    it('calls onClose when close X button is clicked', () => {
        render(<ExerciseDetailModal {...defaultProps} />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking outside the modal', () => {
        render(<ExerciseDetailModal {...defaultProps} />);

        // The overlay is the first child which has the onClick={onClose}
        // We click on the overlay (not the modal content)
        const overlay = screen.getByText('Bench Press').closest('.fixed');
        fireEvent.click(overlay);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking inside the modal', () => {
        render(<ExerciseDetailModal {...defaultProps} />);

        // Click on the modal content (not the overlay)
        const modalContent = screen.getByText('Bench Press');
        fireEvent.click(modalContent);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('preserves whitespace in description with whitespace-pre-wrap', () => {
        const descriptionWithNewlines = 'Line 1\nLine 2\nLine 3';
        render(
            <ExerciseDetailModal
                {...defaultProps}
                exerciseDescription={descriptionWithNewlines}
            />
        );

        const description = screen.getByTestId('exercise-description');
        expect(description.textContent).toBe(descriptionWithNewlines);
        expect(description).toHaveClass('whitespace-pre-wrap');
    });

    it('renders Info icon in header', () => {
        const { container } = render(<ExerciseDetailModal {...defaultProps} />);

        // Check for blue icon background
        const iconContainer = container.querySelector('.bg-blue-500\\/20');
        expect(iconContainer).toBeInTheDocument();
    });
});
