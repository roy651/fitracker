import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceToggle from '../../../src/components/VoiceToggle';

describe('VoiceToggle', () => {
    const mockToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders enabled state correctly', () => {
        render(<VoiceToggle isEnabled={true} onToggle={mockToggle} isSupported={true} />);
        const button = screen.getByRole('button', { name: /mute voice announcements/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).not.toBeDisabled();
    });

    it('renders disabled (off) state correctly', () => {
        render(<VoiceToggle isEnabled={false} onToggle={mockToggle} isSupported={true} />);
        const button = screen.getByRole('button', { name: /enable voice announcements/i });
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders unsupported state correctly', () => {
        render(<VoiceToggle isEnabled={false} onToggle={mockToggle} isSupported={false} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('opacity-50');
    });

    it('calls onToggle when clicked', () => {
        render(<VoiceToggle isEnabled={false} onToggle={mockToggle} isSupported={true} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});
