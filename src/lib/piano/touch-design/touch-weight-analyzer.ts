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
    const computedStrikeWeightRatio = this.computeStrikeWeightRatio(
      keyMeasurements,
      balanceWeight,
      wippenBalanceWeight,
    );
    const downWeightWithSpringSupport =
      keyMeasurements.downWeightWithSpringSupport ??
      keyMeasurements.downWeightWithoutSpringSupport;

    const supportSpringBalanceWeight = this.computeSupportSpringBalanceWeight(
      keyMeasurements.downWeightWithoutSpringSupport,
      keyMeasurements.downWeightWithSpringSupport,
    );

    return {
      ...keyMeasurements,
      balanceWeight,
      computedStrikeWeightRatio,
      downWeightWithSpringSupport,
      frictionWeight,
      strikeWeightRatio:
        keyMeasurements.measuredStrikeWeightRatio ?? computedStrikeWeightRatio,
      supportSpringBalanceWeight,
      wippenBalanceWeight,
    };
  }
  private computeSupportSpringBalanceWeight(
    downWeightWithoutSpringSupport: OptionalNumber,
    downWeightWithSpringSupport: OptionalNumber,
  ) {
    if (
      downWeightWithoutSpringSupport === null ||
      downWeightWithSpringSupport === null
    ) {
      return null;
    }

    return downWeightWithoutSpringSupport - downWeightWithSpringSupport;
  }

  private computeBalanceWeight(
    keyMeasurements: MeasuredKeyRequirements,
  ): OptionalNumber {
    const { upWeight, downWeightWithoutSpringSupport } = keyMeasurements;

    if (upWeight === null || downWeightWithoutSpringSupport === null) {
      return null;
    }

    return (downWeightWithoutSpringSupport + upWeight) / 2;
  }

  private computeFrictionWeight(
    keyMeasurements: MeasuredKeyRequirements,
  ): OptionalNumber {
    const { upWeight, downWeightWithoutSpringSupport } = keyMeasurements;

    if (upWeight === null || downWeightWithoutSpringSupport === null) {
      return null;
    }

    return (downWeightWithoutSpringSupport - upWeight) / 2;
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
