export type OptionalNumber = number | null;

export interface KeyMeasureRequirements {
  downWeight: OptionalNumber;
  frontWeight: OptionalNumber;
  strikeWeight: OptionalNumber;
  upWeight: OptionalNumber;
}

export interface MeasureRequirements {
  keys: KeyMeasureRequirements[];
  keyWeightRatio: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}
