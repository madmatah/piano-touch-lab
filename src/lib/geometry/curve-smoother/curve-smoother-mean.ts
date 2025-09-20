import { inject } from 'inversify';
import type { CurveSmootherRequirements } from './curve-smoother.requirements';
import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from './data-points-extractor/data-points-extractor-requirements';

export class CurveSmootherMean implements CurveSmootherRequirements<never> {
  public constructor(
    @inject(dataPointsExtractorRequirementsSymbol)
    private readonly dataPointsExtractor: DataPointsExtractorRequirements,
  ) {}

  public smoothCurve(inputData: (number | undefined)[]): number[] {
    const { y: yVals } = this.dataPointsExtractor.extractDataPoints(inputData);

    if (yVals.length === 0) {
      return inputData.map(() => NaN);
    }

    const mean = this.calculateMean(yVals);

    return inputData.map(() => mean);
  }

  private calculateMean(values: number[]): number {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
}
