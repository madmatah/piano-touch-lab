import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';

export const touchWeightPreviewerRequirementsSymbol = Symbol(
  'TouchWeightPreviewerRequirements',
);

export interface TouchWeightPreviewerRequirements {
  computeTouchWeight(key: TouchWeightAnalyzedKey): TouchWeightKeyAnalysis;
}
