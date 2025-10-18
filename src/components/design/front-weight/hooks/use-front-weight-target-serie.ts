import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import {
  FrontWeightDesignMode,
  type FrontWeightDesignTarget,
} from '../FrontWeightDesign.types';
import { useTranslation } from 'react-i18next';
import { useInterpolatedSerieCubicSpline } from '@/hooks/series/use-interpolated-serie-cubic-spline';
import { generateCustomFrontWeightKeypoints } from '@/lib/piano/touch-design/generate-custom-front-weight-keypoints';
import { useWippenSupportSpringsTargetSerie } from '../../wippen-support-springs/hooks/use-wippen-support-springs-target-serie';
import {
  useStrikeWeightDesign,
  useStrikeWeightRatioDesign,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';
import { useStrikeWeightRatioTargetSerie } from '../../strike-weight-ratio/hooks/strike-weight-ratio-target-serie';
import { useStrikeWeightTargetSerie } from '../../strike-weight/hooks/use-strike-weight-target-serie';
import { useGenerateDesignedKeyboardFromSeries } from '@/hooks/keyboard/use-generate-designed-keyboard-from-series';
import {
  frontWeightCalculatorRequirementsSymbol,
  type FrontWeightCalculatorRequirements,
} from '@/lib/piano/touch-design/front-weight-calculator/front-weight-calculator.requirements';
import { useInjection } from 'inversify-react';

export const useFrontWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  mode: FrontWeightDesignMode | null,
  target: FrontWeightDesignTarget | null,
): { targetSerie: TouchDesignSerie } => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);
  const { generateCubicInterpolatedKeyboardSerie } =
    useInterpolatedSerieCubicSpline(keyboard);
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(keyboard);
  const frontWeightCalculator = useInjection<FrontWeightCalculatorRequirements>(
    frontWeightCalculatorRequirementsSymbol,
  );

  const { strikeWeightDesignMode, strikeWeightDesignTarget } =
    useStrikeWeightDesign();
  const { targetSerie: strikeWeightTargetSerie } = useStrikeWeightTargetSerie(
    keyboard,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
  );
  const { strikeWeightRatioDesignMode, strikeWeightRatioDesignTarget } =
    useStrikeWeightRatioDesign();
  const { targetSerie: strikeWeightRatioTargetSerie } =
    useStrikeWeightRatioTargetSerie(
      keyboard,
      strikeWeightRatioDesignMode,
      strikeWeightRatioDesignTarget,
    );
  const { wippenSupportSpringsDesignMode, wippenSupportSpringsDesignTarget } =
    useWippenSupportSpringsDesign();
  const { targetSerie: supportSpringBalanceWeightTargetSerie } =
    useWippenSupportSpringsTargetSerie(
      keyboard,
      wippenSupportSpringsDesignMode,
      wippenSupportSpringsDesignTarget,
    );

  const name = t('Target');
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const targetSerie = useMemo(() => {
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
  }, [
    frontWeightCalculator,
    generateCubicInterpolatedKeyboardSerie,
    generateDesignedKeyboardFromSeries,
    generateSerie,
    mode,
    name,
    nullTargetSerie,
    strikeWeightRatioTargetSerie,
    strikeWeightTargetSerie,
    supportSpringBalanceWeightTargetSerie,
    target,
    variant,
  ]);

  return { targetSerie };
};
