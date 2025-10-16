import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export enum WippenSupportSpringsDesignMode {
  None = 'none',
  AsMeasured = 'as-measured',
  Constant = 'constant',
  SmoothTransition = 'smooth-transition',
}

export interface WippenTensionDesign {
  numberOfSprings: number;
  springBalanceWeight: number;
  tensionDropIndex?: number;
}

export type WippenSupportSpringsDesignTarget =
  | null
  | number
  | WippenTensionDesign;

export interface WippenSupportSpringsDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
}
