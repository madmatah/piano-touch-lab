import type { FrontWeightCalculatorRequirements } from './front-weight-calculator.requirements';
import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';

export class FrontWeightCalculator
  implements FrontWeightCalculatorRequirements
{
  public calculateFrontWeight(
    key: TouchWeightAnalyzedKey,
    targetBalanceWeight: number,
  ): TouchWeightKeyAnalysis {
    const {
      strikeWeight,
      strikeWeightRatio,
      frictionWeight,
      wippenBalanceWeight,
    } = key.payload;

    if (
      !strikeWeight ||
      !strikeWeightRatio ||
      !frictionWeight ||
      !wippenBalanceWeight
    ) {
      return {
        ...key.payload,
        frontWeight: null,
      };
    }

    const supportSpringBalanceWeight =
      key.payload?.supportSpringBalanceWeight ?? 0;

    const frontWeight =
      wippenBalanceWeight +
      strikeWeightRatio * strikeWeight -
      targetBalanceWeight -
      supportSpringBalanceWeight;

    return {
      ...key.payload,
      frontWeight,
    };
  }
}
