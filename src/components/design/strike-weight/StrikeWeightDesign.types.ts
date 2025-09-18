import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

export enum StrikeWeightDesignMode {
  AsMeasured = 'as-measured',
  StandardCurves = 'standard-curves',
  Smoothed = 'smoothed',
}

export type StrikeWeightDesignTarget =
  | StrikeWeightLevel
  | SmoothStrategy
  | null;

export interface StrikeWeightDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}
