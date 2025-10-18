import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '../StrikeWeightDesign.types';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useCallback, useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useSmoothedSerieLsr } from '@/components/charts/hooks/use-smoothed-serie-lsr';
import { useSmoothedSerieLoess } from '@/components/charts/hooks/use-smoothed-serie-loess';
import { useStrikeWeightCurve } from '@/hooks/standard-curves/use-strike-weight-curve';
import { useGenerateDesignedKeyboardFromSeries } from '@/hooks/keyboard/use-generate-designed-keyboard-from-series';
import { useInjection } from 'inversify-react';
import {
  strikeWeightCalculatorRequirementsSymbol,
  type StrikeWeightCalculatorRequirements,
} from '@/lib/piano/touch-design/strike-weight-calculator/strike-weight-calculator.requirements';

export const useStrikeWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
): {
  generateStrikeWeightTargetSerie: (
    mode: StrikeWeightDesignMode | null,
    target: StrikeWeightDesignTarget | null,
    frontWeightTargetSerie: TouchDesignSerie,
    strikeWeightRatioTargetSerie: TouchDesignSerie,
    supportSpringBalanceWeightTargetSerie: TouchDesignSerie,
  ) => TouchDesignSerie;
} => {
  const { getStrikeWeightCurve } = useStrikeWeightCurve(keyboard);
  const { generateSerie } = useGenerateSerie(keyboard);
  const { smoothLsr } = useSmoothedSerieLsr({
    referenceCurve: getStrikeWeightCurve(StrikeWeightLevel.Level5),
  });
  const { smoothLoess } = useSmoothedSerieLoess({
    bandwidthFraction: 1,
  });
  const strikeWeightCalculator =
    useInjection<StrikeWeightCalculatorRequirements>(
      strikeWeightCalculatorRequirementsSymbol,
    );
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(keyboard);

  const name = 'Target';
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const generateStrikeWeightTargetSerie = useCallback(
    (
      mode: StrikeWeightDesignMode | null,
      target: StrikeWeightDesignTarget | null,
      frontWeightTargetSerie: TouchDesignSerie,
      strikeWeightRatioTargetSerie: TouchDesignSerie,
      supportSpringBalanceWeightTargetSerie: TouchDesignSerie,
    ) => {
      if (mode === StrikeWeightDesignMode.AsMeasured) {
        return generateSerie((key) => key.payload.strikeWeight, name, variant);
      }

      if (target === null) {
        return nullTargetSerie;
      }

      if (
        mode === StrikeWeightDesignMode.StandardCurves &&
        Object.values<StrikeWeightDesignTarget>(StrikeWeightLevel).includes(
          target,
        )
      ) {
        const strikeWeightLevel = target as StrikeWeightLevel;
        const curve = getStrikeWeightCurve(strikeWeightLevel);
        return generateSerie(
          (key) => curve?.[key.number - 1] ?? null,
          name,
          variant,
        );
      }

      const baseSerie = generateSerie(
        (key) => key.payload.strikeWeight,
        name,
        variant,
      );

      if (target === SmoothStrategy.LeastSquaresRegression) {
        return smoothLsr(baseSerie);
      }

      if (target === SmoothStrategy.Loess) {
        return smoothLoess(baseSerie);
      }

      if (mode === StrikeWeightDesignMode.Computed && target !== null) {
        const keyboardWithTargetedStrikeWeight =
          generateDesignedKeyboardFromSeries({
            frontWeightTargetSerie,
            strikeWeightRatioTargetSerie,
            strikeWeightTargetSerie: nullTargetSerie,
            supportSpringBalanceWeightTargetSerie,
          }).map((key) =>
            strikeWeightCalculator.calculateStrikeWeight(key, Number(target)),
          );
        return generateSerie(
          (key) =>
            keyboardWithTargetedStrikeWeight.getKeyByNumber(key.number)?.payload
              .strikeWeight ?? null,
          name,
          variant,
        );
      }

      return nullTargetSerie;
    },
    [
      generateDesignedKeyboardFromSeries,
      generateSerie,
      getStrikeWeightCurve,
      nullTargetSerie,
      smoothLoess,
      smoothLsr,
      strikeWeightCalculator,
      variant,
    ],
  );

  return { generateStrikeWeightTargetSerie };
};
