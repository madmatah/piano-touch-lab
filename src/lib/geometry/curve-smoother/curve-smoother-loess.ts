import { inject } from 'inversify';
import type { CurveSmootherRequirements } from './curve-smoother.requirements';
import { createLoessInterpolator } from 'commons-math-interpolation';

import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from './data-points-extractor/data-points-extractor-requirements';

type LoessInterpolatorDiagInfo = Record<string, unknown>;
interface LoessInterpolatorParms {
  accuracy?: number;
  bandwidthFraction?: number;
  diagInfo?: LoessInterpolatorDiagInfo;
  interpolationMethod?: 'linear' | 'nearest';
  minXDistance?: number;
  outlierDistanceFactor?: number;
  robustnessIters?: number;
  xVals: Float64Array;
  yVals: Float64Array;
}

export interface CurveSmootherLoessOptions {
  bandwidthFraction?: number;
}

const defaultOptions: CurveSmootherLoessOptions = {
  bandwidthFraction: 0.3,
};

export class CurveSmootherLoess
  implements CurveSmootherRequirements<CurveSmootherLoessOptions>
{
  public constructor(
    @inject(dataPointsExtractorRequirementsSymbol)
    private readonly dataPointsExtractor: DataPointsExtractorRequirements,
  ) {}

  public smoothCurve(
    inputData: (number | undefined)[],
    options: CurveSmootherLoessOptions,
  ): number[] {
    const computedOptions = { ...defaultOptions, ...(options ?? {}) };

    const { x: xVals, y: yVals } =
      this.dataPointsExtractor.extractDataPoints(inputData);

    if (xVals.length < 2) {
      return inputData.map(() => NaN);
    }

    const diagInfo: LoessInterpolatorDiagInfo = {};

    const parms: LoessInterpolatorParms = {
      accuracy: 1e-12,
      bandwidthFraction: computedOptions.bandwidthFraction,
      diagInfo,
      interpolationMethod: 'linear',
      minXDistance: 1e-12,
      outlierDistanceFactor: 6,
      robustnessIters: 2,
      xVals: new Float64Array(xVals),
      yVals: new Float64Array(yVals),
    };

    const loessFn = createLoessInterpolator(parms as unknown as never);

    const minX = xVals[0]!;
    const maxX = xVals[xVals.length - 1]!;
    const ySmooth = inputData.map((_, i) =>
      i >= minX && i <= maxX ? loessFn(i) : NaN,
    );

    return ySmooth;
  }
}
