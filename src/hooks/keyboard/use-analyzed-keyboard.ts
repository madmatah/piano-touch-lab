import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { useKeyboardAnalysis } from './use-keyboard-analysis';

export const useAnalyzedKeyboard = (): TouchWeightAnalyzedKeyboard =>
  useKeyboardAnalysis().analyzedKeyboard;
