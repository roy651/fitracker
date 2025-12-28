class SpeechService {
    constructor() {
        if (SpeechService.instance) {
            return SpeechService.instance;
        }

        this._isSupported = false;
        this._speechSynthesis = null;
        SpeechService.instance = this;
    }

    init() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this._speechSynthesis = window.speechSynthesis;
            this._isSupported = true;
            // Feature detection logic is now complete
        } else {
            this._isSupported = false;
            console.warn('SpeechService: Web Speech API not supported in this browser.');
        }
    }

    get isSupported() {
        return this._isSupported;
    }

    speak(text) {
        if (!this._isSupported || !this._speechSynthesis) {
            console.warn('SpeechService: Cannot speak, API not supported or not initialized.');
            return;
        }

        try {
            // Cancel any current speaking to avoid queue buildup
            this._speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            this._speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('SpeechService: Error during speech synthesis:', error);
        }
    }
}

const speechService = new SpeechService();
export default speechService;
