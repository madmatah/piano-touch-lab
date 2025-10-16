import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export interface AdjustmentSheetProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  designedKeyboard: TouchWeightAnalyzedKeyboard;
}

export interface KeyAdjustmentPayload {
  actualFrontWeight: number;
  actualStrikeWeight: number;
  actualSupportSpringBalanceWeight: number | null;
  targetFrontWeight: number;
  targetStrikeWeight: number;
  targetSupportSpringBalanceWeight: number | null;
}
