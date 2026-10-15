import type { KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useCallback } from 'react';

/** A target, key by key: only its values matter to the design. */
interface KeyedTarget {
  data: readonly KeyWith<number | undefined>[];
}

interface GenerateDesignedKeyboardFromSeriesProps {
  frontWeightTargetSerie: KeyedTarget;
  strikeWeightTargetSerie: KeyedTarget;
  strikeWeightRatioTargetSerie: KeyedTarget;
  supportSpringBalanceWeightTargetSerie: KeyedTarget;
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
