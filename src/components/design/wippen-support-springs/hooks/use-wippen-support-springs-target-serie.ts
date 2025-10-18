import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '../WippenSupportSpringsDesign.types';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import { generateSupportSpringBalanceWeightCurve } from '@/lib/piano/touch-design/generate-support-spring-balance-weight-curve';

export const useWippenSupportSpringsTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  mode: WippenSupportSpringsDesignMode | null,
  target: WippenSupportSpringsDesignTarget,
): { targetSerie: TouchDesignSerie } => {
  const { generateSerie } = useGenerateSerie(keyboard);

  const name = 'Target';
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const targetSerie = useMemo(() => {
    if (mode === WippenSupportSpringsDesignMode.AsMeasured) {
      return generateSerie(
        (key) => key.payload.supportSpringBalanceWeight,
        name,
        variant,
      );
    }
    if (
      mode === WippenSupportSpringsDesignMode.Constant ||
      mode === WippenSupportSpringsDesignMode.SmoothTransition
    ) {
      const tensionDesign = target as WippenTensionDesign;
      const curve = generateSupportSpringBalanceWeightCurve({
        baseTension: tensionDesign.springBalanceWeight,
        numberOfSprings: tensionDesign.numberOfSprings,
        tensionDropIndex:
          tensionDesign.tensionDropIndex ?? tensionDesign.numberOfSprings,
      });

      return generateSerie(
        (key) =>
          key.number <= tensionDesign.numberOfSprings
            ? (curve[key.number - 1] ?? null)
            : null,
        name,
        variant,
      );
    }

    return nullTargetSerie;
  }, [mode, target, nullTargetSerie, generateSerie, variant]);

  return { targetSerie };
};
