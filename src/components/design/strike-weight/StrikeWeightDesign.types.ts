import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

export enum StrikeWeightDesignMode {
  STANDARD_CURVES = 'standard_curves',
  SMOOTHED = 'smoothed',
}

export type StrikeWeightDesignTarget = StrikeWeightLevel | SmoothStrategy;

export interface StrikeWeightDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}
