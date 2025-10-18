import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';

export const frontWeightCalculatorRequirementsSymbol = Symbol(
  'FrontWeightCalculatorRequirements',
);

export interface FrontWeightCalculatorRequirements {
  calculateFrontWeight(
    key: TouchWeightAnalyzedKey,
    targetBalanceWeight: number,
  ): TouchWeightKeyAnalysis;
}
