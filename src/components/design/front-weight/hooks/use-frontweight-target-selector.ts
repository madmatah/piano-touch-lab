import { useCallback } from 'react';
import {
  FrontWeightDesignMode,
  type FrontWeightDesignTarget,
} from '../FrontWeightDesign.types';
import {
  useDesignActions,
  useFrontWeightDesign,
} from '@/hooks/store/use-design-store';

export const useFrontWeightTargetSelector = () => {
  const {
    frontWeightDesignMode,
    frontWeightDesignStandardTarget,
    frontWeightDesignComputedBalanceWeightTarget,
    frontWeightDesignTarget,
  } = useFrontWeightDesign();
  const { updateFrontWeightDesign } = useDesignActions();

  const onTargetChange = useCallback(
    (target: FrontWeightDesignTarget) => {
      updateFrontWeightDesign(frontWeightDesignMode, target);
    },
    [frontWeightDesignMode, updateFrontWeightDesign],
  );

  const onModeChange = useCallback(
    (mode: FrontWeightDesignMode) => {
      if (mode === FrontWeightDesignMode.StandardCurves) {
        updateFrontWeightDesign(mode, frontWeightDesignStandardTarget);
      } else if (mode === FrontWeightDesignMode.Computed) {
        updateFrontWeightDesign(
          mode,
          frontWeightDesignComputedBalanceWeightTarget,
        );
      } else {
        updateFrontWeightDesign(mode, null);
      }
    },
    [
      frontWeightDesignComputedBalanceWeightTarget,
      frontWeightDesignStandardTarget,
      updateFrontWeightDesign,
    ],
  );

  return {
    frontWeightDesignMode,
    frontWeightDesignTarget,
    onModeChange,
    onTargetChange,
    updateFrontWeightDesign,
  };
};
