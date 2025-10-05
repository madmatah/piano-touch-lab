import { useCallback } from 'react';
import { type FrontWeightDesignTarget } from '../FrontWeightDesign.types';
import {
  useDesignActions,
  useFrontWeightDesign,
} from '@/hooks/store/use-design-store';

export const useFrontWeightTargetSelector = () => {
  const { frontWeightDesignTarget } = useFrontWeightDesign();
  const { updateFrontWeightDesign } = useDesignActions();

  const onTargetChange = useCallback(
    (target: FrontWeightDesignTarget) => {
      updateFrontWeightDesign(target);
    },
    [updateFrontWeightDesign],
  );

  return {
    frontWeightDesignTarget,
    onTargetChange,
    updateFrontWeightDesign,
  };
};
