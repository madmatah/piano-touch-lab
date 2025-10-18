import {
  useFrontWeightDesign,
  useStrikeWeightDesign,
  useStrikeWeightRatioDesign,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';
import { useStrikeWeightTargetSerie } from '../strike-weight/hooks/use-strike-weight-target-serie';
import { useStrikeWeightRatioTargetSerie } from '../strike-weight-ratio/hooks/strike-weight-ratio-target-serie';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useWippenSupportSpringsTargetSerie } from '../wippen-support-springs/hooks/use-wippen-support-springs-target-serie';
import { FrontWeightDesignMode } from '../front-weight/FrontWeightDesign.types';
import { useMemo } from 'react';
import type { TouchDesignSerie } from '@/components/charts/interfaces';
import { useFrontWeightTargetSerie } from '../front-weight/hooks/use-front-weight-target-serie';
import { TouchDesignSerieVariant } from '@/components/charts/TouchDesignChart';
import { useGenerateSerie } from '@/components/charts/hooks/use-generate-serie';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightDesignMode } from '../strike-weight/StrikeWeightDesign.types';

export const useTargetSeries = (
  keyboard: TouchWeightAnalyzedKeyboard,
): {
  frontWeightTargetSerie: TouchDesignSerie;
  strikeWeightTargetSerie: TouchDesignSerie;
  strikeWeightRatioTargetSerie: TouchDesignSerie;
  supportSpringBalanceWeightTargetSerie: TouchDesignSerie;
} => {
  const { t } = useTranslation();
  const { frontWeightDesignMode, frontWeightDesignTarget } =
    useFrontWeightDesign();
  const { strikeWeightDesignMode, strikeWeightDesignTarget } =
    useStrikeWeightDesign();
  const { strikeWeightRatioDesignMode, strikeWeightRatioDesignTarget } =
    useStrikeWeightRatioDesign();
  const { wippenSupportSpringsDesignMode, wippenSupportSpringsDesignTarget } =
    useWippenSupportSpringsDesign();

  const { generateSerie } = useGenerateSerie(keyboard);
  const { generateStrikeWeightRatioTargetSerie } =
    useStrikeWeightRatioTargetSerie(keyboard);
  const { generateWippenSupportSpringTargetSerie } =
    useWippenSupportSpringsTargetSerie(keyboard);
  const { generateFrontWeightTargetSerie } =
    useFrontWeightTargetSerie(keyboard);
  const { generateStrikeWeightTargetSerie } =
    useStrikeWeightTargetSerie(keyboard);

  const nullTargetSerie = useMemo(() => {
    return generateSerie(
      () => null,
      t('Target'),
      TouchDesignSerieVariant.Target,
    );
  }, [generateSerie, t]);

  const strikeWeightRatioTargetSerie = useMemo(() => {
    return generateStrikeWeightRatioTargetSerie(
      strikeWeightRatioDesignMode,
      strikeWeightRatioDesignTarget,
    );
  }, [
    generateStrikeWeightRatioTargetSerie,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
  ]);

  const supportSpringBalanceWeightTargetSerie = useMemo(() => {
    return generateWippenSupportSpringTargetSerie(
      wippenSupportSpringsDesignMode,
      wippenSupportSpringsDesignTarget,
    );
  }, [
    generateWippenSupportSpringTargetSerie,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  ]);

  const { frontWeightTargetSerie, strikeWeightTargetSerie } = useMemo((): {
    frontWeightTargetSerie: TouchDesignSerie;
    strikeWeightTargetSerie: TouchDesignSerie;
  } => {
    if (frontWeightDesignMode === FrontWeightDesignMode.Computed) {
      const strikeWeightTargetSerie = generateStrikeWeightTargetSerie(
        strikeWeightDesignMode,
        strikeWeightDesignTarget,
        nullTargetSerie,
        strikeWeightRatioTargetSerie,
        supportSpringBalanceWeightTargetSerie,
      );
      return {
        frontWeightTargetSerie: generateFrontWeightTargetSerie(
          frontWeightDesignMode,
          frontWeightDesignTarget,
          strikeWeightTargetSerie,
          strikeWeightRatioTargetSerie,
          supportSpringBalanceWeightTargetSerie,
        ),
        strikeWeightTargetSerie,
      };
    }
    if (strikeWeightDesignMode === StrikeWeightDesignMode.Computed) {
      const frontWeightTargetSerie = generateFrontWeightTargetSerie(
        frontWeightDesignMode,
        frontWeightDesignTarget,
        nullTargetSerie,
        strikeWeightRatioTargetSerie,
        supportSpringBalanceWeightTargetSerie,
      );
      return {
        frontWeightTargetSerie,
        strikeWeightTargetSerie: generateStrikeWeightTargetSerie(
          strikeWeightDesignMode,
          strikeWeightDesignTarget,
          frontWeightTargetSerie,
          strikeWeightRatioTargetSerie,
          supportSpringBalanceWeightTargetSerie,
        ),
      };
    }
    return {
      frontWeightTargetSerie: generateFrontWeightTargetSerie(
        frontWeightDesignMode,
        frontWeightDesignTarget,
        nullTargetSerie,
        strikeWeightRatioTargetSerie,
        supportSpringBalanceWeightTargetSerie,
      ),
      strikeWeightTargetSerie: generateStrikeWeightTargetSerie(
        strikeWeightDesignMode,
        strikeWeightDesignTarget,
        nullTargetSerie,
        strikeWeightRatioTargetSerie,
        supportSpringBalanceWeightTargetSerie,
      ),
    };
  }, [
    frontWeightDesignMode,
    frontWeightDesignTarget,
    generateFrontWeightTargetSerie,
    generateStrikeWeightTargetSerie,
    nullTargetSerie,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
    strikeWeightRatioTargetSerie,
    supportSpringBalanceWeightTargetSerie,
  ]);

  return {
    frontWeightTargetSerie,
    strikeWeightRatioTargetSerie,
    strikeWeightTargetSerie,
    supportSpringBalanceWeightTargetSerie,
  };
};
