import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export interface StrikeWeightRatioDesignProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  notEnoughDataErrorDescription: string;
  notEnoughDataErrorTitle: string;
  requiredDataPercentage: number;
}
