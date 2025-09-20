import { useEffect, useState } from 'react';

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
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      if (
        strikeWeightRatioDesignMode === null &&
        strikeWeightRatioDesignTarget === null
      ) {
        setStrikeWeightRatioDesign(
          StrikeWeightRatioDesignMode.Smoothed,
          SmoothStrategy.Median,
        );
      }
      setIsFirstRender(false);
    }
  }, [
    isFirstRender,
    setStrikeWeightRatioDesign,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
  ]);
};
