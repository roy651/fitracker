import React from 'react';
import { X, Share, Plus, Download } from 'lucide-react';

const InstallPrompt = ({
    deferredPrompt,
    isIOS,
    isStandalone,
    isDismissed,
    onInstall,
    onDismiss,
    shouldShowPrompt
}) => {
    if (!shouldShowPrompt) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-400" />
                </div>

                <div className="flex-grow">
                    <h3 className="text-white font-semibold text-sm">Install Ski Prep Pro</h3>
                    <p className="text-slate-400 text-xs leading-tight">
                        {isIOS
                            ? "Tap Share > Add to Home Screen"
                            : "Access faster and work offline"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {deferredPrompt && (
                        <button
                            onClick={onInstall}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Install
                        </button>
                    )}

                    {isIOS && (
                        <div className="flex items-center gap-1 bg-slate-800 px-2 py-1.5 rounded-lg text-slate-300">
                            <Share className="w-3.5 h-3.5" />
                            <Plus className="w-3.5 h-3.5" />
                        </div>
                    )}

                    <button
                        onClick={onDismiss}
                        className="p-1.5 hover:bg-slate-800 rounded-full transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
