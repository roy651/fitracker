// Exercise illustration imports
// Line drawing style sketches for each exercise

import catCow from './cat_cow.png';
import hamScoop from './ham_scoop.png';
import hipOpener from './hip_opener.png';
import gobletSq from './goblet_sq.png';
import rdl from './rdl.png';
import bulgarian from './bulgarian.png';
import pallof from './pallof.png';
import legPress from './leg_press.png';
import curl from './curl.png';
import cossack from './cossack.png';
import deadBug from './dead_bug.png';
import bosuSq from './bosu_sq.png';
import bosuBridge from './bosu_bridge.png';
import bosuBal from './bosu_bal.png';
import birdDog from './bird_dog.png';
import plank from './plank.png';
import boxJump from './box_jump.png';
import skater from './skater.png';
import nordic from './nordic.png';
import twist from './twist.png';
import stepUp from './step_up.png';
import calfRaise from './calf_raise.png';

// Enhanced Ski Program - New Images (Week 2+)
import hipCircles from './hip_circles.png';
import worldGreatest from './world_greatest.png';
import gluteBridgeDyn from './glute_bridge_dyn.png';
import lateralLungeDyn from './lateral_lunge_dyn.png';
import legSwings from './leg_swings.png';
import ankleCircles from './ankle_circles.png';
import flow9090 from './90_90_flow.png';
import slRdl from './sl_rdl.png';
import lateralLunge from './lateral_lunge.png';
import bandWalks from './band_walks.png';
import fireHydrant from './fire_hydrant.png';
import hollowHold from './hollow_hold.png';
import superman from './superman.png';
import sidePlank from './side_plank.png';
import shoulderTaps from './shoulder_taps.png';
import bicycleCrunch from './bicycle_crunch.png';
// Placeholders for future weeks if not generated yet (mapped to best available match)
// Will be updated as images are generated

// Combat Training Program Imports
import benchPress from './bench_press.png';
import weightedPullup from './weighted_pullup.png';
import latPulldown from './lat_pulldown.png';
import overheadPress from './overhead_press.png';
import tbarRow from './tbar_row.png';
import dumbbellRow from './dumbbell_row.png';
import weightedPlank from './weighted_plank.png';
import hangingLegRaise from './hanging_leg_raise.png';
import backSquat from './back_squat.png';
import rdlCombat from './rdl_combat.png';
import vo2maxIntervals from './vo2max_intervals.png';
import weightedDips from './weighted_dips.png';
import seatedCableRow from './seated_cable_row.png';
import declinePushup from './decline_pushup.png';
import bicepCurl from './bicep_curl.png';
import tricepExtension from './tricep_extension.png';
import walkingLunge from './walking_lunge.png';
import legExtension from './leg_extension.png';
import legCurlMachine from './leg_curl_machine.png';
import zone2Run from './zone2_run.png';
import zone2RunLong from './zone2_run_long.png';
import longWalk from './long_walk.png';



/**
 * Map of exercise IDs to their illustration image paths
 */
export const exerciseImages = {
    cat_cow: catCow,
    dyn_ham_scoop: hamScoop,
    hip_opener: hipOpener,
    goblet_sq_tempo: gobletSq,
    rdl_heavy: rdl,
    bulgarian_ss: bulgarian,
    pallof_press: pallof,
    leg_press_sl: legPress,
    hamstring_curl: curl,
    cossack_sq: cossack,
    dead_bug: deadBug,
    bosu_squat: bosuSq,
    bosu_bridge: bosuBridge,
    bosu_sl_bal: bosuBal,
    bird_dog: birdDog,
    plank_hold: plank,
    box_jump: boxJump,
    skater_hops: skater,
    nordic_drop: nordic,
    russian_twist: twist,
    step_up: stepUp,
    calf_raise: calfRaise,

    // Enhanced Ski Program - New Exercises
    hip_circles: hipCircles,
    world_greatest: worldGreatest,
    glute_bridge_dyn: gluteBridgeDyn,
    lateral_lunge_dyn: lateralLungeDyn,
    leg_swings: legSwings,
    ankle_circles: ankleCircles,
    "90_90_flow": flow9090,
    sl_rdl: slRdl,
    lateral_lunge: lateralLunge,
    band_walks: bandWalks,
    fire_hydrant: fireHydrant,
    hollow_hold: hollowHold,
    superman: superman,
    side_plank: sidePlank,
    shoulder_taps: shoulderTaps,
    bicycle_crunch: bicycleCrunch,
    tuck_hold: plank, // Placeholder (similar static hold)
    single_leg_squat: bulgarian, // Placeholder
    knee_to_wall: calfRaise, // Placeholder
    ankle_edge_drill: calfRaise, // Placeholder
    shin_raises: calfRaise, // Placeholder
    lateral_hops: skater, // Placeholder
    drop_jump: boxJump, // Placeholder
    jump_squat: gobletSq, // Placeholder
    lateral_box_jump: boxJump, // Placeholder
    quick_feet_turns: skater, // Placeholder
    tricep_dips: weightedDips, // Placeholder
    renegade_row: dumbbellRow, // Placeholder
    plank_reach: plank, // Placeholder
    copen_plank: sidePlank, // Placeholder
    prone_y_raise: superman, // Placeholder
    a_skips: highKneesMock || legSwings, // Fallback logic handled below
    arm_circles: hipCircles, // Placeholder
    thoracic_rotation: twist, // Placeholder
    wall_ankle_mob: calfRaise, // Placeholder
    squat_hip_rotation: cossack, // Placeholder

    // Combat Training Program Mappings
    bench_press: benchPress,
    weighted_pullup: weightedPullup,
    lat_pulldown: latPulldown,
    overhead_press: overheadPress,
    tbar_row: tbarRow,
    dumbbell_row: dumbbellRow,
    weighted_plank: weightedPlank,
    hanging_leg_raise: hangingLegRaise,
    back_squat: backSquat,
    rdl_combat: rdlCombat,
    vo2max_intervals: vo2maxIntervals,
    weighted_dips: weightedDips,
    seated_cable_row: seatedCableRow,
    decline_pushup: declinePushup,
    bicep_curl: bicepCurl,
    tricep_extension: tricepExtension,
    walking_lunge: walkingLunge,
    leg_extension: legExtension,
    leg_curl_machine: legCurlMachine,
    zone2_run: zone2Run,
    zone2_run_short: zone2Run,
    zone2_run_long: zone2RunLong,
    long_walk: longWalk,

    // Mobility & Recovery Placeholders (reusing existing assets)
    hip_mobility: hipOpener,
    ankle_mobility: calfRaise,
    static_stretching: hamScoop,
};

// Fallback logic for missing direct imports in the map above
const highKneesMock = legSwings;

/**
 * Get the image URL for an exercise
 * @param {string} exerciseId - The exercise ID from the database
 * @returns {string|null} - The image URL or null if not found
 */
export const getExerciseImage = (exerciseId) => {
    return exerciseImages[exerciseId] || null;
};
