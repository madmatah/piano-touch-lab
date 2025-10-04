import { inject } from 'inversify';
import type { CurveSmootherRequirements } from './curve-smoother.requirements';
import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from './data-points-extractor/data-points-extractor-requirements';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
const Spline = require('typescript-cubic-spline').default as new (
  xs: number[],
  ys: number[],
) => { at(x: number): number };

export class CurveSmootherCubicSpline
  implements CurveSmootherRequirements<never>
{
  public constructor(
    @inject(dataPointsExtractorRequirementsSymbol)
    private readonly dataPointsExtractor: DataPointsExtractorRequirements,
  ) {}

  public smoothCurve(inputData: (number | undefined)[]): number[] {
    const { x: xVals, y: yVals } =
      this.dataPointsExtractor.extractDataPoints(inputData);

    const spline = new Spline(xVals, yVals);

    return inputData.map((_, i) => spline.at(i));
  }
}
