import type { KeyboardLike, KeyWith } from '../keyboard';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from './measured-key.requirements';

export interface TouchWeightKeyAnalysis extends MeasuredKeyRequirements {
  balanceWeight: OptionalNumber;
  frictionWeight: OptionalNumber;
  strikeWeightRatio: OptionalNumber;
  wippenBalanceWeight: number;
}

export type TouchWeightAnalyzedKey = KeyWith<TouchWeightKeyAnalysis>;
export type TouchWeightAnalyzedKeyboard = KeyboardLike<TouchWeightAnalyzedKey>;
