import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useMemo } from 'react';
import {
  touchWeightPreviewerRequirementsSymbol,
  type TouchWeightPreviewerRequirements,
} from '@/lib/piano/touch-design/touch-weight-previewer/touch-weight-previewer.requirements';
import { useInjection } from 'inversify-react';
import { useGenerateDesignedKeyboardFromSeries } from './use-generate-designed-keyboard-from-series';
import { useTargetSeries } from '@/components/design/hooks/use-target-series-generators';

export const useDesignedKeyboard = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
): TouchWeightAnalyzedKeyboard => {
  const touchWeightPreviewer = useInjection<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  );
  const { generateDesignedKeyboardFromSeries } =
    useGenerateDesignedKeyboardFromSeries(analyzedKeyboard);

  const {
    frontWeightTargetSerie,
    strikeWeightTargetSerie,
    strikeWeightRatioTargetSerie,
    supportSpringBalanceWeightTargetSerie,
  } = useTargetSeries(analyzedKeyboard);

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
