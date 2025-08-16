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
    return {
      keyWeightRatio: input.keyWeightRatio,
      keys: input.keys.map((keyMeasurements) =>
        this.analyzeKey(keyMeasurements),
      ),
      wippenWeight: input.wippenWeight,
    };
  }

  private analyzeKey(
    keyMeasurements: KeyMeasureRequirements,
  ): TouchWeightKeyData {
    return {
      ...keyMeasurements,
      balanceWeight: this.computeBalanceWeight(keyMeasurements),
      frictionWeight: this.computeFrictionWeight(keyMeasurements),
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
}
