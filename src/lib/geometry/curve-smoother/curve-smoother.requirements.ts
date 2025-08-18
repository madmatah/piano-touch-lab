export const curveSmootherRequirementsSymbol = Symbol(
  'CurveSmootherRequirements',
);

export interface CurveSmootherRequirements<SmootherOptions> {
  smoothCurve(
    inputData: (number | undefined)[],
    options: SmootherOptions,
  ): number[];
}
