import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useCallback } from 'react';
import type { TouchDesignSerie } from '@/components/charts/interfaces';

interface GenerateDesignedKeyboardFromSeriesProps {
  frontWeightTargetSerie: TouchDesignSerie;
  strikeWeightTargetSerie: TouchDesignSerie;
  strikeWeightRatioTargetSerie: TouchDesignSerie;
  supportSpringBalanceWeightTargetSerie: TouchDesignSerie;
}

export const useGenerateDesignedKeyboardFromSeries = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
): {
  generateDesignedKeyboardFromSeries: (
    props: GenerateDesignedKeyboardFromSeriesProps,
  ) => TouchWeightAnalyzedKeyboard;
} => {
  const generateDesignedKeyboardFromSeries = useCallback(
    (props: GenerateDesignedKeyboardFromSeriesProps) => {
      return analyzedKeyboard.map((key) => {
        const keyIndex = key.number - 1;
        return {
          ...key.payload,
          frontWeight:
            props.frontWeightTargetSerie?.data[keyIndex]?.payload ?? null,
          strikeWeight:
            props.strikeWeightTargetSerie?.data[keyIndex]?.payload ?? null,
          strikeWeightRatio:
            props.strikeWeightRatioTargetSerie?.data[keyIndex]?.payload ?? null,
          supportSpringBalanceWeight:
            props.supportSpringBalanceWeightTargetSerie?.data[keyIndex]
              ?.payload ?? null,
        };
      });
    },
    [analyzedKeyboard],
  );

  return { generateDesignedKeyboardFromSeries };
};
