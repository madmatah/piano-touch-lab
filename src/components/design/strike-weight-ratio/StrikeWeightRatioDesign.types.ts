import type { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export type StrikeWeightRatioDesignSmoothTarget =
  | SmoothStrategy.Mean
  | SmoothStrategy.Median;

export type StrikeWeightRatioDesignTarget =
  | number
  | StrikeWeightRatioDesignSmoothTarget
  | null;

export interface StrikeWeightRatioDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  notEnoughDataErrorDescription: string;
  notEnoughDataErrorTitle: string;
  requiredDataPercentage: number;
}

export enum StrikeWeightRatioDesignMode {
  AsMeasured = 'as-measured',
  FixedValue = 'fixed-value',
  Smoothed = 'smoothed',
}
