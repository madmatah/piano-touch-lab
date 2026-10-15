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

    // A front weight or a friction can read 0 g, and that is a reading. A
    // ratio or a wippen cannot weigh nothing: 0 there is a field left blank,
    // and the ratio is divided by.
    if (
      frontWeight === null ||
      frontWeight === undefined ||
      !strikeWeightRatio ||
      frictionWeight === null ||
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
