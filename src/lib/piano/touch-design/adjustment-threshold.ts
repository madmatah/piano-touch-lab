/**
 * Below this, a change is not worth a trip to the bench.
 *
 * A bench rule rather than a display one: the sheet prints it in its own
 * legend, the cells call a key "unchanged" by it, and the summary tiles count
 * by it. One number, so the three can never state different things.
 */
export const ADJUSTMENT_THRESHOLD = 0.1;
