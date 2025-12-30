import { useState, useEffect } from 'react';
import { getPrograms, getProgramById } from '../data/workoutDatabase';

const STORAGE_KEY = 'selectedProgram';

/**
 * Custom hook for managing program selection and persistence.
 * @param {string} defaultProgramId - Optional default program ID to use if no selection exists
 * @returns {{
 *   selectedProgramId: string,
 *   selectedProgram: object,
 *   setSelectedProgram: (programId: string) => void,
 *   availablePrograms: array
 * }}
 */
export function useProgramSelection(defaultProgramId = null) {
    const availablePrograms = getPrograms();

    // Determine initial program ID
    const getInitialProgramId = () => {
        // Try localStorage first
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && getProgramById(stored)) {
            return stored;
        }

        // Fall back to provided default or first program
        return defaultProgramId || availablePrograms[0]?.id;
    };

    const [selectedProgramId, setSelectedProgramId] = useState(getInitialProgramId);
    const [selectedProgram, setSelectedProgram] = useState(() => getProgramById(getInitialProgramId()));

    // Update selected program when ID changes
    useEffect(() => {
        const program = getProgramById(selectedProgramId);
        if (program) {
            setSelectedProgram(program);
            localStorage.setItem(STORAGE_KEY, selectedProgramId);
        }
    }, [selectedProgramId]);

    const handleSetProgram = (programId) => {
        const program = getProgramById(programId);
        if (program) {
            setSelectedProgramId(programId);
        } else {
            console.warn(`Program ID "${programId}" not found`);
        }
    };

    return {
        selectedProgramId,
        selectedProgram,
        setSelectedProgram: handleSetProgram,
        availablePrograms,
    };
}
