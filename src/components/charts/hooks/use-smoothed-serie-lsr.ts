import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';
import type { CurveSmootherLeastSquaresRegressionOptions } from '@/lib/geometry/curve-smoother/curve-smoother-least-squares-regression';
import { useCallback } from 'react';

export const useSmoothedSerieLsr = (
  options: CurveSmootherLeastSquaresRegressionOptions,
) => {
  const lsrSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.LEAST_SQUARES_REGRESSION);

  const smoothLsr = useCallback(
    (inputSerie: TouchDesignSerie) => {
      const inputData = inputSerie.data.map((dataPoint) => dataPoint.payload);

      const smoothedData = lsrSmoother.smoothCurve(inputData, options);

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
    [lsrSmoother, options],
  );

  return { smoothLsr };
};
