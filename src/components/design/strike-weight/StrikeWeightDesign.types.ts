import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export enum StrikeWeightDesignMode {
  AsMeasured = 'as-measured',
  StandardCurves = 'standard-curves',
  Smoothed = 'smoothed',
}

export type StrikeWeightDesignSmoothTarget =
  | SmoothStrategy.Loess
  | SmoothStrategy.LeastSquaresRegression;

export type StrikeWeightDesignTarget =
  | StrikeWeightLevel
  | StrikeWeightDesignSmoothTarget
  | null;

export interface StrikeWeightDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  notEnoughDataErrorDescription: string;
  notEnoughDataErrorTitle: string;
  requiredDataPercentage: number;
}
