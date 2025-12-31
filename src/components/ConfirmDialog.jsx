import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog component displays a modal confirmation dialog
 * for destructive or important actions.
 */
export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger',
}) {
    if (!isOpen) return null;

    const confirmButtonClass = variant === 'danger' ? 'btn-danger' : 'btn-accent';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm bg-slate-900 rounded-2xl p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                            variant === 'danger'
                                ? 'bg-red-500/20'
                                : 'bg-orange-500/20'
                        }`}>
                            <AlertTriangle className={`w-5 h-5 ${
                                variant === 'danger'
                                    ? 'text-red-400'
                                    : 'text-orange-400'
                            }`} />
                        </div>
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Message */}
                <p className="text-slate-300 mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="btn btn-secondary flex-1"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`btn ${confirmButtonClass} flex-1`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

ConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['danger', 'warning']),
};
