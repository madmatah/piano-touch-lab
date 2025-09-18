import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import type { CurveSmootherLoessOptions } from '@/lib/geometry/curve-smoother/curve-smoother-loess';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';
import { useCallback } from 'react';

export const useSmoothedSerieLoess = (
  options: CurveSmootherLoessOptions = {
    bandwidthFraction: 1,
  },
) => {
  const loessSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLoessOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.Loess);

  const smoothLoess = useCallback(
    (inputSerie: TouchDesignSerie) => {
      const inputData = inputSerie.data.map((dataPoint) => dataPoint.payload);
      const smoothedData = loessSmoother.smoothCurve(inputData, options);
      const outputData: TouchDesignDataPoint[] = inputSerie.data.map(
        (dataPoint, index) => ({
          ...dataPoint,
          payload: smoothedData[index],
        }),
      );

      return {
        ...inputSerie,
        data: outputData,
      };
    },
    [loessSmoother, options],
  );

  return { smoothLoess };
};
