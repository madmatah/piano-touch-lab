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
    } = key.payload;

    if (
      !frontWeight ||
      !strikeWeight ||
      !strikeWeightRatio ||
      !frictionWeight ||
      !wippenBalanceWeight
    ) {
      return { ...key.payload, downWeight: null, upWeight: null };
    }

    const balanceWeight =
      strikeWeight * strikeWeightRatio + wippenBalanceWeight - frontWeight;
    const balanceWeightRounded = Math.round(balanceWeight * 10) / 10;
    const upWeight = balanceWeightRounded - frictionWeight;
    const downWeight = balanceWeightRounded + frictionWeight;

    return {
      ...key.payload,
      balanceWeight: balanceWeightRounded,
      downWeight,
      upWeight,
    };
  }
}
