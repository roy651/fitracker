import { useState, useEffect, useCallback } from 'react';
import speechService from '../services/speechService';

const STORAGE_KEY = 'ski_prep_user_prefs';

/**
 * Custom hook to manage voice announcement preference.
 * Handles persistence to localStorage and checks browser support.
 * @returns {Object} { isEnabled, isSupported, toggle, setEnabled }
 */
export default function useVoicePreference() {
    const [isEnabled, setIsEnabled] = useState(false);
    const isSupported = speechService.isSupported;

    // Load preference on mount
    useEffect(() => {
        if (!isSupported) {
            // eslint-disable-next-line
            setIsEnabled(false);
            return;
        }

        const savedPrefs = localStorage.getItem(STORAGE_KEY);
        if (savedPrefs) {
            try {
                const prefs = JSON.parse(savedPrefs);
                if (typeof prefs.voiceEnabled === 'boolean') {
                    setIsEnabled(prefs.voiceEnabled);
                }
            } catch (e) {
                console.warn('Failed to parse user prefs', e);
            }
        }
    }, [isSupported]);

    const updatePreference = useCallback((newValue) => {
        if (!isSupported) return;

        setIsEnabled(newValue);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ voiceEnabled: newValue }));
    }, [isSupported]);

    const toggle = useCallback(() => {
        updatePreference(!isEnabled);
    }, [isEnabled, updatePreference]);

    return {
        isEnabled,
        isSupported,
        toggle,
        setEnabled: updatePreference
    };
}
