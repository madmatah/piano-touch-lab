import type { StrikeWeightCalculatorRequirements } from './strike-weight-calculator.requirements';
import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';

export class StrikeWeightCalculator
  implements StrikeWeightCalculatorRequirements
{
  public calculateStrikeWeight(
    key: TouchWeightAnalyzedKey,
    targetBalanceWeight: number,
  ): TouchWeightKeyAnalysis {
    const {
      frontWeight,
      strikeWeightRatio,
      frictionWeight,
      wippenBalanceWeight,
    } = key.payload;

    if (
      frontWeight === null ||
      frontWeight === undefined ||
      !strikeWeightRatio ||
      !frictionWeight ||
      !wippenBalanceWeight
    ) {
      return {
        ...key.payload,
        strikeWeight: null,
      };
    }

    const supportSpringBalanceWeight =
      key.payload?.supportSpringBalanceWeight ?? 0;

    const strikeWeight =
      (targetBalanceWeight +
        frontWeight +
        supportSpringBalanceWeight -
        wippenBalanceWeight) /
      strikeWeightRatio;

    return {
      ...key.payload,
      strikeWeight: strikeWeight,
    };
  }
}
