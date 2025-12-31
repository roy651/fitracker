import { useState, useMemo } from "react";
import {
    Mountain,
    Calendar,
    Dumbbell,
    Home,
    Timer,
    ChevronRight,
    Snowflake,
    Zap,
    Target,
    Menu,
    X,
} from "lucide-react";
import {
    getDaysForWeek,
    getWorkoutTemplate,
} from "../data/workoutDatabase";
import { getWorkoutSummary, formatTime } from "../utils/linearizer";
import { useProgramSelection } from "../hooks/useProgramSelection";
import useWorkoutHistory from "../hooks/useWorkoutHistory";
import ProgramSelector from "./ProgramSelector";
import MenuDropdown from "./MenuDropdown";
import HistoryView from "./HistoryView";

// Week display names - Unused but kept for reference if needed? No, delete to satisfy lint.
// const weekLabels = { ... };

// Phase info for weeks
const getPhaseInfo = (weekKey) => {
    const weekNum = parseInt(weekKey.split("_")[1]);
    if (weekNum <= 3) {
        return {
            name: "Phase 1: Foundation",
            color: "from-sky-500 to-blue-600",
            icon: Target,
            description: "Building strength & stability base",
        };
    }
    return {
        name: "Phase 2: Power",
        color: "from-orange-500 to-red-600",
        icon: Zap,
        description: "Explosive power & endurance",
    };
};

// Day icons
const dayIcons = {
    Monday: Dumbbell,
    Wednesday: Dumbbell,
    Thursday: Home,
};

// Day descriptions
const dayDescriptions = {
    Monday: "Gym Session",
    Wednesday: "Gym Session",
    Thursday: "Home/BOSU",
};

