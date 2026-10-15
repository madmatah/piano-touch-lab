import type { OptionalNumber } from './measured-key.requirements';
import type { TouchWeightKeyAnalysis } from './touch-weight-key-analysis';

/**
 * The balance weight a technician will feel once a design is fitted.
 *
 * `TouchWeightAnalyzer` defines the balance weight as the mean of the down and
 * up weights measured with no spring helping, and `TouchWeightPreviewer` keeps
 * that definition when it works out the touch a design gives. But
 * `FrontWeightCalculator` sizes the front weight so that the balance weight
 * *left over the springs* lands on the target: a design that fits springs
 * therefore previews a static balance weight one spring's worth above the
 * figure its author asked for.
 *
 * Every surface that names the balance weight of a design — the preview, the
 * step bar, the home page figure — means the one a hand will feel, so they all
 * read it through here.
 */
export const designedBalanceWeight = (
  key: TouchWeightKeyAnalysis,
): OptionalNumber =>
  key.balanceWeight === null
    ? null
    : key.balanceWeight - (key.supportSpringBalanceWeight ?? 0);
