import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import type { CurveSmootherLoessOptions } from '@/lib/geometry/curve-smoother/curve-smoother-loess';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';

export const useSmoothedSerieLoess = (
  inputSerie: TouchDesignSerie,
): TouchDesignSerie => {
  const loessSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLoessOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.LOESS);

  const inputData = inputSerie.data.map((dataPoint) => dataPoint.payload);

  const smoothedData = loessSmoother.smoothCurve(inputData, {
    bandwidthFraction: 1,
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
