import { useMemo } from 'react';

import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { CHART_HEIGHTS, PLOT_INSET } from '../chart-geometry';
import type { Key } from '@/lib/piano/keyboard/key';
import { octaveMarks } from '@/lib/piano/keyboard/keyboard-geometry';

export interface ChartKeyboardAxisProps {
  description: string;
  highlightedKey?: number | null;
  keys: readonly Key[];
  /** Show every C, or every other one when the figure is narrow. */
  marks?: 'all' | 'sparse' | 'none';
  onKeyHover?: (keyNumber: number | null) => void;
}

/**
 * The keyboard standing in for the x axis.
 *
 * It is inset by exactly the margins of the plot above it, and the plot is
 * ruled by the balance rail, where every key gets the same slot. A reading
 * therefore sits above the back of its own key, and the wood of the key fans
 * out from there to the front — which is what a grand does, and why the
 * sticks are drawn here rather than a bare keyboard.
 */
/** Hoisted: a fresh object would re-cut all 88 keys on every render. */
const KEYBOARD_GEOMETRY = { leverHeight: 46 };

export const ChartKeyboardAxis = ({
  description,
  highlightedKey,
  keys,
  marks = 'all',
  onKeyHover,
}: ChartKeyboardAxisProps) => {
  const labels = useMemo(() => {
    if (marks === 'none') {
      return undefined;
    }
    return octaveMarks(keys)
      .filter((mark, index) => marks === 'all' || index % 2 === 0)
      .map((mark) => ({
        at: mark.number,
        isStrong: mark.number === highlightedKey,
        text: mark.label,
      }));
  }, [highlightedKey, keys, marks]);

  return (
    <div
      data-slot="chart-keyboard"
      style={{
        marginLeft: PLOT_INSET.left,
        marginRight: PLOT_INSET.right,
      }}
    >
      <PianoKeyboard
        geometry={KEYBOARD_GEOMETRY}
        keys={keys}
        description={description}
        highlightedKey={highlightedKey}
        labels={labels}
        onKeyHover={onKeyHover}
        stretchToHeight={CHART_HEIGHTS.keyboard}
      />
    </div>
  );
};
