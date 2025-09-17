export type FrontWeightDesignTarget = number;

export interface FrontWeightDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export enum FrontWeightDesignMode {
  STANDARD_CURVES = 'STANDARD_CURVES',
}
