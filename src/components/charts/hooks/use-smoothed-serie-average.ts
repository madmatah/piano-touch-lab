import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';
import { useCallback } from 'react';

export const useSmoothedSerieAverage = () => {
  const meanSmoother = useNamedInjection<CurveSmootherRequirements<undefined>>(
    curveSmootherRequirementsSymbol,
    SmoothStrategy.Mean,
  );
  const medianSmoother = useNamedInjection<
    CurveSmootherRequirements<undefined>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.Median);

  const smoothSerie = useCallback(
    (
      inputSerie: TouchDesignSerie,
      smoother: CurveSmootherRequirements<undefined>,
    ) => {
      const inputData = inputSerie.data.map((dataPoint) => dataPoint.payload);
      const smoothedData = smoother.smoothCurve(inputData, undefined);
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
    [],
  );

  const smoothMean = useCallback(
    (inputSerie: TouchDesignSerie) => {
      return smoothSerie(inputSerie, meanSmoother);
    },
    [smoothSerie, meanSmoother],
  );

  const smoothMedian = useCallback(
    (inputSerie: TouchDesignSerie) => {
      return smoothSerie(inputSerie, medianSmoother);
    },
    [smoothSerie, medianSmoother],
  );

  return { smoothMean, smoothMedian };
};
