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
 * It is inset by exactly the margins of the plot above it, so the key under a
 * measurement is the key it was taken on.
 */
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
      style={{
        marginLeft: PLOT_INSET.left - PLOT_INSET.bedBleed,
        marginRight: PLOT_INSET.right - PLOT_INSET.bedBleed,
      }}
    >
      <PianoKeyboard
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
