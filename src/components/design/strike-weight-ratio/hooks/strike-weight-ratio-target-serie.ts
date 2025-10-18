import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useCallback, useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '../StrikeWeightRatioDesign.types';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useSmoothedSerieAverage } from '@/components/charts/hooks/use-smoothed-serie-average';
import { useTranslation } from '@/hooks/use-translation';

export const useStrikeWeightRatioTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
): {
  generateStrikeWeightRatioTargetSerie: (
    mode: StrikeWeightRatioDesignMode | null,
    target: StrikeWeightRatioDesignTarget | null,
  ) => TouchDesignSerie;
} => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);
  const { smoothMean, smoothMedian } = useSmoothedSerieAverage();

  const name = t('Target');
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const generateStrikeWeightRatioTargetSerie = useCallback(
    (
      mode: StrikeWeightRatioDesignMode | null,
      target: StrikeWeightRatioDesignTarget | null,
    ): TouchDesignSerie => {
      if (mode === StrikeWeightRatioDesignMode.AsMeasured) {
        return generateSerie(
          (key) => key.payload.strikeWeightRatio,
          name,
          variant,
        );
      }

      if (
        mode === StrikeWeightRatioDesignMode.FixedValue &&
        target !== null &&
        !isNaN(target as number)
      ) {
        return generateSerie(() => target as number, name, variant);
      }

      const baseSerie = generateSerie(
        (key) => key.payload.strikeWeightRatio,
        name,
        variant,
      );

      if (
        mode === StrikeWeightRatioDesignMode.Smoothed &&
        target === SmoothStrategy.Mean
      ) {
        return smoothMean(baseSerie);
      }

      if (
        mode === StrikeWeightRatioDesignMode.Smoothed &&
        target === SmoothStrategy.Median
      ) {
        return smoothMedian(baseSerie);
      }

      return nullTargetSerie;
    },
    [nullTargetSerie, generateSerie, name, variant, smoothMean, smoothMedian],
  );

  return { generateStrikeWeightRatioTargetSerie };
};
