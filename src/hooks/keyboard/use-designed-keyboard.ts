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

export const useDesignedKeyboard = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
): TouchWeightAnalyzedKeyboard => {
  const touchWeightPreviewer = useInjection<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  );
  const { frontWeightDesignTarget } = useFrontWeightDesign();
  const { targetSerie: frontWeightTargetSerie } = useFrontWeightTargetSerie(
    analyzedKeyboard,
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
    return analyzedKeyboard
      .map((key) => {
        const keyIndex = key.number - 1;
        return {
          ...key.payload,
          frontWeight: frontWeightTargetSerie?.data[keyIndex]?.payload ?? null,
          strikeWeight:
            strikeWeightTargetSerie?.data[keyIndex]?.payload ?? null,
          strikeWeightRatio:
            strikeWeightRatioTargetSerie?.data[keyIndex]?.payload ?? null,
          supportSpringBalanceWeight:
            supportSpringBalanceWeightTargetSerie?.data[keyIndex]?.payload ??
            null,
        };
      })
      .map((key) => touchWeightPreviewer.computeTouchWeight(key));
  }, [
    analyzedKeyboard,
    frontWeightTargetSerie?.data,
    strikeWeightTargetSerie?.data,
    strikeWeightRatioTargetSerie?.data,
    supportSpringBalanceWeightTargetSerie?.data,
    touchWeightPreviewer,
  ]);

  return designedKeyboard;
};
