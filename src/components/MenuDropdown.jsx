import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Settings, History } from 'lucide-react';

/**
 * MenuDropdown component displays a dropdown menu with Settings and History options.
 * Triggered by the Settings button in the Dashboard header.
 */
export default function MenuDropdown({
    isOpen,
    onClose,
    onSelectSettings,
    onSelectHistory,
}) {
    const dropdownRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Add listener with a slight delay to prevent immediate close on open
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSettingsClick = () => {
        onSelectSettings();
        onClose();
    };

    const handleHistoryClick = () => {
        onSelectHistory();
        onClose();
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 z-50 min-w-[160px] bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-hidden animate-fade-in"
        >
            <div className="py-1">
                <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-slate-700/60 transition-colors"
                >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">Settings</span>
                </button>
                <button
                    onClick={handleHistoryClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-slate-700/60 transition-colors"
                >
                    <History className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">History</span>
                </button>
            </div>
        </div>
    );
}

MenuDropdown.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectSettings: PropTypes.func.isRequired,
    onSelectHistory: PropTypes.func.isRequired,
};
