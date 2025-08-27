export type OptionalNumber = number | null;

export interface MeasuredKeyRequirements {
  downWeight: OptionalNumber;
  frontWeight: OptionalNumber;
  strikeWeight: OptionalNumber;
  upWeight: OptionalNumber;
  keyWeightRatio: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}
