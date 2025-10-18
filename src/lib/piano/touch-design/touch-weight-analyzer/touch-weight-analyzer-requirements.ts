import type { KeyWith } from '../../keyboard';
import type { MeasuredKeyRequirements } from '../measured-key.requirements';
import type { TouchWeightKeyAnalysis } from '../touch-weight-key-analysis';

export const touchWeightAnalyzerRequirementsSymbol = Symbol(
  'TouchWeightAnalyzerRequirements',
);

export interface TouchWeightAnalyzerRequirements {
  analyzeKey(key: KeyWith<MeasuredKeyRequirements>): TouchWeightKeyAnalysis;
}
