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
};

/**
 * Get the image URL for an exercise
 * @param {string} exerciseId - The exercise ID from the database
 * @returns {string|null} - The image URL or null if not found
 */
export const getExerciseImage = (exerciseId) => {
    return exerciseImages[exerciseId] || null;
};
