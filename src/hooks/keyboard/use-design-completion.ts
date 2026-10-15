import { useMemo } from 'react';

import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

/** A design is considered complete once most keys carry a down weight. */
export const DESIGN_COMPLETION_RATIO = 0.8;

/**
 * Whether the design resolves into a keyboard one can act on.
 *
 * The sidebar opens its last two pages on it, and the home page reads it to
 * know whether it can show the touch the reader is heading for; the two have
 * to agree, hence the one predicate.
 */
export const useIsDesignCompleted = (
  designedKeyboard: TouchWeightAnalyzedKeyboard,
): boolean =>
  useMemo(
    () =>
      designedKeyboard
        .mapToArray((key) => key.payload.downWeightWithoutSpringSupport)
        .filter((weight) => weight !== undefined && weight !== null).length >=
      Math.round(designedKeyboard.size * DESIGN_COMPLETION_RATIO),
    [designedKeyboard],
  );
