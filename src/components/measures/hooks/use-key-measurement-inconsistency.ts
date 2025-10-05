import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useMemo } from 'react';
import { useAnalyzedKey } from '@/hooks/keyboard/use-analyzed-key';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';

export const useKeyMeasurementInconsistency = (
  keyNumber: number,
): {
  allowedDifference: number;
  computedStrikeWeightRatio: OptionalNumber;
  isKeyMeasurementInconsistent: boolean;
  measuredStrikeWeightRatio: OptionalNumber;
} => {
  const { useManualSWRMeasurements } = useMeasureOptions();
  const { analyzedKey } = useAnalyzedKey(keyNumber);

  const allowedDifference = 0.05;

  const measuredStrikeWeightRatio = useMemo(
    () => analyzedKey?.measuredStrikeWeightRatio ?? null,
    [analyzedKey?.measuredStrikeWeightRatio],
  );

  const computedStrikeWeightRatio = useMemo(
    () => analyzedKey?.computedStrikeWeightRatio ?? null,
    [analyzedKey?.computedStrikeWeightRatio],
  );

  const isKeyMeasurementInconsistent = useMemo(() => {
    if (
      !useManualSWRMeasurements ||
      !measuredStrikeWeightRatio ||
      !computedStrikeWeightRatio
    ) {
      return false;
    }

    const differenceBetweenComputedAndMeasuredValue: number = parseFloat(
      Math.abs(computedStrikeWeightRatio - measuredStrikeWeightRatio).toFixed(
        2,
      ),
    );

    return differenceBetweenComputedAndMeasuredValue > allowedDifference;
  }, [
    measuredStrikeWeightRatio,
    useManualSWRMeasurements,
    computedStrikeWeightRatio,
    allowedDifference,
  ]);

  return {
    allowedDifference,
    computedStrikeWeightRatio,
    isKeyMeasurementInconsistent,
    measuredStrikeWeightRatio,
  };
};
