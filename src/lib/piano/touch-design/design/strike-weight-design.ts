import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

/** How the strike weight of every key is chosen. */
export enum StrikeWeightDesignMode {
  AsMeasured = 'as-measured',
  Computed = 'computed',
  StandardCurves = 'standard-curves',
  Smoothed = 'smoothed',
}

export type StrikeWeightDesignSmoothTarget =
  | SmoothStrategy.Loess
  | SmoothStrategy.LeastSquaresRegression;

export type StrikeWeightDesignTarget =
  | StrikeWeightLevel
  | StrikeWeightDesignSmoothTarget
  | number
  | null;
