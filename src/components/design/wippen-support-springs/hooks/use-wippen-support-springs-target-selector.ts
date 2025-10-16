import { useCallback } from 'react';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
} from '../WippenSupportSpringsDesign.types';
import {
  useDesignActions,
  useWippenSupportSpringsDesign,
} from '@/hooks/store/use-design-store';
import { type KeyboardLike } from '@/lib/piano/keyboard';

const defaultSpringBalanceWeight = 9;

export const useWippenSupportSpringsTargetSelector = (
  keyboard: KeyboardLike<unknown>,
) => {
  const {
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
    wippenSupportSpringsDesignLatestNumberOfSprings,
    wippenSupportSpringsDesignLatestSpringBalanceWeight,
    wippenSupportSpringsDesignLatestTensionDropIndex,
  } = useWippenSupportSpringsDesign();
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
      if (mode === WippenSupportSpringsDesignMode.Constant) {
        updateWippenSupportSpringsDesign(mode, {
          numberOfSprings:
            wippenSupportSpringsDesignLatestNumberOfSprings ?? keyboard.size,
          springBalanceWeight:
            wippenSupportSpringsDesignLatestSpringBalanceWeight ??
            defaultSpringBalanceWeight,
        });
      }
      if (mode === WippenSupportSpringsDesignMode.SmoothTransition) {
        updateWippenSupportSpringsDesign(mode, {
          numberOfSprings:
            wippenSupportSpringsDesignLatestNumberOfSprings ?? keyboard.size,
          springBalanceWeight:
            wippenSupportSpringsDesignLatestSpringBalanceWeight ??
            defaultSpringBalanceWeight,
          tensionDropIndex:
            wippenSupportSpringsDesignLatestTensionDropIndex ?? 1,
        });
      }
    },
    [
      keyboard.size,
      updateWippenSupportSpringsDesign,
      wippenSupportSpringsDesignLatestNumberOfSprings,
      wippenSupportSpringsDesignLatestSpringBalanceWeight,
      wippenSupportSpringsDesignLatestTensionDropIndex,
    ],
  );

  return {
    onModeChange,
    onTargetChange,
    updateWippenSupportSpringsDesign,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  };
};
