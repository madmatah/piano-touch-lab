import { useCallback } from 'react';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
} from '../WippenSupportSpringsDesign.types';
import {
  useDesignActions,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';

export const useWippenSupportSpringsTargetSelector = () => {
  const { wippenSupportSpringsDesignMode, wippenSupportSpringsDesignTarget } =
    useWippenSupportSpringsDesign();
  const { updateWippenSupportSpringsDesign } = useDesignActions();

  const onTargetChange = useCallback(
    (target: WippenSupportSpringsDesignTarget) => {
      updateWippenSupportSpringsDesign(wippenSupportSpringsDesignMode, target);
    },
    [wippenSupportSpringsDesignMode, updateWippenSupportSpringsDesign],
  );

  const onModeChange = useCallback(
    (mode: WippenSupportSpringsDesignMode) => {
      if (
        mode === WippenSupportSpringsDesignMode.AsMeasured ||
        mode === WippenSupportSpringsDesignMode.None
      ) {
        updateWippenSupportSpringsDesign(mode, null);
      }
    },
    [updateWippenSupportSpringsDesign],
  );

  return {
    onModeChange,
    onTargetChange,
    updateWippenSupportSpringsDesign,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  };
};
