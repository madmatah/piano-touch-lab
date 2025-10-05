import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import { useGlobalMeasures } from '../store/use-measure-store';
import { useMeasureOptions } from '../store/use-measure-options-store';

export const useKeyMeasurementsHelpers = (
  measureProfileName?: string,
): {
  computeKeyMeasurements: (
    keyMeasure: MeasuredKeyRequirements,
  ) => MeasuredKeyRequirements;
} => {
  const { useManualSWRMeasurements } = useMeasureOptions();
  const globalMeasure = useGlobalMeasures(measureProfileName);

  const computeKeyMeasurements = useCallback(
    (keyMeasure: MeasuredKeyRequirements) => {
      const wippenRadiusWeight =
        keyMeasure.wippenRadiusWeight ?? globalMeasure.wippenRadiusWeight;
      const keyWeightRatio =
        keyMeasure.keyWeightRatio ?? globalMeasure.keyWeightRatio;

      return {
        ...keyMeasure,
        keyWeightRatio,
        measuredStrikeWeightRatio: useManualSWRMeasurements
          ? keyMeasure.measuredStrikeWeightRatio
          : null,
        wippenRadiusWeight,
      };
    },
    [globalMeasure, useManualSWRMeasurements],
  );

  return { computeKeyMeasurements };
};
