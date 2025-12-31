import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../../../src/components/ConfirmDialog';

describe('ConfirmDialog', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    const defaultProps = {
        isOpen: true,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when isOpen is false', () => {
        const { container } = render(
            <ConfirmDialog
                {...defaultProps}
                isOpen={false}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders title and message when open', () => {
        render(<ConfirmDialog {...defaultProps} />);

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('renders confirm and cancel buttons with default text', () => {
        render(<ConfirmDialog {...defaultProps} />);

        expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('renders custom button text when provided', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="Delete"
                cancelText="Keep"
            />
        );

        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when clicking outside the dialog', () => {
        render(<ConfirmDialog {...defaultProps} />);

        // The overlay is the first child which has the onClick={onCancel}
        // We click on the overlay (not the dialog content)
        const overlay = screen.getByText('Confirm Action').closest('.fixed');
        fireEvent.click(overlay);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onCancel when clicking inside the dialog', () => {
        render(<ConfirmDialog {...defaultProps} />);

        // Click on the dialog content (not the overlay)
        const dialogContent = screen.getByText('Confirm Action');
        fireEvent.click(dialogContent);

        expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when close X button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('renders danger variant with correct styling', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                variant="danger"
            />
        );

        // Check for danger variant styling on confirm button
        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        expect(confirmButton).toHaveClass('btn-danger');

        // Check for red icon background
        const iconContainer = document.querySelector('.bg-red-500\\/20');
        expect(iconContainer).toBeInTheDocument();
    });

    it('renders warning variant with correct styling', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                variant="warning"
            />
        );

        // Check for accent variant styling on confirm button
        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        expect(confirmButton).toHaveClass('btn-accent');

        // Check for orange icon background
        const iconContainer = document.querySelector('.bg-orange-500\\/20');
        expect(iconContainer).toBeInTheDocument();
    });

    it('defaults to danger variant when variant is not specified', () => {
        render(<ConfirmDialog {...defaultProps} />);

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        expect(confirmButton).toHaveClass('btn-danger');
    });
});
