import { useState, useEffect } from 'react';

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [workoutCount, setWorkoutCount] = useState(0);

    useEffect(() => {
        const checkWorkoutCount = () => {
            const count = parseInt(localStorage.getItem('workout_completed_count') || '0', 10);
            setWorkoutCount(count);
        };

        // Check if already installed
        const checkStandalone = () => {
            const standalone = window.matchMedia('(display-mode: standalone)').matches
                || window.navigator.standalone
                || document.referrer.includes('android-app://');
            setIsStandalone(standalone);
        };

        // Check if iOS
        const checkIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const ios = /iphone|ipad|ipod/.test(userAgent);
            setIsIOS(ios);
        };

        // Check dismissal status
        const checkDismissal = () => {
            const dismissed = localStorage.getItem('pwa_install_dismissed');
            if (dismissed) {
                const dismissedAt = parseInt(dismissed, 10);
                const now = Date.now();
                const sevenDays = 7 * 24 * 60 * 60 * 1000;

                if (now - dismissedAt < sevenDays) {
                    setIsDismissed(true);
                } else {
                    localStorage.removeItem('pwa_install_dismissed');
                    setIsDismissed(false);
                }
            }
        };

        checkStandalone();
        checkIOS();
        checkDismissal();
        checkWorkoutCount();

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
        } else {
            console.log('User dismissed the PWA install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    const dismissPrompt = () => {
        localStorage.setItem('pwa_install_dismissed', Date.now().toString());
        setIsDismissed(true);
    };

    // Prompt should only show if:
    // 1. Not already installed (standalone)
    // 2. Not dismissed within the 7-day cooldown
    // 3. Has completed at least 1 workout (UX funnel)
    // 4. Either a native prompt is available OR it's iOS Safari
    const shouldShowPrompt = !isStandalone &&
        !isDismissed &&
        workoutCount >= 1 &&
        (!!deferredPrompt || isIOS);

    return {
        deferredPrompt,
        isStandalone,
        isIOS,
        isDismissed,
        workoutCount,
        shouldShowPrompt,
        handleInstall,
        dismissPrompt
    };
}
