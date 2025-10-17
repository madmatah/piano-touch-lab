import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export type FrontWeightDesignTarget = number | null;

export interface FrontWeightDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  notEnoughDataErrorDescription: string;
  notEnoughDataErrorTitle: string;
  requiredDataPercentage: number;
}

export enum FrontWeightDesignMode {
  StandardCurves = 'standard-curves',
  AsMeasured = 'as-measured',
}
