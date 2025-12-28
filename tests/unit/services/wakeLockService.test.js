import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// NOTE: We need to reset modules between tests to reset the singleton
let wakeLockService;

describe('WakeLockService', () => {
    let originalNavigator;

    beforeEach(async () => {
        // Store original navigator
        originalNavigator = globalThis.navigator;

        // Reset modules to get fresh singleton
        vi.resetModules();
    });

    afterEach(() => {
        // Restore original navigator
        if (originalNavigator) {
            globalThis.navigator = originalNavigator;
        }
        vi.restoreAllMocks();
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance when instantiated multiple times', async () => {
            // Setup: supported environment
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            const instance1 = module.default;

            // Re-import should return same instance
            const module2 = await import('../../../src/services/wakeLockService.js');
            const instance2 = module2.default;

            expect(instance1).toBe(instance2);
        });
    });

    describe('Constructor Initialization', () => {
        it('should initialize with isSupported as false', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;

            // Before init(), isSupported should be false
            expect(wakeLockService.isSupported).toBe(false);
        });

        it('should initialize with isLocked as false', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;

            // Internal sentinel should be null, verified via public getter
            expect(wakeLockService.isLocked).toBe(false);
        });

        it('should initialize with _wasAcquired as false', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;

            expect(wakeLockService._wasAcquired).toBe(false);
        });
    });

    describe('init() method', () => {
        it('should set isSupported to true when navigator.wakeLock exists', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            expect(wakeLockService.isSupported).toBe(true);
        });

        it('should set isSupported to false when navigator.wakeLock is missing', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            expect(wakeLockService.isSupported).toBe(false);
        });

        it('should set isSupported to false when navigator is undefined', async () => {
            globalThis.navigator = undefined;

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            expect(wakeLockService.isSupported).toBe(false);
        });
    });

    describe('isLocked getter', () => {
        it('should return false when no lock is held', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            expect(wakeLockService.isLocked).toBe(false);
        });

        it('should return true when lock is held', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn(),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            expect(wakeLockService.isLocked).toBe(true);
        });

        it('should return false after release', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();
            await wakeLockService.release();

            expect(wakeLockService.isLocked).toBe(false);
        });
    });

    describe('acquire() method', () => {
        it('should call navigator.wakeLock.request with "screen"', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn(),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            expect(mockRequest).toHaveBeenCalledWith('screen');
        });

        it('should store the sentinel internally after acquiring', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn(),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            // Verify via public getter
            expect(wakeLockService.isLocked).toBe(true);
        });

        it('should add a release event listener to the sentinel', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn(),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            expect(mockSentinel.addEventListener).toHaveBeenCalledWith('release', expect.any(Function));
        });

        it('should be a no-op when API is not supported (no errors thrown)', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            // Should not throw
            await expect(wakeLockService.acquire()).resolves.not.toThrow();
            expect(wakeLockService.isLocked).toBe(false);
        });

        it('should set _wasAcquired to true after successful acquire', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn(),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            expect(wakeLockService._wasAcquired).toBe(true);
        });

        it('should handle errors gracefully without throwing', async () => {
            const mockRequest = vi.fn().mockRejectedValue(new Error('Permission denied'));
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            // Should not throw even if API rejects
            await expect(wakeLockService.acquire()).resolves.not.toThrow();
        });
    });

    describe('release() method', () => {
        it('should call sentinel.release() when lock is held', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();
            await wakeLockService.release();

            expect(mockSentinel.release).toHaveBeenCalled();
        });

        it('should clear the sentinel reference after release', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();
            await wakeLockService.release();

            // Verify via public getter
            expect(wakeLockService.isLocked).toBe(false);
        });

        it('should set _wasAcquired to false after release', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();
            await wakeLockService.release();

            expect(wakeLockService._wasAcquired).toBe(false);
        });

        it('should be a no-op when no sentinel exists', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            // Should not throw when no lock held
            await expect(wakeLockService.release()).resolves.not.toThrow();
        });

        it('should be a no-op when API is not supported', async () => {
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            // Should not throw
            await expect(wakeLockService.release()).resolves.not.toThrow();
        });

        it('should handle errors gracefully without throwing', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockRejectedValue(new Error('Release failed')),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            // Should not throw even if release rejects
            await expect(wakeLockService.release()).resolves.not.toThrow();
        });
    });

    describe('Visibility change re-acquisition (AC: 3)', () => {
        let documentAddEventListenerSpy;
        let visibilityChangeHandler;

        beforeEach(() => {
            // Capture the visibilitychange handler when addEventListener is called
            documentAddEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
                if (event === 'visibilitychange') {
                    visibilityChangeHandler = handler;
                }
            });
        });

        afterEach(() => {
            documentAddEventListenerSpy.mockRestore();
            visibilityChangeHandler = null;
        });

        it('should add visibilitychange listener during init', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();

            expect(documentAddEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        });

        it('should re-acquire lock when visibility returns and _wasAcquired is true', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            // Simulate tab going hidden then visible
            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
            mockRequest.mockClear(); // Clear the initial acquisition call

            // Trigger the visibility change
            await visibilityChangeHandler();

            expect(mockRequest).toHaveBeenCalledWith('screen');
        });

        it('should NOT re-acquire lock when visibility returns but _wasAcquired is false', async () => {
            const mockRequest = vi.fn().mockResolvedValue({
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            });
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            // Do NOT call acquire() - so _wasAcquired remains false

            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
            mockRequest.mockClear();

            // Trigger the visibility change
            await visibilityChangeHandler();

            expect(mockRequest).not.toHaveBeenCalled();
        });

        it('should NOT re-acquire when document is still hidden', async () => {
            const mockSentinel = {
                addEventListener: vi.fn(),
                release: vi.fn().mockResolvedValue(undefined),
            };
            const mockRequest = vi.fn().mockResolvedValue(mockSentinel);
            globalThis.navigator = { wakeLock: { request: mockRequest } };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            await wakeLockService.acquire();

            Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
            mockRequest.mockClear();

            // Trigger the visibility change with hidden state
            await visibilityChangeHandler();

            expect(mockRequest).not.toHaveBeenCalled();
        });

        it('should NOT re-acquire when API is not supported', async () => {
            // No wakeLock in navigator = not supported
            globalThis.navigator = {};

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            // Manually set _wasAcquired to true to test the guard
            wakeLockService._wasAcquired = true;

            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });

            // Trigger the visibility change - should not throw or crash
            await expect(visibilityChangeHandler()).resolves.not.toThrow();
        });
    });

    describe('destroy() method', () => {
        let documentRemoveEventListenerSpy;

        beforeEach(() => {
            documentRemoveEventListenerSpy = vi.spyOn(document, 'removeEventListener');
        });

        afterEach(() => {
            documentRemoveEventListenerSpy.mockRestore();
        });

        it('should remove the visibilitychange listener', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            wakeLockService.destroy();

            expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        });

        it('should clear the handler reference after destroy', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            wakeLockService.destroy();

            expect(wakeLockService._visibilityHandler).toBeNull();
        });

        it('should be safe to call multiple times', async () => {
            globalThis.navigator = { wakeLock: {} };

            const module = await import('../../../src/services/wakeLockService.js');
            wakeLockService = module.default;
            wakeLockService.init();
            wakeLockService.destroy();

            // Second call should not throw
            expect(() => wakeLockService.destroy()).not.toThrow();
        });
    });
});
