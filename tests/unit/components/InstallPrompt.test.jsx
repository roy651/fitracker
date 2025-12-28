import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InstallPrompt from '../../../src/components/InstallPrompt';
import { vi, describe, it, expect } from 'vitest';

describe('InstallPrompt', () => {
    const defaultProps = {
        deferredPrompt: null,
        isIOS: false,
        isStandalone: false,
        isDismissed: false,
        shouldShowPrompt: true,
        onInstall: vi.fn(),
        onDismiss: vi.fn()
    };

    it('should render nothing if shouldShowPrompt is false', () => {
        const { container } = render(<InstallPrompt {...defaultProps} shouldShowPrompt={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render native install UI when deferredPrompt is available', () => {
        render(<InstallPrompt {...defaultProps} deferredPrompt={{}} />);

        expect(screen.getByText('Install Ski Prep Pro')).toBeDefined();
        expect(screen.getByText('Access faster and work offline')).toBeDefined();
        expect(screen.getByRole('button', { name: /install/i })).toBeDefined();
    });

    it('should render iOS guide when isIOS is true', () => {
        render(<InstallPrompt {...defaultProps} isIOS={true} />);

        expect(screen.getByText('Tap Share > Add to Home Screen')).toBeDefined();
        // Check for presence of share/plus icons (indirectly via their container or aria if added)
        // Since we didn't add specific labels to the icons themselves, we check the text.
    });

    it('should call onInstall when install button is clicked', () => {
        const onInstall = vi.fn();
        render(<InstallPrompt {...defaultProps} deferredPrompt={{}} onInstall={onInstall} />);

        fireEvent.click(screen.getByRole('button', { name: /install/i }));
        expect(onInstall).toHaveBeenCalled();
    });

    it('should call onDismiss when close button is clicked', () => {
        const onDismiss = vi.fn();
        render(<InstallPrompt {...defaultProps} deferredPrompt={{}} onDismiss={onDismiss} />);

        fireEvent.click(screen.getByLabelText('Dismiss'));
        expect(onDismiss).toHaveBeenCalled();
    });
});
