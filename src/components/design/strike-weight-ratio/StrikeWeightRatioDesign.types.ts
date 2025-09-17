export type StrikeWeightRatioDesignTarget = number | null;

export interface StrikeWeightRatioDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export enum StrikeWeightRatioDesignMode {
  AsMeasured = 'as-measured',
  FixedValue = 'fixed-value',
}
