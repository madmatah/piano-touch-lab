import type { KeyWith } from '../keyboard';
import {
  DEFAULT_KEY_WEIGHT_RATIO,
  DEFAULT_WIPPEN_RADIUS_WEIGHT,
} from './constants';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from './measured-key.requirements';
import type { TouchWeightAnalyzerRequirements } from './touch-weight-analyzer-requirements';
import type { TouchWeightKeyAnalysis } from './touch-weight-key-analysis';

export class TouchWeightAnalyzer implements TouchWeightAnalyzerRequirements {
  public analyzeKey(
    key: KeyWith<MeasuredKeyRequirements>,
  ): TouchWeightKeyAnalysis {
    const keyMeasurements = key.payload;
    const keyWeightRatio =
      keyMeasurements?.keyWeightRatio ?? DEFAULT_KEY_WEIGHT_RATIO;
    const wippenRadiusWeight =
      keyMeasurements?.wippenRadiusWeight ?? DEFAULT_WIPPEN_RADIUS_WEIGHT;

    const wippenBalanceWeight = this.computeWippenBalanceWeight(
      keyWeightRatio,
      wippenRadiusWeight,
    );
    const balanceWeight = this.computeBalanceWeight(keyMeasurements);
    const frictionWeight = this.computeFrictionWeight(keyMeasurements);
    const strikeWeightRatio = this.computeStrikeWeightRatio(
      keyMeasurements,
      balanceWeight,
      wippenBalanceWeight,
    );

    return {
      ...keyMeasurements,
      balanceWeight,
      frictionWeight,
      strikeWeightRatio,
      wippenBalanceWeight,
    };
  }

  private computeBalanceWeight(
    keyMeasurements: MeasuredKeyRequirements,
  ): OptionalNumber {
    const { upWeight, downWeight } = keyMeasurements;

    if (upWeight === null || downWeight === null) {
      return null;
    }

    return (downWeight + upWeight) / 2;
  }

  private computeFrictionWeight(
    keyMeasurements: MeasuredKeyRequirements,
  ): OptionalNumber {
    const { upWeight, downWeight } = keyMeasurements;

    if (upWeight === null || downWeight === null) {
      return null;
    }

    return (downWeight - upWeight) / 2;
  }

  private computeStrikeWeightRatio(
    keyMeasurements: MeasuredKeyRequirements,
    balanceWeight: OptionalNumber,
    wippenBalanceWeight: number,
  ): OptionalNumber {
    const { frontWeight, strikeWeight } = keyMeasurements;

    if (!strikeWeight || !frontWeight || !balanceWeight) {
      return null;
    }

    return (frontWeight + balanceWeight - wippenBalanceWeight) / strikeWeight;
  }

  private computeWippenBalanceWeight(
    keyWeightRatio: number,
    wippenRadiusWeight: number,
  ): number {
    return keyWeightRatio * wippenRadiusWeight;
  }
}
