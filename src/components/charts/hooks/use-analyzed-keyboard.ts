import { useInjection } from 'inversify-react';
import { useMemo } from 'react';
import {
  touchWeightAnalyzerRequirementsSymbol,
  type TouchWeightAnalyzerRequirements,
} from '@/lib/piano/touch-design/touch-weight-analyzer-requirements';
import { useMeasuredKeyboard } from '@/hooks/use-measure-store';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export const useAnalyzedKeyboard = (): TouchWeightAnalyzedKeyboard => {
  const touchWeightAnalyzer = useInjection<TouchWeightAnalyzerRequirements>(
    touchWeightAnalyzerRequirementsSymbol,
  );
  const measuredKeyboard = useMeasuredKeyboard();

  const analyzedKeyboard: TouchWeightAnalyzedKeyboard = useMemo(
    () => measuredKeyboard.map((key) => touchWeightAnalyzer.analyzeKey(key)),
    [measuredKeyboard, touchWeightAnalyzer],
  );

  return analyzedKeyboard;
};
