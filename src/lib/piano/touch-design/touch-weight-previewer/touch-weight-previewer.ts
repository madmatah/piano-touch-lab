import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';
import type { TouchWeightPreviewerRequirements } from './touch-weight-previewer.requirements';

export class TouchWeightPreviewer implements TouchWeightPreviewerRequirements {
  public computeTouchWeight(
    key: TouchWeightAnalyzedKey,
  ): TouchWeightKeyAnalysis {
    const {
      frontWeight,
      strikeWeight,
      strikeWeightRatio,
      frictionWeight,
      wippenBalanceWeight,
      supportSpringBalanceWeight,
    } = key.payload;

    // A front weight or a friction can read 0 g, and that is a reading. A
    // hammer, a ratio or a wippen cannot weigh nothing: 0 there is a field
    // left blank.
    if (
      frontWeight === null ||
      !strikeWeight ||
      !strikeWeightRatio ||
      frictionWeight === null ||
      !wippenBalanceWeight
    ) {
      // Every weight the design produces is cleared, not just two of them:
      // what the key measured would otherwise be read as what it was given.
      return {
        ...key.payload,
        balanceWeight: null,
        downWeightWithSpringSupport: null,
        downWeightWithoutSpringSupport: null,
        upWeight: null,
      };
    }

    const balanceWeight =
      strikeWeight * strikeWeightRatio + wippenBalanceWeight - frontWeight;
    const balanceWeightRounded = Math.round(balanceWeight * 10) / 10;
    const upWeight = balanceWeightRounded - frictionWeight;
    const downWeight = balanceWeightRounded + frictionWeight;

    const downWeightWithSpringSupport = supportSpringBalanceWeight
      ? downWeight - supportSpringBalanceWeight
      : downWeight;

    return {
      ...key.payload,
      balanceWeight: balanceWeightRounded,
      downWeightWithSpringSupport,
      downWeightWithoutSpringSupport: downWeight,
      upWeight,
    };
  }
}
