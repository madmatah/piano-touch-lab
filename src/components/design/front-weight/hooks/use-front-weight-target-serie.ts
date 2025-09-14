import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useMemo } from 'react';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import type { FrontWeightDesignTarget } from '../FrontWeightDesign.types';
import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';
import { frontWeightData } from '@/lib/piano/touch-design/data/front-weights';
import { useTranslation } from 'react-i18next';

export const useFrontWeightTargetSerie = (
  keyboard: TouchWeightAnalyzedKeyboard,
  target: FrontWeightDesignTarget | null,
): { targetSerie: TouchDesignSerie | null } => {
  const { t } = useTranslation();
  const { generateSerie } = useGenerateSerie(keyboard);

  const name = t('Target');
  const variant = TouchDesignSerieVariant.Target;

  const nullTargetSerie = useMemo(() => {
    return generateSerie(() => null, name, variant);
  }, [generateSerie, name, variant]);

  const targetSerie = useMemo(() => {
    if (target === null) {
      return nullTargetSerie;
    }

    if (
      Object.values<FrontWeightDesignTarget>(FrontWeightLevel).includes(target)
    ) {
      const frontWeightLevel = target;
      return generateSerie(
        (key) => frontWeightData[frontWeightLevel]?.[key.number - 1] ?? null,
        name,
        variant,
      );
    }

    return nullTargetSerie;
  }, [target, generateSerie, name, variant, nullTargetSerie]);

  return { targetSerie };
};
