/**
 * Below this, a change is not worth a trip to the bench.
 *
 * A bench rule rather than a display one: the sheet prints it in its own
 * legend, the cells call a key "unchanged" by it, and the summary tiles count
 * by it. One number, so the three can never state different things.
 */
export const ADJUSTMENT_THRESHOLD = 0.1;

const TENTHS = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  useGrouping: false,
});

/**
 * A weight as the sheet prints it, to the tenth of a gram.
 *
 * Rounded by the same `Intl.NumberFormat` that writes it on screen, which
 * rounds the shortest decimal form of a number half away from zero. Neither
 * `Math.round` nor `toFixed` agrees with it at every half: they print 22.95
 * as 22.9 and −7.85 as −7.8, where the sheet reads 23.0 and −7.9.
 */
const asPrinted = (weight: number): number => Number(TENTHS.format(weight));

/**
 * The change a technician makes at the bench, worked out from the two weights
 * as the sheet prints them.
 *
 * Rounding the reading, the target and their difference each on its own
 * leaves a row in six where the printed reading plus the printed change misses
 * the printed target by a tenth — and the technician at the bench adds what is
 * printed. Null when either weight is unknown.
 */
export const benchAdjustment = (
  actual: number | null,
  target: number | null,
): number | null =>
  actual === null || target === null
    ? null
    : asPrinted(asPrinted(target) - asPrinted(actual));

/** Whether a bench change is worth making at all. */
export const isWorthAdjusting = (adjustment: number | null): boolean =>
  adjustment !== null && Math.abs(adjustment) >= ADJUSTMENT_THRESHOLD;
