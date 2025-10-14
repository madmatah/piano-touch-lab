import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export enum WippenSupportSpringsDesignMode {
  None = 'none',
  AsMeasured = 'as-measured',
}

export type WippenSupportSpringsDesignTarget = null;

export interface WippenSupportSpringsDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
}
