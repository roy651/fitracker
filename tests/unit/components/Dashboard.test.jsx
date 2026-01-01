import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../../../src/components/Dashboard';
import { useProgramSelection } from '../../../src/hooks/useProgramSelection';
import useWorkoutHistory from '../../../src/hooks/useWorkoutHistory';

// Mock the hooks
vi.mock('../../../src/hooks/useProgramSelection');
vi.mock('../../../src/hooks/useWorkoutHistory');

// Mock child components to isolate Dashboard logic
vi.mock('../../../src/components/ProgramSelector', () => ({
    default: () => <div data-testid="program-selector">Program Selector</div>
}));
vi.mock('../../../src/components/MenuDropdown', () => ({
    default: ({ isOpen }) => isOpen ? <div data-testid="menu-dropdown">Menu</div> : null
}));
vi.mock('../../../src/components/HistoryView', () => ({
    default: ({ isOpen }) => isOpen ? <div data-testid="history-view">History</div> : null
}));

describe('Dashboard Component', () => {
    const mockSetSelectedProgram = vi.fn();
    const mockOnStartWorkout = vi.fn();

    // Mock Programs
    const skiPrepProgram = {
        id: 'ski-prep-6week',
        name: 'Ski Prep',
        schedule: {
            week_1: { Monday: 'w1_d1', Wednesday: 'w1_d2', Thursday: 'w1_d3' },
            week_2: { Monday: 'w2_d1', Wednesday: 'w2_d2', Thursday: 'w2_d3' },
            week_3: { Monday: 'w3_d1', Wednesday: 'w3_d2', Thursday: 'w3_d3' },
            week_4: { Monday: 'w4_d1', Wednesday: 'w4_d2', Thursday: 'w4_d3' },
            week_5: { Monday: 'w5_d1', Wednesday: 'w5_d2', Thursday: 'w5_d3' },
            week_6: { Monday: 'w6_d1', Wednesday: 'w6_d2', Thursday: 'w6_d3' }
        }
    };

    const combatProgram = {
        id: 'combat-training',
        name: 'Combat Training',
        schedule: {
            week_1: {
                Sunday: 'c_sun',
                Tuesday: 'c_tue',
                Friday: 'c_fri'
            }
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementation
        useProgramSelection.mockReturnValue({
            selectedProgram: skiPrepProgram,
            setSelectedProgram: mockSetSelectedProgram,
            availablePrograms: [skiPrepProgram, combatProgram]
        });

        useWorkoutHistory.mockReturnValue({
            history: [],
            deleteWorkout: vi.fn(),
            clearHistory: vi.fn()
        });
    });

    it('should render successfully without crashing', () => {
        render(<Dashboard onStartWorkout={mockOnStartWorkout} />);
        expect(screen.getByText('Ski Prep')).toBeInTheDocument();
        expect(screen.getByText('Select Week')).toBeInTheDocument();
    });

    it('should display correct number of weeks for Ski Prep (6 weeks)', () => {
        render(<Dashboard onStartWorkout={mockOnStartWorkout} />);
        // Should find buttons for 1, 2, 3, 4, 5, 6
        const weekButtons = screen.getAllByText(/^[1-6]$/);
        expect(weekButtons).toHaveLength(6);
    });

    it('should display correct number of weeks for Combat Training (1 week)', () => {
        // Switch mock to Combat Program
        useProgramSelection.mockReturnValue({
            selectedProgram: combatProgram,
            setSelectedProgram: mockSetSelectedProgram,
            availablePrograms: [skiPrepProgram, combatProgram]
        });

        render(<Dashboard onStartWorkout={mockOnStartWorkout} />);

        // Should find only button for "1"
        const weekButtons = screen.getAllByText(/^1$/);
        expect(weekButtons).toHaveLength(1);

        // Should NOT find button for "2"
        expect(screen.queryByText(/^2$/)).not.toBeInTheDocument();
    });

    it('should render generic icons for new days without crashing', () => {
        // Switch mock to Combat Program which has Sunday, Tuesday, Friday
        useProgramSelection.mockReturnValue({
            selectedProgram: combatProgram,
            setSelectedProgram: mockSetSelectedProgram,
            availablePrograms: [skiPrepProgram, combatProgram]
        });

        render(<Dashboard onStartWorkout={mockOnStartWorkout} />);

        // Verify days are rendered
        expect(screen.getByText('Sunday')).toBeInTheDocument();
        expect(screen.getByText('Tuesday')).toBeInTheDocument();
        expect(screen.getByText('Friday')).toBeInTheDocument();

        // If the day icon mapping was missing, this render would have likely crashed or thrown error
    });

    it('should update availability when switching programs', () => {
        const { rerender } = render(<Dashboard onStartWorkout={mockOnStartWorkout} />);

        // Initially Ski Prep (Monday available)
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.queryByText('Sunday')).not.toBeInTheDocument();

        // Switch to Combat
        useProgramSelection.mockReturnValue({
            selectedProgram: combatProgram,
            setSelectedProgram: mockSetSelectedProgram,
            availablePrograms: [skiPrepProgram, combatProgram]
        });

        rerender(<Dashboard onStartWorkout={mockOnStartWorkout} />);

        // Now Combat (Sunday available)
        expect(screen.getByText('Sunday')).toBeInTheDocument();
        expect(screen.queryByText('Monday')).not.toBeInTheDocument();
    });
});
