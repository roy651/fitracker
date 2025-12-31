import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryView from '../../../src/components/HistoryView';

describe('HistoryView', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnClearAll = vi.fn();

    const mockHistory = [
        {
            id: 'entry-1',
            date: '2024-01-15T10:30:00Z',
            workoutName: 'Morning HIIT',
            duration: 1800,
        },
        {
            id: 'entry-2',
            date: '2024-01-14T14:00:00Z',
            workoutName: 'Full Body Strength',
            duration: 2700,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when isOpen is false', () => {
        const { container } = render(
            <HistoryView
                isOpen={false}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders empty state when history is empty', () => {
        render(
            <HistoryView
                isOpen={true}
                history={[]}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        expect(screen.getByText('No workouts yet')).toBeInTheDocument();
        expect(screen.getByText('Complete your first workout to see it here!')).toBeInTheDocument();
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('renders history entries when history has items', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        expect(screen.getByText('Morning HIIT')).toBeInTheDocument();
        expect(screen.getByText('Full Body Strength')).toBeInTheDocument();
        expect(screen.getByText('2 workouts recorded')).toBeInTheDocument();
    });

    it('renders correct entry count singular', () => {
        render(
            <HistoryView
                isOpen={true}
                history={[mockHistory[0]]}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        expect(screen.getByText('1 workout recorded')).toBeInTheDocument();
    });

    it('renders header with title', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        expect(screen.getByText('Workout History')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders delete button for each entry', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        // Should have one delete button per entry (2 entries)
        expect(deleteButtons).toHaveLength(2);
    });

    it('shows delete confirmation dialog when delete button is clicked', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete morning hiit/i });
        fireEvent.click(deleteButton);

        expect(screen.getByText('Delete Workout')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete "Morning HIIT"/)).toBeInTheDocument();
    });

    it('calls onDelete when confirming delete', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        // Click delete for first entry
        const deleteButton = screen.getByRole('button', { name: /delete morning hiit/i });
        fireEvent.click(deleteButton);

        // Confirm deletion
        const confirmButton = screen.getByRole('button', { name: /^delete$/i });
        fireEvent.click(confirmButton);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith('entry-1');
    });

    it('closes delete confirmation dialog when cancel is clicked', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        // Click delete for first entry
        const deleteButton = screen.getByRole('button', { name: /delete morning hiit/i });
        fireEvent.click(deleteButton);

        // Cancel deletion
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnDelete).not.toHaveBeenCalled();
        expect(screen.queryByText('Delete Workout')).not.toBeInTheDocument();
    });

    it('shows Clear All button when history has items', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    });

    it('shows clear all confirmation dialog when Clear All is clicked', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        const clearAllButton = screen.getByRole('button', { name: /clear all/i });
        fireEvent.click(clearAllButton);

        expect(screen.getByText('Clear All History')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete all workout history/)).toBeInTheDocument();
    });

    it('calls onClearAll when confirming clear all', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        // Click Clear All button
        const clearAllButton = screen.getByRole('button', { name: /clear all/i });
        fireEvent.click(clearAllButton);

        // Find and click the confirm button in dialog (not the original Clear All button)
        const confirmButtons = screen.getAllByRole('button', { name: /clear all/i });
        // The second one is the confirm button in the dialog
        fireEvent.click(confirmButtons[1]);

        expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it('closes clear all confirmation dialog when cancel is clicked', () => {
        render(
            <HistoryView
                isOpen={true}
                history={mockHistory}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
                onClearAll={mockOnClearAll}
            />
        );

        // Click Clear All button
        const clearAllButton = screen.getByRole('button', { name: /clear all/i });
        fireEvent.click(clearAllButton);

        // Cancel
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnClearAll).not.toHaveBeenCalled();
        expect(screen.queryByText('Clear All History')).not.toBeInTheDocument();
    });
});
