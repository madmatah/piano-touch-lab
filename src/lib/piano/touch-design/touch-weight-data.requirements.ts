import type {
  KeyMeasureRequirements,
  MeasureRequirements,
  OptionalNumber,
} from './measure-requirements';

export interface TouchWeightKeyData extends KeyMeasureRequirements {
  balanceWeight: OptionalNumber;
  frictionWeight: OptionalNumber;
}

export interface TouchWeightDataRequirements extends MeasureRequirements {
  keys: TouchWeightKeyData[];
}
