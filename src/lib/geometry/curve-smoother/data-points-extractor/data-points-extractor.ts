import type { DataPointsExtractorRequirements } from './data-points-extractor-requirements';

export class DataPointsExtractor implements DataPointsExtractorRequirements {
  public extractDataPoints(inputData: (number | undefined)[]): {
    x: number[];
    y: number[];
  } {
    const xVals: number[] = [];
    const yVals: number[] = [];

    inputData.forEach((val, i) => {
      if (val !== undefined && !isNaN(val)) {
        xVals.push(i);
        yVals.push(val);
      }
    });

    return { x: xVals, y: yVals };
  }
}
