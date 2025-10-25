import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
  type WippenTensionDesign,
} from '../WippenSupportSpringsDesign.types';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useCallback, useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import { generateSupportSpringBalanceWeightCurve } from '@/lib/piano/touch-design/generate-support-spring-balance-weight-curve';
import { useTranslation } from '@/hooks/use-translation';

export const useWippenSupportSpringsTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
): {
  generateWippenSupportSpringTargetSerie: (
    mode: WippenSupportSpringsDesignMode | null,
    target: WippenSupportSpringsDesignTarget,
  ) => TouchDesignSerie;
} => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);

  const name = useMemo(() => t('Target'), [t]);
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const generateSupportSpringBalanceWeightTargetSerie = useCallback(
    (
      mode: WippenSupportSpringsDesignMode | null,
      target: WippenSupportSpringsDesignTarget,
    ): TouchDesignSerie => {
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
    },
    [nullTargetSerie, generateSerie, name, variant],
  );

  return {
    generateWippenSupportSpringTargetSerie:
      generateSupportSpringBalanceWeightTargetSerie,
  };
};
