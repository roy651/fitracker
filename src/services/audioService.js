/**
 * Audio Service for workout transition sounds
 * Uses Web Audio API for reliable cross-browser beeps
 */
class AudioService {
    constructor() {
        if (AudioService.instance) {
            return AudioService.instance;
        }

        this.audioContext = null;
        this.isEnabled = true;
        AudioService.instance = this;
    }

    /**
     * Initialize the AudioContext (must be called after user interaction)
     */
    init() {
        if (typeof window === 'undefined') return;

        if (!this.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
            } else {
                console.warn('AudioService: Web Audio API not supported.');
                this.isEnabled = false;
                return;
            }
        }

        // Resume if suspended (iOS requires this)
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume().catch(e => console.warn('AudioService: Resume failed', e));
        }
    }

    /**
     * Play a beep sound
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in milliseconds
     * @param {string} type - Oscillator type: 'sine', 'square', 'triangle', 'sawtooth'
     */
    playBeep(frequency = 800, duration = 150, type = "sine") {
        if (!this.isEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Fade out to avoid clicks
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration / 1000
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.warn("AudioService: Playback failed:", e);
        }
    }

    /**
     * Play work start sound (higher pitch, energetic)
     */
    playWorkStart() {
        this.playBeep(880, 200, "sine"); // A5
        setTimeout(() => this.playBeep(1100, 150, "sine"), 100); // C#6
    }

    /**
     * Play rest start sound (lower pitch, calming)
     */
    playRestStart() {
        this.playBeep(440, 300, "triangle"); // A4
    }

    /**
     * Play countdown warning (3, 2, 1 beeps)
     */
    playCountdownBeep() {
        this.playBeep(600, 100, "square");
    }

    /**
     * Play workout complete fanfare
     */
    playComplete() {
        this.playBeep(523, 150, "sine"); // C5
        setTimeout(() => this.playBeep(659, 150, "sine"), 150); // E5
        setTimeout(() => this.playBeep(784, 150, "sine"), 300); // G5
        setTimeout(() => this.playBeep(1047, 300, "sine"), 450); // C6
    }

    /**
     * Toggle audio on/off
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    /**
     * Set audio enabled state
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
}

// Singleton instance
const audioService = new AudioService();
export default audioService;
