import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from './touch-weight-key-analysis';
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

    if (
      !frontWeight ||
      !strikeWeight ||
      !strikeWeightRatio ||
      !frictionWeight ||
      !wippenBalanceWeight
    ) {
      return {
        ...key.payload,
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
