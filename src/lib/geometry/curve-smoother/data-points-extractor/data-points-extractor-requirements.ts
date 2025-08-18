export const dataPointsExtractorRequirementsSymbol = Symbol(
  'DataPointsExtractorRequirements',
);

export interface DataPointsExtractorRequirements {
  extractDataPoints(inputData: (number | undefined)[]): {
    x: number[];
    y: number[];
  };
}
