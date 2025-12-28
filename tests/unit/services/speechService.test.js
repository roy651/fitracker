import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import speechService from '../../../src/services/speechService';

describe('SpeechService', () => {
    let mockSpeechSynthesis;
    let mockUtterance;

    beforeEach(() => {
        // Mock SpeechSynthesisUtterance
        mockUtterance = vi.fn();
        window.SpeechSynthesisUtterance = mockUtterance;

        // Mock speechSynthesis
        mockSpeechSynthesis = {
            speak: vi.fn(),
            cancel: vi.fn(),
            getVoices: vi.fn().mockReturnValue([]),
        };

        // Configurable defineProperty for window.speechSynthesis to allow testing supported/unsupported
        Object.defineProperty(window, 'speechSynthesis', {
            value: mockSpeechSynthesis,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // Reset singleton instance if possible (requires implementation adjustment or module re-import strategy)
        // For now, we'll assume the service is stateful but we can re-init or check state
    });

    it('should be a singleton', async () => {
        const { default: service1 } = await import('../../../src/services/speechService');
        const { default: service2 } = await import('../../../src/services/speechService');
        expect(service1).toBe(service2);
        expect(service1).toBe(speechService);

        // Verify that creating a new instance returns the existing one
        const SpeechServiceClass = speechService.constructor;
        const newInstance = new SpeechServiceClass();
        expect(newInstance).toBe(speechService);
    });

    it('init() should detect unsupported browser', () => {
        Object.defineProperty(window, 'speechSynthesis', {
            value: undefined,
            writable: true,
        });

        // We expect the service to handle initialization safely even if not supported
        // Re-importing to ensure clean state if possible, or we just rely on init logic
        expect(speechService.isSupported).toBe(false); // Default before init might be questionable, but let's see implementation intent

        speechService.init();
        expect(speechService.isSupported).toBe(false);
    });

    it('init() should detect supported browser', () => {
        speechService.init();
        expect(speechService.isSupported).toBe(true);
    });

    it('speak() should create utterance and call synthesis.speak', () => {
        speechService.init();
        const text = 'Hello world';
        speechService.speak(text);

        expect(mockUtterance).toHaveBeenCalledWith(text);
        expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('speak() should not crash if unsupported', () => {
        Object.defineProperty(window, 'speechSynthesis', {
            value: undefined,
            writable: true,
        });
        speechService.init();

        // Should not throw
        expect(() => speechService.speak('test')).not.toThrow();
    });

    it('speak() should catch errors during synthesis', () => {
        speechService.init();
        mockSpeechSynthesis.speak.mockImplementation(() => {
            throw new Error('Synthesis error');
        });

        // Should not throw, should log error (we can spy on console.error if we want strict check)
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => speechService.speak('test')).not.toThrow();

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
