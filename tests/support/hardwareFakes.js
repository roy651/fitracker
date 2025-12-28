/**
 * Hardware Fakes for E2E Testing
 * These are injected into the page using page.addInitScript.
 */

window.__HARDWARE_LOGS__ = [];

// Fake Wake Lock API
try {
    if (!navigator.wakeLock) {
        Object.defineProperty(navigator, 'wakeLock', {
            value: {},
            writable: true
        });
    }

    // Mock request method
    navigator.wakeLock.request = async (type) => {
        console.log('[Fake] WakeLock requested:', type);
        window.__HARDWARE_LOGS__.push({ api: 'wakeLock', action: 'request', type });
        return {
            released: false,
            type,
            release: async () => {
                console.log('[Fake] WakeLock released');
                window.__HARDWARE_LOGS__.push({ api: 'wakeLock', action: 'release', type });
            },
            addEventListener: () => { },
            removeEventListener: () => { }
        };
    };
} catch (e) {
    console.error('[Fake] Failed to mock WakeLock:', e);
}

// Fake Speech Synthesis API
try {
    const fakeSpeech = {
        speak: (utterance) => {
            console.log('[Fake] Speech speak:', utterance.text);
            window.__HARDWARE_LOGS__.push({
                api: 'speech',
                action: 'speak',
                text: utterance.text
            });
            // Simulate end of speech
            setTimeout(() => {
                if (utterance.onend) utterance.onend();
            }, 50);
        },
        getVoices: () => [],
        cancel: () => { },
        pause: () => { },
        resume: () => { },
        onvoiceschanged: null,
        pending: false,
        speaking: false,
        paused: false
    };

    if (window.speechSynthesis) {
        // If it exists (e.g. Chrome), try to overwrite methods
        // Some properties might be read-only, so we wrap in try-catch or defineProperty
        try {
            Object.defineProperty(window, 'speechSynthesis', {
                value: fakeSpeech,
                writable: true,
                configurable: true
            });
        } catch (err) {
            // Fallback: overwrite individual methods
            window.speechSynthesis.speak = fakeSpeech.speak;
            window.speechSynthesis.cancel = fakeSpeech.cancel;
        }
    } else {
        window.speechSynthesis = fakeSpeech;
    }

    if (!window.SpeechSynthesisUtterance) {
        window.SpeechSynthesisUtterance = class {
            constructor(text) {
                this.text = text;
                this.lang = 'en-US';
                this.rate = 1;
                this.pitch = 1;
                this.volume = 1;
                this.onend = null;
                this.onerror = null;
                this.onstart = null;
            }
        };
    }
} catch (e) {
    console.error('[Fake] Failed to mock Speech:', e);
}

console.log('Hardware fakes injected successfully');
