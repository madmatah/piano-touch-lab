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
      } else {
        updateFrontWeightDesign(mode, null);
      }
    },
    [frontWeightDesignStandardTarget, updateFrontWeightDesign],
  );

  return {
    frontWeightDesignMode,
    frontWeightDesignTarget,
    onModeChange,
    onTargetChange,
    updateFrontWeightDesign,
  };
};
