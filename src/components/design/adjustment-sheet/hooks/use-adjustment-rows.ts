import { useMemo } from 'react';

import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import type { KeyAdjustmentPayload } from '../AdjustmentSheet.types';

/** Below this, a change is not worth a trip to the bench. */
export const ADJUSTMENT_THRESHOLD = 0.1;

export interface AdjustmentSummary {
  /** Keys whose front weight moves by at least the threshold. */
  frontWeightCount: number;
  frontWeightMean: number | null;
  hasSprings: boolean;
  /** Hammers whose strike weight moves by at least the threshold. */
  strikeWeightCount: number;
  strikeWeightMax: number | null;
  strikeWeightMin: number | null;
  strikeWeightUnchanged: number;
  springFirstKey: number | null;
  springLastKey: number | null;
  springCount: number;
}

export interface AdjustmentRows {
  keyboard: KeyboardLike<KeyWith<KeyAdjustmentPayload | null>>;
  summary: AdjustmentSummary;
}

const difference = (actual: number | null, target: number | null) =>
  actual === null || target === null ? null : target - actual;

const moved = (value: number | null) =>
  value !== null && Math.abs(value) >= ADJUSTMENT_THRESHOLD;

/**
 * The sheet, and the three figures that summarise it.
 *
 * Both are derived here so that the tiles at the top of the page can never
 * disagree with the rows underneath them.
 */
export const useAdjustmentRows = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
  designedKeyboard: TouchWeightAnalyzedKeyboard,
): AdjustmentRows => {
  const keyboard = useMemo(
    () =>
      analyzedKeyboard.map((analyzedKey): KeyAdjustmentPayload | null => {
        const designedKey = designedKeyboard.getKeyByNumber(analyzedKey.number);
        const actualFrontWeight = analyzedKey.payload.frontWeight ?? null;
        const actualStrikeWeight = analyzedKey.payload.strikeWeight ?? null;
        const targetFrontWeight = designedKey?.payload.frontWeight ?? null;
        const targetStrikeWeight = designedKey?.payload.strikeWeight ?? null;

        if (
          actualFrontWeight === null ||
          actualStrikeWeight === null ||
          targetFrontWeight === null ||
          targetStrikeWeight === null
        ) {
          return null;
        }

        return {
          actualFrontWeight,
          actualStrikeWeight,
          actualSupportSpringBalanceWeight:
            analyzedKey.payload.supportSpringBalanceWeight ?? null,
          targetFrontWeight,
          targetStrikeWeight,
          targetSupportSpringBalanceWeight:
            designedKey?.payload.supportSpringBalanceWeight ?? null,
        };
      }),
    [analyzedKeyboard, designedKeyboard],
  );

  const summary = useMemo<AdjustmentSummary>(() => {
    const rows = keyboard.getKeys();

    const frontWeightDifferences = rows
      .map((row) =>
        difference(
          row.payload?.actualFrontWeight ?? null,
          row.payload?.targetFrontWeight ?? null,
        ),
      )
      .filter(moved) as number[];

    const strikeWeightDifferences = rows
      .map((row) =>
        difference(
          row.payload?.actualStrikeWeight ?? null,
          row.payload?.targetStrikeWeight ?? null,
        ),
      )
      .filter(moved) as number[];

    const springKeys = rows.filter(
      (row) => (row.payload?.targetSupportSpringBalanceWeight ?? null) !== null,
    );

    return {
      frontWeightCount: frontWeightDifferences.length,
      frontWeightMean:
        frontWeightDifferences.length === 0
          ? null
          : frontWeightDifferences.reduce((total, value) => total + value, 0) /
            frontWeightDifferences.length,
      hasSprings: springKeys.length > 0,
      springCount: springKeys.length,
      springFirstKey: springKeys[0]?.number ?? null,
      springLastKey: springKeys[springKeys.length - 1]?.number ?? null,
      strikeWeightCount: strikeWeightDifferences.length,
      strikeWeightMax:
        strikeWeightDifferences.length === 0
          ? null
          : Math.max(...strikeWeightDifferences),
      strikeWeightMin:
        strikeWeightDifferences.length === 0
          ? null
          : Math.min(...strikeWeightDifferences),
      strikeWeightUnchanged: rows.length - strikeWeightDifferences.length,
    };
  }, [keyboard]);

  return { keyboard, summary };
};
