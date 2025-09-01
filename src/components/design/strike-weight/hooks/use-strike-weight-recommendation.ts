import { useEffect, useState } from 'react';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignTarget,
} from '../StrikeWeightDesign.types';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

export const useStrikeWeightRecommendation = (
  strikeWeightDesignMode: StrikeWeightDesignMode | null,
  strikeWeightDesignTarget: StrikeWeightDesignTarget | null,
  setStrikeWeightDesign: (
    mode: StrikeWeightDesignMode,
    target: StrikeWeightDesignTarget,
  ) => void,
) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      if (
        strikeWeightDesignMode === null &&
        strikeWeightDesignTarget === null
      ) {
        setStrikeWeightDesign(
          StrikeWeightDesignMode.SMOOTHED,
          SmoothStrategy.LEAST_SQUARES_REGRESSION,
        );
      }
      setIsFirstRender(false);
    }
  }, [
    isFirstRender,
    setStrikeWeightDesign,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
  ]);
};
