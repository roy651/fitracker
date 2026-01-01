import { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Play, Dumbbell } from 'lucide-react';
import ExerciseTile from './ExerciseTile';
import ExerciseDetailModal from './ExerciseDetailModal';
import { getExercise } from '../data/workoutDatabase';

/**
 * WorkoutPreview component displays a preview of all exercises in a workout
 * organized by blocks before starting the actual workout.
 */
export default function WorkoutPreview({ workout, onBack, onStart }) {
    const [selectedExercise, setSelectedExercise] = useState(null);

    const handleTileClick = (exerciseId) => {
        const exercise = getExercise(exerciseId);
        if (exercise) {
            setSelectedExercise({
                id: exerciseId,
                name: exercise.name,
                description: exercise.instruction,
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedExercise(null);
    };

    return (
        <div className="min-h-screen flex flex-col p-4 pb-8 safe-bottom safe-top animate-slide-up">
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{workout.name}</h1>
                        <p className="text-sm text-slate-400">Tap an exercise to see details</p>
                    </div>
                </div>
            </header>

            {/* Blocks */}
            <div className="flex-1 overflow-y-auto space-y-6">
                {workout.blocks && workout.blocks.length > 0 ? (
                    workout.blocks.map((block, blockIdx) => (
                        <div key={blockIdx} className="glass-card p-4">
                            {/* Block Header */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4 text-sky-400" />
                                    <h2 className="font-semibold text-white">{block.name}</h2>
                                </div>
                                <span className="text-sm text-slate-400">
                                    {block.rounds}x {block.drills.length} exercises
                                </span>
                            </div>

                            {/* Exercise Tiles Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {block.drills.map((drillId, drillIdx) => {
                                    const exercise = getExercise(drillId);
                                    return (
                                        <ExerciseTile
                                            key={`${blockIdx}-${drillIdx}`}
                                            exerciseId={drillId}
                                            exerciseName={exercise?.name || 'Unknown Exercise'}
                                            onClick={() => handleTileClick(drillId)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-full bg-slate-800 inline-block mb-4">
                            <Dumbbell className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-300 mb-2">
                            No exercises found
                        </h3>
                        <p className="text-slate-500 text-sm">
                            This workout doesn&apos;t have any exercises yet.
                        </p>
                    </div>
                )}
            </div>

            {/* Start Workout Button */}
            <div className="mt-6">
                <button
                    onClick={onStart}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Play className="w-5 h-5" />
                    Start Workout
                </button>
            </div>

            {/* Exercise Detail Modal */}
            <ExerciseDetailModal
                isOpen={selectedExercise !== null}
                exerciseName={selectedExercise?.name || ''}
                exerciseDescription={selectedExercise?.description || ''}
                onClose={handleCloseModal}
            />
        </div>
    );
}

WorkoutPreview.propTypes = {
    workout: PropTypes.shape({
        name: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                rounds: PropTypes.number.isRequired,
                drills: PropTypes.arrayOf(PropTypes.string).isRequired,
            })
        ),
    }).isRequired,
    onBack: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
};
