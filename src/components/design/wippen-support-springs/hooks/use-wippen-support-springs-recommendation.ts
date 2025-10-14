import { useEffect, useState } from 'react';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
} from '../WippenSupportSpringsDesign.types';

export const useWippenSupportSpringsRecommendation = (
  wippenSupportSpringsDesignMode: WippenSupportSpringsDesignMode | null,
  wippenSupportSpringsDesignTarget: WippenSupportSpringsDesignTarget,
  setWippenSupportSpringsDesign: (
    mode: WippenSupportSpringsDesignMode,
    target: WippenSupportSpringsDesignTarget,
  ) => void,
) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      if (
        wippenSupportSpringsDesignMode === null &&
        wippenSupportSpringsDesignTarget === null
      ) {
        setWippenSupportSpringsDesign(
          WippenSupportSpringsDesignMode.None,
          null,
        );
      }
      setIsFirstRender(false);
    }
  }, [
    isFirstRender,
    setWippenSupportSpringsDesign,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  ]);
};
