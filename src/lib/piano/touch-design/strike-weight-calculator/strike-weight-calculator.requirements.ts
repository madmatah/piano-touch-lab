import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';

export const strikeWeightCalculatorRequirementsSymbol = Symbol(
  'StrikeWeightCalculatorRequirements',
);

export interface StrikeWeightCalculatorRequirements {
  calculateStrikeWeight(
    key: TouchWeightAnalyzedKey,
    targetBalanceWeight: number,
  ): TouchWeightKeyAnalysis;
}
