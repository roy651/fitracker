import { useState } from 'react';
import PropTypes from 'prop-types';
import { Trash2, History, X, Calendar, Clock } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { formatTime } from '../utils/linearizer';

/**
 * HistoryView component displays workout history in a table format
 * with delete functionality for individual entries and clear all.
 */
export default function HistoryView({
    isOpen,
    history,
    onClose,
    onDelete,
    onClearAll,
}) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

    if (!isOpen) return null;

    /**
     * Format ISO date string to a readable format
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date string
     */
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDeleteClick = (entry) => {
        setDeleteConfirm(entry);
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm) {
            onDelete(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleClearAllClick = () => {
        setShowClearAllConfirm(true);
    };

    const handleConfirmClearAll = () => {
        onClearAll();
        setShowClearAllConfirm(false);
    };

    const handleCancelClearAll = () => {
        setShowClearAllConfirm(false);
    };

    return (
        <>
            {/* Main History Modal */}
            <div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 animate-fade-in"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-lg bg-slate-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-sky-500/20">
                                <History className="w-5 h-5 text-sky-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Workout History</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    {history.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="p-4 rounded-full bg-slate-800 inline-block mb-4">
                                <History className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-300 mb-2">
                                No workouts yet
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Complete your first workout to see it here!
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Clear All Button */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleClearAllClick}
                                    className="btn btn-danger text-sm px-3 py-1.5"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    Clear All
                                </button>
                            </div>

                            {/* History Table */}
                            <div className="space-y-3">
                                {history.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="glass-card p-4 flex items-center justify-between"
                                    >
                                        <div className="flex-1 min-w-0">
                                            {/* Workout Name */}
                                            <h3 className="font-medium text-white truncate mb-1">
                                                {entry.workoutName}
                                            </h3>
                                            {/* Date & Duration */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(entry.date)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatTime(entry.duration)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteClick(entry)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors ml-3 flex-shrink-0"
                                            aria-label={`Delete ${entry.workoutName}`}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Entry Count */}
                            <p className="text-center text-slate-500 text-sm mt-4">
                                {history.length} workout{history.length !== 1 ? 's' : ''} recorded
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm !== null}
                title="Delete Workout"
                message={`Are you sure you want to delete "${deleteConfirm?.workoutName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            {/* Clear All Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showClearAllConfirm}
                title="Clear All History"
                message="Are you sure you want to delete all workout history? This action cannot be undone."
                confirmText="Clear All"
                cancelText="Cancel"
                onConfirm={handleConfirmClearAll}
                onCancel={handleCancelClearAll}
                variant="danger"
            />
        </>
    );
}

HistoryView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    history: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            workoutName: PropTypes.string.isRequired,
            duration: PropTypes.number.isRequired,
            weekKey: PropTypes.string,
            day: PropTypes.string,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired,
};
