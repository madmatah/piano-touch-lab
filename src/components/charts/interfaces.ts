import type { KeyWith } from '@/lib/piano/keyboard';
import type { TouchDesignSerieVariant } from './KeyboardChart';

export type TouchDesignDataPoint = KeyWith<number | undefined>;

export interface TouchDesignSerie {
  name: string;
  data: readonly TouchDesignDataPoint[];
  variant?: TouchDesignSerieVariant;
  color?: string;
}

/**
 * What a chart hands to the rail beside it: the key being read, and the very
 * series it drew, so the two can never disagree.
 */
export interface ChartReadingContext {
  hoveredKey: number | null;
  measuredSerie: TouchDesignSerie;
  /** The standard curves, named `FW#5`, `SW#1`… */
  referenceSeries: TouchDesignSerie[];
}

/** Every value the given series actually carry, in no particular order. */
export const serieValues = (
  series: readonly (TouchDesignSerie | undefined)[],
): number[] =>
  series.flatMap((serie) =>
    (serie?.data ?? []).flatMap((point) =>
      point.payload === undefined ? [] : [point.payload],
    ),
  );

/** The value a series carries on one key, or null when it carries none. */
export const serieValueAt = (
  serie: TouchDesignSerie | undefined,
  keyNumber: number | null,
): number | null => {
  if (!serie || keyNumber === null) {
    return null;
  }
  const point = serie.data.find((item) => item.number === keyNumber);
  return point?.payload ?? null;
};
