import type {
  KeyMeasureRequirements,
  MeasureRequirements,
  OptionalNumber,
} from './measure-requirements';

export interface TouchWeightKeyData extends KeyMeasureRequirements {
  balanceWeight: OptionalNumber;
  frictionWeight: OptionalNumber;
  strikeWeightRatio: OptionalNumber;
}

export interface TouchWeightDataRequirements extends MeasureRequirements {
  keys: TouchWeightKeyData[];
  wippenBalanceWeight: number;
}
