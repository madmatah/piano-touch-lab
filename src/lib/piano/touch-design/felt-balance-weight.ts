import type { OptionalNumber } from './measured-key.requirements';
import type { TouchWeightKeyAnalysis } from './touch-weight-key-analysis';

/**
 * The balance weight a hand feels at the key: the static balance weight, less
 * what the wippen support spring carries.
 *
 * `TouchWeightAnalyzer` defines the balance weight as the mean of the down and
 * up weights measured with no spring helping, and `TouchWeightPreviewer` keeps
 * that definition when it works out the touch a design gives. But
 * `FrontWeightCalculator` sizes the front weight so that the balance weight
 * *left over the springs* lands on the target: a design that fits springs
 * therefore previews a static balance weight one spring's worth above the
 * figure its author asked for.
 *
 * It holds for a measured key as for a designed one: the spring is the one
 * measured — none unless the option to measure it is on — or the one designed.
 * Every surface that compares the two, or names the balance weight of a
 * design — the preview, the step bar, the home page figure, the data sheet —
 * means the one a hand feels, so they all read it through here.
 */
export const feltBalanceWeight = (
  key: TouchWeightKeyAnalysis,
): OptionalNumber =>
  feltWeight(key.balanceWeight, key.supportSpringBalanceWeight);

/** Any weight at the key — down, up or balance — less what the spring carries. */
export const feltWeight = (
  weight: OptionalNumber,
  supportSpringBalanceWeight: OptionalNumber,
): OptionalNumber =>
  weight === null ? null : weight - (supportSpringBalanceWeight ?? 0);
