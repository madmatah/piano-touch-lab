import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import type { FrontWeightDesignTarget } from '../FrontWeightDesign.types';
import { useTranslation } from 'react-i18next';
import { useInterpolatedSerieCubicSpline } from '@/hooks/series/use-interpolated-serie-cubic-spline';
import { generateCustomFrontWeightKeypoints } from '@/lib/piano/touch-design/generate-custom-front-weight-keypoints';

export const useFrontWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  target: FrontWeightDesignTarget | null,
): { targetSerie: TouchDesignSerie | null } => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);
  const { generateCubicInterpolatedKeyboardSerie } =
    useInterpolatedSerieCubicSpline(keyboard);

  const name = t('Target');
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const targetSerie = useMemo(() => {
    if (target === null) {
      return nullTargetSerie;
    }

    const targetNumber = Number(target);
    if (!isNaN(targetNumber)) {
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
    generateCubicInterpolatedKeyboardSerie,
    generateSerie,
    name,
    nullTargetSerie,
    target,
    variant,
  ]);

  return { targetSerie };
};
