import {
  DEFAULT_KEY_WEIGHT_RATIO,
  DEFAULT_WIPPEN_RADIUS_WEIGHT,
} from './constants';
import type {
  KeyMeasureRequirements,
  MeasureRequirements,
  OptionalNumber,
} from './measure-requirements';
import type { TouchWeightAnalyzerRequirements } from './touch-weight-analyzer-requirements';
import type {
  TouchWeightDataRequirements,
  TouchWeightKeyData,
} from './touch-weight-data.requirements';

export class TouchWeightAnalyzer implements TouchWeightAnalyzerRequirements {
  public analyze(input: MeasureRequirements): TouchWeightDataRequirements {
    const keyWeightRatio = input.keyWeightRatio ?? DEFAULT_KEY_WEIGHT_RATIO;
    const wippenRadiusWeight =
      input.wippenRadiusWeight ?? DEFAULT_WIPPEN_RADIUS_WEIGHT;
    const wippenBalanceWeight = this.computeWippenBalanceWeight(
      keyWeightRatio,
      wippenRadiusWeight,
    );
    return {
      keyWeightRatio,
      keys: input.keys.map((keyMeasurements) =>
        this.analyzeKey(keyMeasurements, wippenBalanceWeight),
      ),
      wippenBalanceWeight,
      wippenRadiusWeight,
    };
  }

  private analyzeKey(
    keyMeasurements: KeyMeasureRequirements,
    wippenBalanceWeight: number,
  ): TouchWeightKeyData {
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
    };
  }

  private computeBalanceWeight(
    keyMeasurements: KeyMeasureRequirements,
  ): OptionalNumber {
    const { upWeight, downWeight } = keyMeasurements;

    if (upWeight === null || downWeight === null) {
      return null;
    }

    return (downWeight + upWeight) / 2;
  }

  private computeFrictionWeight(
    keyMeasurements: KeyMeasureRequirements,
  ): OptionalNumber {
    const { upWeight, downWeight } = keyMeasurements;

    if (upWeight === null || downWeight === null) {
      return null;
    }

    return (downWeight - upWeight) / 2;
  }

  private computeStrikeWeightRatio(
    keyMeasurements: KeyMeasureRequirements,
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
