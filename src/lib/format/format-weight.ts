/**
 * How numbers are written on screen.
 *
 * Weights are read next to each other down a column, so they are always given
 * to the same precision, and the French locale wants a comma. `Intl` emits a
 * hyphen-minus for negatives; in JetBrains Mono that glyph is visibly shorter
 * than the real minus sign, which breaks the alignment of a column of signed
 * values, so it is swapped here — at the one point where a number becomes text.
 */

const MINUS_SIGN = '−';

const withRealMinus = (text: string) => text.replace('-', MINUS_SIGN);

export const EMPTY_VALUE = '—';

/**
 * Between a number and its unit: a space a line never breaks at. A narrow
 * box — a tile, a printed summary — otherwise sends the g to a line of its
 * own, under a figure that no longer says what it counts.
 */
const UNIT_SPACE = '\u00a0';

const format = (
  value: number | null | undefined,
  locale: string,
  options: Intl.NumberFormatOptions,
): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return EMPTY_VALUE;
  }
  return withRealMinus(new Intl.NumberFormat(locale, options).format(value));
};

/** A weight to a tenth, with no unit: for a column whose header carries it. */
export const formatWeightValue = (
  value: number | null | undefined,
  locale: string,
): string =>
  format(value, locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });

/** A weight in grams, to a tenth: `4,1 g`. */
export const formatGrams = (
  value: number | null | undefined,
  locale: string,
): string => {
  const formatted = formatWeightValue(value, locale);
  return formatted === EMPTY_VALUE ? formatted : `${formatted}${UNIT_SPACE}g`;
};

/** A weight a technician sets rather than reads, in whole grams: `39 g`. */
export const formatWholeGrams = (
  value: number | null | undefined,
  locale: string,
): string => {
  const formatted = format(value, locale, { maximumFractionDigits: 0 });
  return formatted === EMPTY_VALUE ? formatted : `${formatted}${UNIT_SPACE}g`;
};

/** A weight to add or remove, with its sign always shown and no unit: `+15,1`. */
export const formatSignedWeightValue = (
  value: number | null | undefined,
  locale: string,
): string =>
  format(value, locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    signDisplay: 'always',
  });

/** A weight to add or remove, with its sign always shown: `+15,1 g`. */
export const formatSignedGrams = (
  value: number | null | undefined,
  locale: string,
): string => {
  const formatted = formatSignedWeightValue(value, locale);
  return formatted === EMPTY_VALUE ? formatted : `${formatted}${UNIT_SPACE}g`;
};

/** A leverage ratio, to a hundredth and without a unit: `6,20`. */
export const formatRatio = (
  value: number | null | undefined,
  locale: string,
): string =>
  format(value, locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

/** A signed ratio: `−0,25`. */
export const formatSignedRatio = (
  value: number | null | undefined,
  locale: string,
): string =>
  format(value, locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'always',
  });

/** A plain number for a chart axis: `5,5`, `40`. */
export const formatAxisValue = (
  value: number,
  locale: string,
  decimals = 0,
): string =>
  format(value, locale, {
    maximumFractionDigits: Math.max(decimals, 2),
    minimumFractionDigits: decimals,
  });
