import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '../StrikeWeightDesign.types';
import { strikeWeightData } from '@/lib/piano/touch-design/data/strike-weight';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useSmoothedSerieLsr } from '@/components/charts/hooks/use-smoothed-serie-lsr';
import { useSmoothedSerieLoess } from '@/components/charts/hooks/use-smoothed-serie-loess';

export const useStrikeWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  mode: StrikeWeightDesignMode | null,
  target: StrikeWeightDesignTarget | null,
): { targetSerie: TouchDesignSerie | null } => {
  const { generateSerie } = useGenerateSerie(keyboard);
  const { smoothLsr } = useSmoothedSerieLsr({
    referenceCurve: strikeWeightData[StrikeWeightLevel.Level5],
  });
  const { smoothLoess } = useSmoothedSerieLoess({
    bandwidthFraction: 1,
  });

  const name = 'Target';
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const targetSerie = useMemo(() => {
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
      return generateSerie(
        (key) => strikeWeightData[strikeWeightLevel]?.[key.number - 1] ?? null,
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

    return nullTargetSerie;
  }, [
    target,
    generateSerie,
    name,
    variant,
    mode,
    nullTargetSerie,
    smoothLsr,
    smoothLoess,
  ]);

  return { targetSerie };
};
