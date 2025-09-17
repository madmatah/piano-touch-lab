import { useEffect, useMemo, useState } from 'react';

import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignTarget,
} from '../StrikeWeightRatioDesign.types';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export const useStrikeWeightRatioRecommendation = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
  strikeWeightRatioDesignMode: StrikeWeightRatioDesignMode | null,
  strikeWeightRatioDesignTarget: StrikeWeightRatioDesignTarget | null,
  setStrikeWeightRatioDesign: (
    mode: StrikeWeightRatioDesignMode,
    target: StrikeWeightRatioDesignTarget,
  ) => void,
) => {
  const [isFirstRender, setIsFirstRender] = useState(true);

  const averageStrikeWeightRatio: number | undefined = useMemo(() => {
    const measuredValues = analyzedKeyboard
      .mapToArray((key) => key.payload.strikeWeightRatio)
      .filter((v) => v !== undefined && v !== null);

    if (measuredValues.length === 0) {
      return;
    }

    const average =
      measuredValues.reduce((acc, key) => acc + key, 0) / measuredValues.length;

    const roundedAverage = Math.round(average * 10) / 10;

    return roundedAverage;
  }, [analyzedKeyboard]);

  useEffect(() => {
    if (isFirstRender) {
      if (
        strikeWeightRatioDesignMode === null &&
        strikeWeightRatioDesignTarget === null &&
        averageStrikeWeightRatio
      ) {
        setStrikeWeightRatioDesign(
          StrikeWeightRatioDesignMode.FixedValue,
          averageStrikeWeightRatio,
        );
      }
      setIsFirstRender(false);
    }
  }, [
    strikeWeightRatioDesignTarget,
    isFirstRender,
    setStrikeWeightRatioDesign,
    averageStrikeWeightRatio,
  ]);
};
