import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
} from '../WippenSupportSpringsDesign.types';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';

export const useWippenSupportSpringsTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  mode: WippenSupportSpringsDesignMode | null,
  target: WippenSupportSpringsDesignTarget,
): { targetSerie: TouchDesignSerie | null } => {
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

    return nullTargetSerie;
  }, [mode, target, generateSerie, variant, nullTargetSerie]);

  return { targetSerie };
};
