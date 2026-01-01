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

/**
 * Get the image URL for an exercise
 * @param {string} exerciseId - The exercise ID from the database
 * @returns {string|null} - The image URL or null if not found
 */
export const getExerciseImage = (exerciseId) => {
    return exerciseImages[exerciseId] || null;
};
