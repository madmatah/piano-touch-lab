import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';
import type { CurveSmootherLeastSquaresRegressionOptions } from '@/lib/geometry/curve-smoother/curve-smoother-least-squares-regression';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { strikeWeightData } from '@/lib/piano/touch-design/data/strike-weight';

export const useSmoothedSerieLsr = (
  inputSerie: TouchDesignSerie,
): TouchDesignSerie => {
  const lsrSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.LEAST_SQUARES_REGRESSION);

  const inputData = inputSerie.data.map((dataPoint) => dataPoint.payload);

  const smoothedData = lsrSmoother.smoothCurve(inputData, {
    referenceCurve: strikeWeightData[StrikeWeightLevel.Level5],
  });

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
};
