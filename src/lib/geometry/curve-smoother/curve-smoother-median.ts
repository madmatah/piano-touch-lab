import { inject } from 'inversify';
import type { CurveSmootherRequirements } from './curve-smoother.requirements';
import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from './data-points-extractor/data-points-extractor-requirements';

export class CurveSmootherMedian implements CurveSmootherRequirements<never> {
  public constructor(
    @inject(dataPointsExtractorRequirementsSymbol)
    private readonly dataPointsExtractor: DataPointsExtractorRequirements,
  ) {}

  public smoothCurve(inputData: (number | undefined)[]): number[] {
    const { y: yVals } = this.dataPointsExtractor.extractDataPoints(inputData);

    if (yVals.length === 0) {
      return inputData.map(() => NaN);
    }

    const median = this.calculateMedian(yVals);

    return inputData.map(() => median);
  }

  private calculateMedian(values: number[]): number {
    const sortedValues = [...values].sort((a, b) => a - b);
    const length = sortedValues.length;

    if (length % 2 === 0) {
      const mid1 = sortedValues[length / 2 - 1]!;
      const mid2 = sortedValues[length / 2]!;
      return (mid1 + mid2) / 2;
    } else {
      return sortedValues[Math.floor(length / 2)]!;
    }
  }
}
