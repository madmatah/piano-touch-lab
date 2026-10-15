import { useCallback, useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { useGenerateSerie } from '../../hooks/use-generate-serie';
import type { TouchDesignSerie } from '../../interfaces';
import { TouchDesignSerieVariant } from '../../KeyboardChart';

/** The four quantities of the figure, in the order the legend lists them. */
export const TOUCH_WEIGHT_SERIE_IDS = [
  'down',
  'up',
  'balance',
  'friction',
] as const;

export type TouchWeightSerieId = (typeof TOUCH_WEIGHT_SERIE_IDS)[number];

export type TouchWeightSeries = Record<TouchWeightSerieId, TouchDesignSerie>;

/**
 * What the static balance figure draws: down and up weight, the balance
 * between them, and the friction that separates them.
 *
 * Series are kept whole — one entry per key, gaps included — so the rail
 * beside the chart can read a key off the very series that was drawn.
 */
export const useTouchWeightSeries = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
  useSupportSpringMeasurements = true,
): TouchWeightSeries => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(analyzedKeyboard);

  // What a support spring already carries is taken off the weight the
  // technician feels at the key, so the figure reads as the action behaves.
  const withoutSpringSupport = useCallback(
    (weight: OptionalNumber, supportSpringBalanceWeight: OptionalNumber) => {
      const supported = useSupportSpringMeasurements
        ? (supportSpringBalanceWeight ?? 0)
        : 0;
      return weight ? weight - supported : null;
    },
    [useSupportSpringMeasurements],
  );

  return useMemo(
    () => ({
      balance: generateSerie(
        (key) =>
          withoutSpringSupport(
            key.payload.balanceWeight,
            key.payload.supportSpringBalanceWeight,
          ),
        t('Balance'),
        TouchDesignSerieVariant.Measured,
      ),
      down: generateSerie(
        (key) =>
          withoutSpringSupport(
            key.payload.downWeightWithoutSpringSupport,
            key.payload.supportSpringBalanceWeight,
          ),
        t('Down'),
        TouchDesignSerieVariant.Measured,
      ),
      // Friction is the half-difference of the two weights: the springs cancel
      // out of it, hence no correction here.
      friction: generateSerie(
        (key) => key.payload.frictionWeight,
        t('Friction'),
        TouchDesignSerieVariant.Measured,
      ),
      up: generateSerie(
        (key) =>
          withoutSpringSupport(
            key.payload.upWeight,
            key.payload.supportSpringBalanceWeight,
          ),
        t('Up'),
        TouchDesignSerieVariant.Measured,
      ),
    }),
    [generateSerie, t, withoutSpringSupport],
  );
};
