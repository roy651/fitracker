import PropTypes from 'prop-types';
import { Dumbbell } from 'lucide-react';
import { getExerciseImage } from '../assets/exercises';

/**
 * ExerciseTile Component
 * Displays an exercise image tile with click handler for exercise selection
 */
export default function ExerciseTile({ exerciseId, exerciseName, onClick, className = '' }) {
    const imageSrc = getExerciseImage(exerciseId);

    return (
        <button
            onClick={onClick}
            className={`
                glass-card p-4 transition-all duration-200
                hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20
                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${className}
            `}
            aria-label={`View ${exerciseName}`}
        >
            <div className="flex flex-col items-center justify-center gap-3">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={exerciseName}
                        className="w-24 h-24 object-contain rounded-lg"
                        style={{ filter: 'invert(1) brightness(0.9)' }}
                    />
                ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-800/50 rounded-lg">
                        <Dumbbell className="w-8 h-8 text-slate-500" />
                    </div>
                )}
                <span className="text-sm font-medium text-slate-200 text-center line-clamp-2">
                    {exerciseName}
                </span>
            </div>
        </button>
    );
}

ExerciseTile.propTypes = {
    exerciseId: PropTypes.string.isRequired,
    exerciseName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};
