import { useCallback } from 'react';

import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import {
  serieValueAt,
  type ChartReadingContext,
  type TouchDesignSerie,
} from '@/components/charts/interfaces';
import { useTranslation } from '@/hooks/use-translation';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

type Format = (value: number | null, locale: string) => string;

export interface TargetReadingOptions {
  keyboard: TouchWeightAnalyzedKeyboard;
  targetSerie: TouchDesignSerie | null | undefined;
  /** How a value of this quantity is written: in grams, or as a ratio. */
  format: Format;
  /** How the difference is written, its sign always shown. */
  formatDifference: Format;
  /**
   * From the measured value to the target. A plain subtraction unless the
   * quantity is one the bench sheet prints, which works it out its own way.
   */
  difference?: (
    measured: number | null,
    target: number | null,
  ) => number | null;
}

const subtract = (measured: number | null, target: number | null) =>
  measured === null || target === null ? null : target - measured;

/**
 * The reading of a design figure: what the design sets the key under the
 * pointer to, what it measures today, and the difference between the two.
 *
 * Hovering a design figure used to open the chart's own tooltip with these;
 * the figures lost it for the reading strip of Analyze, and the strip was
 * never wired to them.
 */
export const useTargetReading = ({
  difference = subtract,
  format,
  formatDifference,
  keyboard,
  targetSerie,
}: TargetReadingOptions) => {
  const { currentLanguage, t } = useTranslation();

  return useCallback(
    ({ hoveredKey, measuredSerie }: ChartReadingContext) => {
      const target = serieValueAt(targetSerie ?? undefined, hoveredKey);
      const measured = serieValueAt(measuredSerie, hoveredKey);

      return (
        <KeyReadingStrip
          reading={{
            keyNumber: hoveredKey,
            noteName: keyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
            rows: [
              {
                isAccent: true,
                label: t('Target'),
                value: format(target, currentLanguage),
              },
              {
                label: t('Measured'),
                value: format(measured, currentLanguage),
              },
              {
                label: t('Difference'),
                value: formatDifference(
                  difference(measured, target),
                  currentLanguage,
                ),
              },
            ],
          }}
        />
      );
    },
    [
      currentLanguage,
      difference,
      format,
      formatDifference,
      keyboard,
      t,
      targetSerie,
    ],
  );
};
