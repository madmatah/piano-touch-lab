export type OptionalNumber = number | null;

export interface MeasuredKeyRequirements {
  downWeight: OptionalNumber;
  frontWeight: OptionalNumber;
  keyWeightRatio: OptionalNumber;
  measuredStrikeWeightRatio: OptionalNumber;
  strikeWeight: OptionalNumber;
  upWeight: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}
