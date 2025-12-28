/**
 * Wake Lock Service for preventing screen sleep during workouts
 * Uses Screen Wake Lock API with graceful degradation for unsupported browsers
 */
class WakeLockService {
    constructor() {
        if (WakeLockService.instance) {
            return WakeLockService.instance;
        }

        this._isSupported = false;
        this._wakeLockSentinel = null;
        this._wasAcquired = false;
        this._visibilityHandler = null;
        WakeLockService.instance = this;
    }

    /**
     * Check if the Wake Lock API is supported in the current browser
     * @returns {boolean} True if Wake Lock API is available
     */
    get isSupported() {
        return this._isSupported;
    }

    /**
     * Check if a wake lock is currently held
     * @returns {boolean} True if a wake lock is active
     */
    get isLocked() {
        return this._wakeLockSentinel !== null;
    }

    /**
     * Initialize the service and detect API support
     * Must be called before acquire() or release()
     */
    init() {
        if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
            this._isSupported = true;
        } else {
            this._isSupported = false;
            console.warn('WakeLockService: Wake Lock API not supported in this browser.');
        }

        // Listen for visibility changes to re-acquire lock when tab becomes visible
        // Guard against SSR/Node.js environments where document is undefined
        if (typeof document !== 'undefined' && !this._visibilityHandler) {
            // Store handler reference for potential cleanup
            this._visibilityHandler = async () => {
                if (this._isSupported && document.visibilityState === 'visible' && this._wasAcquired) {
                    await this.acquire();
                }
            };
            document.addEventListener('visibilitychange', this._visibilityHandler);
        }
    }

    /**
     * Acquire a screen wake lock to prevent the screen from sleeping
     * No-op if API is not supported or already acquired
     */
    async acquire() {
        if (!this._isSupported) {
            return;
        }

        try {
            this._wakeLockSentinel = await navigator.wakeLock.request('screen');
            this._wasAcquired = true;

            this._wakeLockSentinel.addEventListener('release', () => {
                console.log('WakeLockService: Wake lock was released.');
            });
        } catch (error) {
            console.error('WakeLockService: Error acquiring wake lock:', error);
        }
    }

    /**
     * Release the currently held wake lock
     * No-op if API is not supported or no lock is held
     */
    async release() {
        if (!this._isSupported || !this._wakeLockSentinel) {
            return;
        }

        try {
            await this._wakeLockSentinel.release();
            this._wakeLockSentinel = null;
            this._wasAcquired = false;
        } catch (error) {
            console.error('WakeLockService: Error releasing wake lock:', error);
        }
    }

    /**
     * Cleanup method to remove event listeners
     * Useful for testing and potential service destruction
     */
    destroy() {
        if (typeof document !== 'undefined' && this._visibilityHandler) {
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            this._visibilityHandler = null;
        }
    }
}

const wakeLockService = new WakeLockService();
export default wakeLockService;
