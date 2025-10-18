import { useFrontWeightTargetSerie } from '@/components/design/front-weight/hooks/use-front-weight-target-serie';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import {
  useFrontWeightDesign,
  useStrikeWeightDesign,
  useStrikeWeightRatioDesign,
  useWippenSupportSpringsDesign,
} from '../store/use-design-store';
import { useStrikeWeightTargetSerie } from '@/components/design/strike-weight/hooks/use-strike-weight-target-serie';
import { useStrikeWeightRatioTargetSerie } from '@/components/design/strike-weight-ratio/hooks/strike-weight-ratio-target-serie';
import { useMemo } from 'react';
import {
  touchWeightPreviewerRequirementsSymbol,
  type TouchWeightPreviewerRequirements,
} from '@/lib/piano/touch-design/touch-weight-previewer.requirements';
import { useInjection } from 'inversify-react';
import { useWippenSupportSpringsTargetSerie } from '@/components/design/wippen-support-springs/hooks/use-wippen-support-springs-target-serie';
import { useGenerateDesignedKeyboardFromSeries } from './use-generate-designed-keyboard-from-series';

export const useDesignedKeyboard = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
): TouchWeightAnalyzedKeyboard => {
  const touchWeightPreviewer = useInjection<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  );
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(analyzedKeyboard);
  const { frontWeightDesignMode, frontWeightDesignTarget } =
    useFrontWeightDesign();
  const { targetSerie: frontWeightTargetSerie } = useFrontWeightTargetSerie(
    analyzedKeyboard,
    frontWeightDesignMode,
    frontWeightDesignTarget,
  );
  const { strikeWeightDesignMode, strikeWeightDesignTarget } =
    useStrikeWeightDesign();
  const { targetSerie: strikeWeightTargetSerie } = useStrikeWeightTargetSerie(
    analyzedKeyboard,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
  );
  const { strikeWeightRatioDesignMode, strikeWeightRatioDesignTarget } =
    useStrikeWeightRatioDesign();
  const { targetSerie: strikeWeightRatioTargetSerie } =
    useStrikeWeightRatioTargetSerie(
      analyzedKeyboard,
      strikeWeightRatioDesignMode,
      strikeWeightRatioDesignTarget,
    );
  const { wippenSupportSpringsDesignMode, wippenSupportSpringsDesignTarget } =
    useWippenSupportSpringsDesign();
  const { targetSerie: supportSpringBalanceWeightTargetSerie } =
    useWippenSupportSpringsTargetSerie(
      analyzedKeyboard,
      wippenSupportSpringsDesignMode,
      wippenSupportSpringsDesignTarget,
    );

  const designedKeyboard = useMemo(() => {
    return generateDesignedKeyboardFromSeries({
      frontWeightTargetSerie,
      strikeWeightRatioTargetSerie,
      strikeWeightTargetSerie,
      supportSpringBalanceWeightTargetSerie,
    }).map((key) => touchWeightPreviewer.computeTouchWeight(key));
  }, [
    generateDesignedKeyboardFromSeries,
    frontWeightTargetSerie,
    strikeWeightRatioTargetSerie,
    strikeWeightTargetSerie,
    supportSpringBalanceWeightTargetSerie,
    touchWeightPreviewer,
  ]);

  return designedKeyboard;
};
