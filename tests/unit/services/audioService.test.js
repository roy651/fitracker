import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import audioService from '../../../src/services/audioService';

describe('AudioService', () => {
    let mockAudioContext;
    let mockOscillator;
    let mockGainNode;

    beforeEach(() => {
        // Mock Audio Context
        mockOscillator = {
            connect: vi.fn(),
            type: '',
            frequency: { setValueAtTime: vi.fn() },
            start: vi.fn(),
            stop: vi.fn(),
        };
        mockGainNode = {
            connect: vi.fn(),
            gain: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn()
            },
        };
        mockAudioContext = {
            createOscillator: vi.fn().mockReturnValue(mockOscillator),
            createGain: vi.fn().mockReturnValue(mockGainNode),
            currentTime: 100,
            state: 'suspended',
            resume: vi.fn().mockResolvedValue(),
            destination: {},
        };

        window.AudioContext = vi.fn().mockImplementation(function () {
            return mockAudioContext;
        });
        window.webkitAudioContext = window.AudioContext;

        // Reset singleton state
        audioService.audioContext = null;
        audioService.isEnabled = true;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be a singleton', async () => {
        const { default: service1 } = await import('../../../src/services/audioService');
        const { default: service2 } = await import('../../../src/services/audioService');
        expect(service1).toBe(service2);
        expect(service1).toBe(audioService);

        // Verify that creating a new instance returns the existing one
        const AudioServiceClass = audioService.constructor;
        const newInstance = new AudioServiceClass();
        expect(newInstance).toBe(audioService);
    });

    it('init() should create AudioContext and resume if suspended', () => {
        audioService.init();
        expect(window.AudioContext).toHaveBeenCalled();
        expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    it('playBeep() should create oscillator and gain node', () => {
        audioService.init();
        audioService.playBeep(440, 100, 'sine');

        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
        expect(mockAudioContext.createGain).toHaveBeenCalled();
        expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
        expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
        expect(mockOscillator.start).toHaveBeenCalled();
        expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('playWorkStart() should play sequence of beeps', () => {
        vi.useFakeTimers();
        audioService.init();
        const playBeepSpy = vi.spyOn(audioService, 'playBeep');

        audioService.playWorkStart();

        expect(playBeepSpy).toHaveBeenCalledWith(880, 200, 'sine');
        vi.advanceTimersByTime(100);
        expect(playBeepSpy).toHaveBeenCalledWith(1100, 150, 'sine');

        vi.useRealTimers();
    });

    it('should respect enabled state', () => {
        audioService.init();
        audioService.setEnabled(false);
        vi.spyOn(audioService, 'playBeep');
        // We need to spy on internal calls or check side effects.
        // Since playBeep calls methods on audioContext, checking those calls works

        // Reset mocks to ensure previous calls are cleared
        mockAudioContext.createOscillator.mockClear();

        // Call playBeep directly to test the guard clause
        audioService.playBeep(440, 100);
        expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();

        audioService.setEnabled(true);
        audioService.playBeep(440, 100);
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
});
