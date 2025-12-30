// 6-Week Ski Preparation Program Database
// All workout logic is driven by this data structure

export const workoutDatabase = {
    exercise_library: {
        cat_cow: {
            name: "Cat-Cow Stretch",
            instruction: "Move spine rhythmically. Breathe deeply.",
            visual_ref: "cat_cow.png",
        },
        dyn_ham_scoop: {
            name: "Dynamic Hamstring Scoop",
            instruction: "Step forward, heel down, scoop ground.",
            visual_ref: "ham_scoop.png",
        },
        hip_opener: {
            name: "Dynamic Hip Opener",
            instruction: "Deep lunge, rotate torso toward front knee.",
            visual_ref: "hip_opener.png",
        },
        goblet_sq_tempo: {
            name: "Tempo Goblet Squat",
            instruction: "4s down, 1s hold at bottom. Focus on depth.",
            visual_ref: "goblet_sq.png",
        },
        rdl_heavy: {
            name: "Romanian Deadlift",
            instruction: "Hinge hips back. Feel the hamstring stretch.",
            visual_ref: "rdl.png",
        },
        bulgarian_ss: {
            name: "Bulgarian Split Squat",
            instruction: "Back foot on bench. Control the descent.",
            visual_ref: "bulgarian.png",
        },
        pallof_press: {
            name: "Pallof Press",
            instruction: "Hold cable at chest, push out, resist rotation.",
            visual_ref: "pallof.png",
        },
        leg_press_sl: {
            name: "Single Leg Press",
            instruction: "Focus on the 'pushing away' and slow return.",
            visual_ref: "leg_press.png",
        },
        hamstring_curl: {
            name: "Hamstring Curl Machine",
            instruction: "Squeeze at top, 3s release (eccentric).",
            visual_ref: "curl.png",
        },
        cossack_sq: {
            name: "Cossack Squat",
            instruction: "Wide stance, sit into one heel. Alternating.",
            visual_ref: "cossack.png",
        },
        dead_bug: {
            name: "Dead Bug",
            instruction: "Opposite arm/leg move. Back glued to floor.",
            visual_ref: "dead_bug.png",
        },
        bosu_squat: {
            name: "BOSU Air Squat",
            instruction: "Stand on dome. Maintain balance.",
            visual_ref: "bosu_sq.png",
        },
        bosu_bridge: {
            name: "BOSU Hamstring Bridge",
            instruction: "Feet on dome, lift hips.",
            visual_ref: "bosu_bridge.png",
        },
        bosu_sl_bal: {
            name: "BOSU SL Balance",
            instruction: "30s per leg on the dome.",
            visual_ref: "bosu_bal.png",
        },
        bird_dog: {
            name: "Bird-Dog (on BOSU)",
            instruction: "Knees on dome. Extend opposite limbs.",
            visual_ref: "bird_dog.png",
        },
        plank_hold: {
            name: "Forearm Plank",
            instruction: "Keep glutes and core engaged.",
            visual_ref: "plank.png",
        },
        box_jump: {
            name: "Box Jump",
            instruction: "Explode up, land soft, step down.",
            visual_ref: "box_jump.png",
        },
        skater_hops: {
            name: "Skater Hops",
            instruction: "Lateral explosive jumps. Hold land 1s.",
            visual_ref: "skater.png",
        },
        nordic_drop: {
            name: "Nordic Hamstring Drop",
            instruction: "Lower torso slowly to floor using hams.",
            visual_ref: "nordic.png",
        },
        russian_twist: {
            name: "Weighted Russian Twist",
            instruction: "Rotate shoulders side to side.",
            visual_ref: "twist.png",
        },
        step_up: {
            name: "Weighted Step Up",
            instruction: "Drive through the heel, control the way down.",
            visual_ref: "step_up.png",
        },
        calf_raise: {
            name: "Calf Raises",
            instruction: "Full range of motion, pause at the top.",
            visual_ref: "calf_raise.png",
        },
    },

    workout_templates: {
        gym_monday_p1: {
            name: "Mon: Foundation Strength",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["cat_cow", "dyn_ham_scoop", "hip_opener"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "Circuit",
                    rounds: 4,
                    drills: ["goblet_sq_tempo", "rdl_heavy", "bulgarian_ss", "pallof_press"],
                    work_sec: 50,
                    rest_sec: 40,
                    block_rest: 60,
                },
                {
                    name: "Finisher",
                    rounds: 2,
                    drills: ["plank_hold", "dead_bug"],
                    work_sec: 60,
                    rest_sec: 20,
                    block_rest: 60,
                },
            ],
        },
        gym_wednesday_p1: {
            name: "Wed: Stability & Mobility",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["cat_cow", "cossack_sq", "hip_opener"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "Circuit",
                    rounds: 4,
                    drills: ["leg_press_sl", "hamstring_curl", "step_up", "dead_bug"],
                    work_sec: 50,
                    rest_sec: 40,
                    block_rest: 60,
                },
                {
                    name: "Finisher",
                    rounds: 3,
                    drills: ["calf_raise", "pallof_press"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 60,
                },
            ],
        },
        home_thursday_p1: {
            name: "Thu: Proprioception Base",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["cat_cow", "dyn_ham_scoop"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "BOSU Circuit",
                    rounds: 5,
                    drills: ["bosu_squat", "bosu_bridge", "bosu_sl_bal", "bird_dog"],
                    work_sec: 45,
                    rest_sec: 30,
                    block_rest: 60,
                },
            ],
        },
        gym_monday_p2: {
            name: "Mon: Explosive Power",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["cat_cow", "dyn_ham_scoop", "cossack_sq"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "Power Circuit",
                    rounds: 4,
                    drills: ["box_jump", "rdl_heavy", "skater_hops", "russian_twist"],
                    work_sec: 40,
                    rest_sec: 50,
                    block_rest: 60,
                },
                {
                    name: "Strength Finisher",
                    rounds: 2,
                    drills: ["goblet_sq_tempo", "plank_hold"],
                    work_sec: 50,
                    rest_sec: 30,
                    block_rest: 60,
                },
            ],
        },
        gym_wednesday_p2: {
            name: "Wed: Speed & Endurance",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["hip_opener", "dyn_ham_scoop", "cossack_sq"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "Circuit",
                    rounds: 4,
                    drills: ["leg_press_sl", "nordic_drop", "skater_hops", "pallof_press"],
                    work_sec: 45,
                    rest_sec: 45,
                    block_rest: 60,
                },
                {
                    name: "Core Burn",
                    rounds: 3,
                    drills: ["dead_bug", "russian_twist"],
                    work_sec: 50,
                    rest_sec: 10,
                    block_rest: 60,
                },
            ],
        },
        home_thursday_p2: {
            name: "Thu: Ski Endurance",
            blocks: [
                {
                    name: "Warmup",
                    rounds: 2,
                    drills: ["cat_cow", "cossack_sq"],
                    work_sec: 45,
                    rest_sec: 15,
                    block_rest: 30,
                },
                {
                    name: "Endurance Block",
                    rounds: 5,
                    drills: ["bosu_squat", "nordic_drop", "skater_hops", "bird_dog"],
                    work_sec: 50,
                    rest_sec: 30,
                    block_rest: 60,
                },
            ],
        },
        test_block_rest_example: {
            name: "Test: Block Rest Feature",
            blocks: [
                {
                    name: "Block 1",
                    rounds: 2,
                    drills: ["cat_cow"],
                    work_sec: 10,
                    rest_sec: 5,
                    block_rest: 30,
                },
                {
                    name: "Block 2",
                    rounds: 1,
                    drills: ["cat_cow"],
                    work_sec: 10,
                    rest_sec: 5,
                },
            ],
        },
    },

    program_schedule: {
        week_1: {
            Monday: "gym_monday_p1",
            Wednesday: "gym_wednesday_p1",
            Thursday: "home_thursday_p1",
        },
        week_2: {
            Monday: "gym_monday_p1",
            Wednesday: "gym_wednesday_p1",
            Thursday: "home_thursday_p1",
        },
        week_3: {
            Monday: "gym_monday_p1",
            Wednesday: "gym_wednesday_p1",
            Thursday: "home_thursday_p1",
        },
        week_4: {
            Monday: "gym_monday_p2",
            Wednesday: "gym_wednesday_p2",
            Thursday: "home_thursday_p2",
        },
        week_5: {
            Monday: "gym_monday_p2",
            Wednesday: "gym_wednesday_p2",
            Thursday: "home_thursday_p2",
        },
        week_6: {
            Monday: "gym_monday_p2",
            Wednesday: "gym_wednesday_p2",
            Thursday: "home_thursday_p2",
        },
    },
};

// Helper to get week keys
export const weekKeys = Object.keys(workoutDatabase.program_schedule);

// Helper to get available days for a week
export const getDaysForWeek = (weekKey) => {
    return Object.keys(workoutDatabase.program_schedule[weekKey]);
};

// Helper to get workout template for a specific week and day
export const getWorkoutTemplate = (weekKey, day) => {
    const templateId = workoutDatabase.program_schedule[weekKey]?.[day];
    if (!templateId) return null;
    return {
        id: templateId,
        ...workoutDatabase.workout_templates[templateId],
    };
};

// Helper to get exercise details by ID
export const getExercise = (exerciseId) => {
    return workoutDatabase.exercise_library[exerciseId] || null;
};
