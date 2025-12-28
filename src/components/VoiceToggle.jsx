import { memo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * VoiceToggle Component (Controlled)
 * Renders the toggle button based on props.
 */
const VoiceToggle = memo(function VoiceToggle({
    isEnabled,
    onToggle,
    isSupported = true,
    className = ''
}) {
    const Icon = isEnabled ? Volume2 : VolumeX;

    return (
        <button
            onClick={onToggle}
            disabled={!isSupported}
            aria-label={isEnabled ? "Mute voice announcements" : "Enable voice announcements"}
            aria-pressed={isEnabled}
            className={`
                p-2 rounded-full transition-colors flex items-center justify-center
                ${!isSupported ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}
                ${isEnabled && isSupported ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}
                ${!isEnabled && isSupported ? 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                ${className}
            `}
            title={!isSupported ? "Voice announcements not supported" : "Toggle voice announcements"}
        >
            <Icon size={24} />
        </button>
    );
});

VoiceToggle.propTypes = {
    isEnabled: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    isSupported: PropTypes.bool,
    className: PropTypes.string,
};

export default VoiceToggle;
