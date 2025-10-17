import { useEffect, useRef } from 'react';

import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '../StrikeWeightRatioDesign.types';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

export const useStrikeWeightRatioRecommendation = (
  strikeWeightRatioDesignMode: StrikeWeightRatioDesignMode | null,
  strikeWeightRatioDesignTarget: StrikeWeightRatioDesignTarget | null,
  setStrikeWeightRatioDesign: (
    mode: StrikeWeightRatioDesignMode,
    target: StrikeWeightRatioDesignTarget,
  ) => void,
) => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (
        strikeWeightRatioDesignMode === null &&
        strikeWeightRatioDesignTarget === null
      ) {
        setStrikeWeightRatioDesign(
          StrikeWeightRatioDesignMode.Smoothed,
          SmoothStrategy.Median,
        );
      }
      isFirstRender.current = false;
    }
  }, [
    isFirstRender,
    setStrikeWeightRatioDesign,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
  ]);
};
