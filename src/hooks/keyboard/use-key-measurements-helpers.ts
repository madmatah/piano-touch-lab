import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import { useGlobalMeasures } from '../store/use-measure-store';
import { useMeasureOptions } from '../store/use-measure-options-store';

export const useKeyMeasurementsHelpers = (): {
  computeKeyMeasurements: (
    keyMeasure: MeasuredKeyRequirements,
  ) => MeasuredKeyRequirements;
} => {
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();
  const globalMeasure = useGlobalMeasures();

  const computeKeyMeasurements = useCallback(
    (keyMeasure: MeasuredKeyRequirements) => {
      const wippenRadiusWeight =
        keyMeasure.wippenRadiusWeight ?? globalMeasure.wippenRadiusWeight;
      const keyWeightRatio =
        keyMeasure.keyWeightRatio ?? globalMeasure.keyWeightRatio;

      // A reading taken under an option that is now off is no longer what
      // the piano is: it stays in the profile, but nothing computes with it.
      return {
        ...keyMeasure,
        downWeightWithSpringSupport: useSupportSpringMeasurements
          ? keyMeasure.downWeightWithSpringSupport
          : null,
        keyWeightRatio,
        measuredStrikeWeightRatio: useManualSWRMeasurements
          ? keyMeasure.measuredStrikeWeightRatio
          : null,
        wippenRadiusWeight,
      };
    },
    [globalMeasure, useManualSWRMeasurements, useSupportSpringMeasurements],
  );

  return { computeKeyMeasurements };
};
