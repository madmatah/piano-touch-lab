import { useCallback } from 'react';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '../StrikeWeightRatioDesign.types';
import {
  useDesignActions,
  useStrikeWeightRatioDesign,
} from '@/hooks/store/use-design-store';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

export const useStrikeWeightRatioTargetSelector = () => {
  const {
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    strikeWeightRatioDesignLatestFixedTarget,
    strikeWeightRatioDesignLatestSmoothTarget,
  } = useStrikeWeightRatioDesign();
  const { updateStrikeWeightRatioDesign } = useDesignActions();

  const onTargetChange = useCallback(
    (target: StrikeWeightRatioDesignTarget) => {
      updateStrikeWeightRatioDesign(strikeWeightRatioDesignMode, target);
    },
    [updateStrikeWeightRatioDesign, strikeWeightRatioDesignMode],
  );

  const onModeChange = useCallback(
    (mode: StrikeWeightRatioDesignMode) => {
      if (mode === StrikeWeightRatioDesignMode.Smoothed) {
        updateStrikeWeightRatioDesign(
          mode,
          strikeWeightRatioDesignLatestSmoothTarget ?? SmoothStrategy.Median,
        );
      } else if (mode === StrikeWeightRatioDesignMode.FixedValue) {
        updateStrikeWeightRatioDesign(
          mode,
          strikeWeightRatioDesignLatestFixedTarget,
        );
      } else {
        updateStrikeWeightRatioDesign(mode, null);
      }
    },
    [
      updateStrikeWeightRatioDesign,
      strikeWeightRatioDesignLatestFixedTarget,
      strikeWeightRatioDesignLatestSmoothTarget,
    ],
  );

  return {
    onModeChange,
    onTargetChange,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    updateStrikeWeightRatioDesign,
  };
};
