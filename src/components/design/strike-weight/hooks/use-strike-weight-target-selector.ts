import { useCallback } from 'react';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '../StrikeWeightDesign.types';
import {
  useDesignActions,
  useStrikeWeightDesign,
} from '@/hooks/store/use-design-store';

export const useStrikeWeightTargetSelector = () => {
  const {
    strikeWeightDesignComputedBalanceWeightTarget,
    strikeWeightDesignMode,
    strikeWeightDesignSmoothTarget,
    strikeWeightDesignStandarTarget,
    strikeWeightDesignTarget,
  } = useStrikeWeightDesign();
  const { updateStrikeWeightDesign } = useDesignActions();

  const onTargetChange = useCallback(
    (target: StrikeWeightDesignTarget) => {
      updateStrikeWeightDesign(strikeWeightDesignMode, target);
    },
    [strikeWeightDesignMode, updateStrikeWeightDesign],
  );

  const onModeChange = useCallback(
    (mode: StrikeWeightDesignMode) => {
      if (mode === StrikeWeightDesignMode.StandardCurves) {
        updateStrikeWeightDesign(mode, strikeWeightDesignStandarTarget);
      } else if (mode === StrikeWeightDesignMode.Smoothed) {
        updateStrikeWeightDesign(mode, strikeWeightDesignSmoothTarget);
      } else if (mode === StrikeWeightDesignMode.Computed) {
        updateStrikeWeightDesign(
          mode,
          strikeWeightDesignComputedBalanceWeightTarget,
        );
      } else {
        updateStrikeWeightDesign(mode, null);
      }
    },
    [
      strikeWeightDesignComputedBalanceWeightTarget,
      strikeWeightDesignSmoothTarget,
      strikeWeightDesignStandarTarget,
      updateStrikeWeightDesign,
    ],
  );

  return {
    onModeChange,
    onTargetChange,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
    updateStrikeWeightDesign,
  };
};
