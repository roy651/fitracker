import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useVoicePreference from '../../../src/hooks/useVoicePreference';
import speechService from '../../../src/services/speechService';

// Mock speechService
vi.mock('../../../src/services/speechService', () => {
    let supported = true;
    return {
        default: {
            get isSupported() {
                return supported;
            },
            set isSupported(value) {
                supported = value;
            }
        }
    };
});

describe('useVoicePreference Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        speechService.isSupported = true;
    });

    it('should initialize with default value false if no localStorage', () => {
        const { result } = renderHook(() => useVoicePreference());
        expect(result.current.isEnabled).toBe(false);
    });

    it('should initialize from localStorage (true)', () => {
        localStorage.setItem('ski_prep_user_prefs', JSON.stringify({ voiceEnabled: true }));
        const { result } = renderHook(() => useVoicePreference());
        expect(result.current.isEnabled).toBe(true);
    });

    it('should initialize from localStorage (false)', () => {
        localStorage.setItem('ski_prep_user_prefs', JSON.stringify({ voiceEnabled: false }));
        const { result } = renderHook(() => useVoicePreference());
        expect(result.current.isEnabled).toBe(false);
    });

    it('should force isEnabled to false if speechService is not supported', () => {
        localStorage.setItem('ski_prep_user_prefs', JSON.stringify({ voiceEnabled: true }));
        speechService.isSupported = false;

        const { result } = renderHook(() => useVoicePreference());
        expect(result.current.isEnabled).toBe(false);
        expect(result.current.isSupported).toBe(false);
    });

    it('should toggle preference and update state and localStorage', () => {
        const { result } = renderHook(() => useVoicePreference());

        expect(result.current.isEnabled).toBe(false);

        act(() => {
            result.current.toggle();
        });

        expect(result.current.isEnabled).toBe(true);
        expect(JSON.parse(localStorage.getItem('ski_prep_user_prefs'))).toEqual({ voiceEnabled: true });

        act(() => {
            result.current.toggle();
        });

        expect(result.current.isEnabled).toBe(false);
        expect(JSON.parse(localStorage.getItem('ski_prep_user_prefs'))).toEqual({ voiceEnabled: false });
    });

    it('should set preference explicitly', () => {
        const { result } = renderHook(() => useVoicePreference());

        act(() => {
            result.current.setEnabled(true);
        });

        expect(result.current.isEnabled).toBe(true);
        expect(JSON.parse(localStorage.getItem('ski_prep_user_prefs'))).toEqual({ voiceEnabled: true });
    });
});
