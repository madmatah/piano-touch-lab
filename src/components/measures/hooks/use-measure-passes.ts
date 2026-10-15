import { useMemo } from 'react';

import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

export type MeasurePassId = 'down-up' | 'front-weight' | 'strike-weight';

export interface MeasurePass {
  /** The fields the pass asks for, in the order they are filled. */
  fields: (keyof MeasuredKeyRequirements)[];
  id: MeasurePassId;
  /** Shown before the label, as the mockups number the passes. */
  number: number;
}

/**
 * The three passes of a measuring session.
 *
 * A technician does not fill a key and move on; they go down the keyboard once
 * per quantity, gauge in hand. The table follows that: the pass in hand is at
 * full contrast, the rest recedes.
 *
 * Two of the quantities are optional, and a pass only claims one when its
 * option is on — otherwise its column would never leave the background, and
 * the pass would report no progress whatever the reader filled in.
 */
export const useMeasurePasses = (): MeasurePass[] => {
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();

  return useMemo(
    () => [
      {
        // The spring reading is taken at the same key, in the same breath as
        // the down weight: it belongs to this pass, not to one of its own.
        fields: [
          ...(useSupportSpringMeasurements
            ? (['downWeightWithSpringSupport'] as const)
            : []),
          'downWeightWithoutSpringSupport',
          'upWeight',
        ],
        id: 'down-up',
        number: 1,
      },
      { fields: ['frontWeight'], id: 'front-weight', number: 2 },
      {
        // The hand-measured ratio is read off the same hammer as its weight.
        fields: [
          'strikeWeight',
          ...(useManualSWRMeasurements
            ? (['measuredStrikeWeightRatio'] as const)
            : []),
        ],
        id: 'strike-weight',
        number: 3,
      },
    ],
    [useManualSWRMeasurements, useSupportSpringMeasurements],
  );
};
