import PropTypes from 'prop-types';
import { X, Info } from 'lucide-react';

/**
 * ExerciseDetailModal component displays a modal with exercise details
 * including name and description.
 */
export default function ExerciseDetailModal({
    isOpen,
    exerciseName,
    exerciseDescription,
    onClose,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-slate-900 rounded-2xl p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/20">
                            <Info className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">{exerciseName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Description */}
                <div className="text-slate-300">
                    {exerciseDescription ? (
                        <p className="whitespace-pre-wrap">{exerciseDescription}</p>
                    ) : (
                        <p className="text-slate-500 italic">No description available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

ExerciseDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    exerciseName: PropTypes.string.isRequired,
    exerciseDescription: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
