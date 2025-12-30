import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

/**
 * ProgramSelector component displays a list of available workout programs
 * and allows users to select one.
 */
export default function ProgramSelector({ programs, selectedProgramId, onSelect }) {
    if (!programs || programs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No programs available
            </div>
        );
    }

    // If only one program, show a message instead of selector
    if (programs.length === 1) {
        const program = programs[0];
        return (
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {program.name}
                </h3>
                <p className="text-blue-700 text-sm mb-2">{program.description}</p>
                <p className="text-blue-600 text-xs">
                    {program.duration_weeks} weeks • {program.frequency}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Your Program
            </h2>

            <div className="space-y-3">
                {programs.map((program) => {
                    const isSelected = program.id === selectedProgramId;

                    return (
                        <button
                            key={program.id}
                            onClick={() => onSelect(program.id)}
                            className={`
                                w-full text-left p-4 rounded-lg border-2 transition-all
                                ${isSelected
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'
                                        }`}>
                                        {program.name}
                                    </h3>
                                    <p className={`text-sm mb-2 ${isSelected ? 'text-blue-700' : 'text-gray-600'
                                        }`}>
                                        {program.description}
                                    </p>
                                    <p className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {program.duration_weeks} weeks • {program.frequency}
                                    </p>
                                </div>

                                {isSelected && (
                                    <div className="ml-4 flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

ProgramSelector.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            duration_weeks: PropTypes.number.isRequired,
            frequency: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedProgramId: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};
