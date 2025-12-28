import { renderHook, act } from '@testing-library/react';
import { usePWAInstall } from '../../../src/hooks/usePWAInstall';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('usePWAInstall', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePWAInstall());

        expect(result.current.isStandalone).toBe(false);
        expect(result.current.isIOS).toBe(false);
        expect(result.current.isDismissed).toBe(false);
        expect(result.current.workoutCount).toBe(0);
        expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('should detect standalone mode', () => {
        window.matchMedia.mockImplementation(query => ({
            matches: query === '(display-mode: standalone)',
        }));

        const { result } = renderHook(() => usePWAInstall());
        expect(result.current.isStandalone).toBe(true);
        expect(result.current.shouldShowPrompt).toBe(false); // Standalone means no prompt
    });

    it('should set shouldShowPrompt to true when conditions are met (Android/Desktop)', () => {
        localStorage.setItem('workout_completed_count', '1');

        const { result } = renderHook(() => usePWAInstall());

        // Simulate beforeinstallprompt event
        const event = new Event('beforeinstallprompt');
        event.preventDefault = vi.fn();

        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current.deferredPrompt).toBe(event);
        expect(result.current.workoutCount).toBe(1);
        expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('should set shouldShowPrompt to true when conditions are met (iOS)', () => {
        localStorage.setItem('workout_completed_count', '2');

        // Mock iOS user agent
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            configurable: true
        });

        const { result } = renderHook(() => usePWAInstall());

        expect(result.current.isIOS).toBe(true);
        expect(result.current.workoutCount).toBe(2);
        expect(result.current.shouldShowPrompt).toBe(true);
    });

    it('should not show prompt if workout count is 0', () => {
        localStorage.setItem('workout_completed_count', '0');

        const { result } = renderHook(() => usePWAInstall());

        // Simulate event
        const event = new Event('beforeinstallprompt');
        act(() => {
            window.dispatchEvent(event);
        });

        expect(result.current.shouldShowPrompt).toBe(false);
    });

    it('should handle dismissal and cooldown', () => {
        localStorage.setItem('workout_completed_count', '1');
        const { result } = renderHook(() => usePWAInstall());

        act(() => {
            result.current.dismissPrompt();
        });

        expect(result.current.isDismissed).toBe(true);
        expect(result.current.shouldShowPrompt).toBe(false);
        expect(localStorage.getItem('pwa_install_dismissed')).toBeDefined();
    });

    it('should expire dismissal after 7 days', () => {
        localStorage.setItem('workout_completed_count', '1');
        // Set dismissal dated 8 days ago
        const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
        localStorage.setItem('pwa_install_dismissed', eightDaysAgo.toString());

        const { result } = renderHook(() => usePWAInstall());

        expect(result.current.isDismissed).toBe(false);
        // If we also trigger the prompt event
        act(() => {
            window.dispatchEvent(new Event('beforeinstallprompt'));
        });
        expect(result.current.shouldShowPrompt).toBe(true);
    });
});
