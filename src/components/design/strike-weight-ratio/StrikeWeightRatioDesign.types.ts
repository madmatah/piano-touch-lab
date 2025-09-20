import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

export type StrikeWeightRatioDesignSmoothTarget =
  | SmoothStrategy.Mean
  | SmoothStrategy.Median;

export type StrikeWeightRatioDesignTarget =
  | number
  | StrikeWeightRatioDesignSmoothTarget
  | null;

export interface StrikeWeightRatioDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export enum StrikeWeightRatioDesignMode {
  AsMeasured = 'as-measured',
  FixedValue = 'fixed-value',
  Smoothed = 'smoothed',
}
