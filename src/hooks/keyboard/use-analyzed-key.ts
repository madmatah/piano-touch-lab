import {
  touchWeightAnalyzerRequirementsSymbol,
  type TouchWeightAnalyzerRequirements,
} from '@/lib/piano/touch-design/touch-weight-analyzer/touch-weight-analyzer-requirements';
import { useMeasuredKey } from './use-measured-key';
import { useInjection } from 'inversify-react';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useMemo } from 'react';

export const useAnalyzedKey = (
  keyNumber: number,
): { analyzedKey: TouchWeightKeyAnalysis | undefined } => {
  const { measuredKey } = useMeasuredKey(keyNumber);
  const touchWeightAnalyzer = useInjection<TouchWeightAnalyzerRequirements>(
    touchWeightAnalyzerRequirementsSymbol,
  );

  const analyzedKey = useMemo(() => {
    if (measuredKey !== undefined) {
      return touchWeightAnalyzer.analyzeKey(measuredKey);
    }
  }, [measuredKey, touchWeightAnalyzer]);

  return { analyzedKey };
};
