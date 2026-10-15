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
 */
export const MEASURE_PASSES: MeasurePass[] = [
  {
    fields: ['downWeightWithoutSpringSupport', 'upWeight'],
    id: 'down-up',
    number: 1,
  },
  { fields: ['frontWeight'], id: 'front-weight', number: 2 },
  { fields: ['strikeWeight'], id: 'strike-weight', number: 3 },
];
