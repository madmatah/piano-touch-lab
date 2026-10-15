import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

/** How the strike weight ratio of every key is chosen. */
export enum StrikeWeightRatioDesignMode {
  AsMeasured = 'as-measured',
  FixedValue = 'fixed-value',
  Smoothed = 'smoothed',
}

export type StrikeWeightRatioDesignSmoothTarget =
  | SmoothStrategy.Mean
  | SmoothStrategy.Median;

export type StrikeWeightRatioDesignTarget =
  | number
  | StrikeWeightRatioDesignSmoothTarget
  | null;
