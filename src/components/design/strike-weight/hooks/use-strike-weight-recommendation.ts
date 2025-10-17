import { useEffect, useRef } from 'react';
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
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (
        strikeWeightDesignMode === null &&
        strikeWeightDesignTarget === null
      ) {
        setStrikeWeightDesign(
          StrikeWeightDesignMode.Smoothed,
          SmoothStrategy.LeastSquaresRegression,
        );
      }
      isFirstRender.current = false;
    }
  }, [
    isFirstRender,
    setStrikeWeightDesign,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
  ]);
};
