import type { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';

export type FrontWeightDesignTarget = FrontWeightLevel;

export interface FrontWeightDesignProps {
  requiredDataPercentage: number;
  notEnoughDataErrorTitle: string;
  notEnoughDataErrorDescription: string;
}

export enum FrontWeightDesignMode {
  STANDARD_CURVES = 'STANDARD_CURVES',
}
