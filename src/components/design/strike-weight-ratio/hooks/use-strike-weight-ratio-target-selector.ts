import { useCallback } from 'react';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '../StrikeWeightRatioDesign.types';
import {
  useDesignActions,
  useStrikeWeightRatioDesign,
} from '@/hooks/use-design-store';

export const useStrikeWeightRatioTargetSelector = () => {
  const {
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    strikeWeightRatioDesignLatestFixedTarget,
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
      if (mode === StrikeWeightRatioDesignMode.FixedValue) {
        updateStrikeWeightRatioDesign(
          mode,
          strikeWeightRatioDesignLatestFixedTarget,
        );
      } else {
        updateStrikeWeightRatioDesign(mode, null);
      }
    },
    [updateStrikeWeightRatioDesign, strikeWeightRatioDesignLatestFixedTarget],
  );

  return {
    onModeChange,
    onTargetChange,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    updateStrikeWeightRatioDesign,
  };
};
