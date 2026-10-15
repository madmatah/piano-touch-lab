import { useEffect, useRef } from 'react';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignTarget,
} from '@/lib/piano/touch-design/design/wippen-support-springs-design';

export const useWippenSupportSpringsRecommendation = (
  wippenSupportSpringsDesignMode: WippenSupportSpringsDesignMode | null,
  wippenSupportSpringsDesignTarget: WippenSupportSpringsDesignTarget,
  setWippenSupportSpringsDesign: (
    mode: WippenSupportSpringsDesignMode,
    target: WippenSupportSpringsDesignTarget,
  ) => void,
) => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (
        wippenSupportSpringsDesignMode === null &&
        wippenSupportSpringsDesignTarget === null
      ) {
        setWippenSupportSpringsDesign(
          WippenSupportSpringsDesignMode.None,
          null,
        );
      }
      isFirstRender.current = false;
    }
  }, [
    isFirstRender,
    setWippenSupportSpringsDesign,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  ]);
};
