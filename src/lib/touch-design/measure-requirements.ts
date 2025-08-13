export type NumericUserInput = number | null;

export interface KeyMeasureRequirements {
  downWeight: NumericUserInput;
  frontWeight: NumericUserInput;
  strikeWeight: NumericUserInput;
  upWeight: NumericUserInput;
}

export interface MeasureRequirements {
  keys: KeyMeasureRequirements[];
  keyWeightRatio: NumericUserInput;
  version: number;
  wippenWeight: NumericUserInput;
}
