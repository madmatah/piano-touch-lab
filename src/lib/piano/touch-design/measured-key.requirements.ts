export type OptionalNumber = number | null;

export interface MeasuredKeyRequirements {
  downWeightWithoutSpringSupport: OptionalNumber;
  downWeightWithSpringSupport: OptionalNumber;
  frontWeight: OptionalNumber;
  keyWeightRatio: OptionalNumber;
  measuredStrikeWeightRatio: OptionalNumber;
  strikeWeight: OptionalNumber;
  upWeight: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}
