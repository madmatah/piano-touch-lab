export type FrontWeightDesignTarget = number;

export interface FrontWeightDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export enum FrontWeightDesignMode {
  StandardCurves = 'standard-curves',
}