export default function Dashboard({ onStartWorkout }) {
    const { selectedProgram, setSelectedProgram, availablePrograms } = useProgramSelection();
    const { history, deleteWorkout, clearHistory } = useWorkoutHistory();
    const [showProgramSelector, setShowProgramSelector] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Use program's schedule for week keys
    const weekKeys = selectedProgram?.schedule ? Object.keys(selectedProgram.schedule) : [];

    const [selectedWeek, setSelectedWeek] = useState(weekKeys[0]);
    const [selectedDay, setSelectedDay] = useState(null);

    const availableDays = useMemo(
        () => getDaysForWeek(selectedWeek),
        [selectedWeek]
    );

    const selectedWorkout = useMemo(() => {
        if (!selectedDay) return null;
        return getWorkoutTemplate(selectedWeek, selectedDay);
    }, [selectedWeek, selectedDay]);

    const workoutSummary = useMemo(() => {
        if (!selectedWorkout) return null;
        return getWorkoutSummary(selectedWorkout);
    }, [selectedWorkout]);

    const phaseInfo = getPhaseInfo(selectedWeek);
    const PhaseIcon = phaseInfo.icon;

    const handleWeekChange = (weekKey) => {
        setSelectedWeek(weekKey);
        setSelectedDay(null); // Reset day selection when week changes
    };

    const handleProgramChange = (programId) => {
        setSelectedProgram(programId);
        setShowProgramSelector(false);
        // Reset selections when program changes
        setSelectedWeek(weekKeys[0]);
        setSelectedDay(null);
    };

    const handleStartWorkout = () => {
        if (selectedWorkout) {
            onStartWorkout(selectedWeek, selectedDay, selectedWorkout);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 pb-8 safe-bottom safe-top">
            {/* Header */}
            <header className="text-center mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                    {/* Menu Button (Left) */}
                    <div className="relative z-50">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                            aria-label="Menu"
                        >
                            <Menu className="w-5 h-5 text-slate-400" />
                        </button>
                        <MenuDropdown
                            isOpen={showMenu}
                            onClose={() => setShowMenu(false)}
                            onSelectSettings={() => setShowProgramSelector(true)}
                            onSelectHistory={() => setShowHistory(true)}
                        />
                    </div>

                    {/* Title (Center) */}
                    <div className="flex-1">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="relative">
                                <Mountain className="w-10 h-10 text-sky-400" />
                                <Snowflake className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                                Ski Prep Pro
                            </h1>
                        </div>
                    </div>

                    {/* Spacer (Right) */}
                    <div className="w-9"></div>
                </div>
                <p className="text-slate-400 text-sm">{selectedProgram?.name || 'Loading...'}</p>
            </header>

            {/* Phase Banner */}
            <div
                className={`glass-card p-4 mb-6 animate-slide-up bg-gradient-to-r ${phaseInfo.color} bg-opacity-20`}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/10">
                        <PhaseIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">{phaseInfo.name}</h2>
                        <p className="text-sm text-white/80">{phaseInfo.description}</p>
                    </div>
                </div>
            </div>

            {/* Week Selector */}
            <section className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    Select Week
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {weekKeys.map((weekKey) => {
                        const isSelected = selectedWeek === weekKey;
                        const weekNum = parseInt(weekKey.split("_")[1]);
                        const isPhase2 = weekNum > 3;

                        return (
                            <button
                                key={weekKey}
                                onClick={() => handleWeekChange(weekKey)}
                                className={`
                  p-3 rounded-xl font-medium transition-all duration-200
                  ${isSelected
                                        ? isPhase2
                                            ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                                            : "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                                    }
                `}
                            >
                                <span className="text-lg font-bold">{weekNum}</span>
                                <span className="block text-xs opacity-80">
                                    {isPhase2 ? "Power" : "Foundation"}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Day Selector */}
            <section className="mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Dumbbell className="w-4 h-4" />
                    Select Training Day
                </label>
                <div className="space-y-2">
                    {availableDays.map((day) => {
                        const isSelected = selectedDay === day;
                        const DayIcon = dayIcons[day];
                        const template = getWorkoutTemplate(selectedWeek, day);
                        const summary = getWorkoutSummary(template);

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`
                  w-full p-4 rounded-xl flex items-center justify-between transition-all duration-200
                  ${isSelected
                                        ? "glass-card border-sky-500/50 bg-sky-500/10"
                                        : "bg-slate-800/40 hover:bg-slate-800/60 border border-transparent"
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                    p-2.5 rounded-xl
                    ${isSelected ? "bg-sky-500/20 text-sky-400" : "bg-slate-700/50 text-slate-400"}
                  `}
                                    >
                                        <DayIcon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-white">{day}</div>
                                        <div className="text-xs text-slate-400">
                                            {dayDescriptions[day]} • {template?.name?.split(":")[1]?.trim()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right text-xs text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Timer className="w-3 h-3" />
                                            {summary.estimatedDurationFormatted}
                                        </div>
                                    </div>
                                    <ChevronRight
                                        className={`w-5 h-5 transition-transform ${isSelected ? "text-sky-400 translate-x-0.5" : "text-slate-600"
                                            }`}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Workout Preview */}
            {selectedWorkout && (
                <section
                    className="mb-6 glass-card p-4 animate-slide-up"
                    style={{ animationDelay: "0.3s" }}
                >
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-sky-400" />
                        Workout Preview
                    </h3>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">
                                {workoutSummary.exerciseCount}
                            </div>
                            <div className="text-xs text-slate-400">Exercises</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">
                                {workoutSummary.totalRounds}
                            </div>
                            <div className="text-xs text-slate-400">Total Rounds</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">
                                {formatTime(workoutSummary.estimatedDuration).split(":")[0]}
                            </div>
                            <div className="text-xs text-slate-400">Minutes</div>
                        </div>
                    </div>

                    {/* Blocks Preview */}
                    <div className="space-y-2">
                        {selectedWorkout.blocks.map((block, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between text-sm py-2 border-b border-slate-700/50 last:border-0"
                            >
                                <span className="text-slate-300">{block.name}</span>
                                <span className="text-slate-500">
                                    {block.rounds}x {block.drills.length} exercises
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Start Button */}
            <div className="mt-auto pt-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <button
                    onClick={handleStartWorkout}
                    disabled={!selectedWorkout}
                    className={`
            btn w-full py-4 text-lg font-bold
            ${selectedWorkout
                            ? "btn-primary animate-pulse-glow"
                            : "bg-slate-700 text-slate-500 cursor-not-allowed"
                        }
          `}
                >
                    {selectedWorkout ? (
                        <>
                            <Zap className="w-5 h-5" />
                            Start {selectedDay}'s Workout
                        </>
                    ) : (
                        "Select a Training Day"
                    )}
                </button>
            </div>

            {/* Footer */}
            <footer className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                    🎿 Ready for the slopes • Built for athletes
                </p>
            </footer>

            {/* Program Selector Modal */}
            {showProgramSelector && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 animate-fade-in" onClick={() => setShowProgramSelector(false)}>
                    <div
                        className="w-full max-w-lg bg-slate-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Change Program</h2>
                            <button
                                onClick={() => setShowProgramSelector(false)}
                                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <ProgramSelector
                            programs={availablePrograms}
                            selectedProgramId={selectedProgram?.id}
                            onSelect={handleProgramChange}
                        />
                    </div>
                </div>
            )}

            {/* History View Modal */}
            <HistoryView
                isOpen={showHistory}
                history={history}
                onClose={() => setShowHistory(false)}
                onDelete={deleteWorkout}
                onClearAll={clearHistory}
            />
        </div>
    );
}
