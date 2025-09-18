import { useCallback } from 'react';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '../StrikeWeightDesign.types';
import {
  useDesignActions,
  useStrikeWeightDesign,
} from '@/hooks/use-design-store';

export const useStrikeWeightTargetSelector = () => {
  const {
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
    strikeWeightDesignSmoothTarget,
    strikeWeightDesignStandarTarget,
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
      } else {
        updateStrikeWeightDesign(mode, null);
      }
    },
    [
      updateStrikeWeightDesign,
      strikeWeightDesignSmoothTarget,
      strikeWeightDesignStandarTarget,
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
