import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useCallback, useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import {
  FrontWeightDesignMode,
  type FrontWeightDesignTarget,
} from '../FrontWeightDesign.types';
import { useInterpolatedSerieCubicSpline } from '@/hooks/series/use-interpolated-serie-cubic-spline';
import { generateCustomFrontWeightKeypoints } from '@/lib/piano/touch-design/generate-custom-front-weight-keypoints';
import { useGenerateDesignedKeyboardFromSeries } from '@/hooks/keyboard/use-generate-designed-keyboard-from-series';
import {
  frontWeightCalculatorRequirementsSymbol,
  type FrontWeightCalculatorRequirements,
} from '@/lib/piano/touch-design/front-weight-calculator/front-weight-calculator.requirements';
import { useInjection } from 'inversify-react';
import { useTranslation } from '@/hooks/use-translation';

export const useFrontWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
): {
  generateFrontWeightTargetSerie: (
    mode: FrontWeightDesignMode | null,
    target: FrontWeightDesignTarget | null,
    strikeWeightTargetSerie: TouchDesignSerie,
    strikeWeightRatioTargetSerie: TouchDesignSerie,
    supportSpringBalanceWeightTargetSerie: TouchDesignSerie,
  ) => TouchDesignSerie;
} => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);
  const { generateCubicInterpolatedKeyboardSerie } =
    useInterpolatedSerieCubicSpline(keyboard);
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(keyboard);
  const frontWeightCalculator = useInjection<FrontWeightCalculatorRequirements>(
    frontWeightCalculatorRequirementsSymbol,
  );

  const name = t('Target');
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const generateFrontWeightTargetSerie = useCallback(
    (
      mode: FrontWeightDesignMode | null,
      target: FrontWeightDesignTarget | null,
      strikeWeightTargetSerie: TouchDesignSerie,
      strikeWeightRatioTargetSerie: TouchDesignSerie,
      supportSpringBalanceWeightTargetSerie: TouchDesignSerie,
    ): TouchDesignSerie => {
      if (mode === FrontWeightDesignMode.AsMeasured) {
        return generateSerie((key) => key.payload.frontWeight, name, variant);
      }

      if (mode === FrontWeightDesignMode.Computed && target !== null) {
        const keyboardWithTargetedFrontWeight =
          generateDesignedKeyboardFromSeries({
            frontWeightTargetSerie: nullTargetSerie,
            strikeWeightRatioTargetSerie,
            strikeWeightTargetSerie,
            supportSpringBalanceWeightTargetSerie,
          }).map((key) =>
            frontWeightCalculator.calculateFrontWeight(key, Number(target)),
          );
        return generateSerie(
          (key) =>
            keyboardWithTargetedFrontWeight.getKeyByNumber(key.number)?.payload
              .frontWeight ?? null,
          name,
          variant,
        );
      }

      const targetNumber = Number(target);
      if (
        mode === FrontWeightDesignMode.StandardCurves &&
        target !== null &&
        !isNaN(targetNumber)
      ) {
        const frontWeightCurve = generateCubicInterpolatedKeyboardSerie(
          generateCustomFrontWeightKeypoints(targetNumber),
        );
        return generateSerie(
          (key) => frontWeightCurve[key.number - 1] ?? null,
          name,
          variant,
        );
      }

      return nullTargetSerie;
    },
    [
      frontWeightCalculator,
      generateCubicInterpolatedKeyboardSerie,
      generateDesignedKeyboardFromSeries,
      generateSerie,
      name,
      nullTargetSerie,
      variant,
    ],
  );

  return { generateFrontWeightTargetSerie };
};
