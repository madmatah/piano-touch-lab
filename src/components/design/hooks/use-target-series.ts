import { useKeyboardAnalysis } from '@/hooks/keyboard/use-keyboard-analysis';

import type { TargetSeries } from './use-target-series-generators';

export const useTargetSeries = (): TargetSeries =>
  useKeyboardAnalysis().targetSeries;
