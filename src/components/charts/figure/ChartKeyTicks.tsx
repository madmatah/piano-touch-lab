import { useCallback, useMemo } from 'react';

import {
  KeyboardLabelRow,
  type PianoKeyboardLabel,
} from '@/components/piano/KeyboardLabelRow';
import type { Key } from '@/lib/piano/keyboard/key';
import { isOctaveStart } from '@/lib/piano/keyboard/keyboard-geometry';

import { PLOT_BOX_MARGIN } from '../chart-geometry';
import { GRID_TOP } from '../echarts/build-base-option';

export interface ChartKeyTicksProps {
  className?: string;
  keys: readonly Key[];
  labels?: readonly PianoKeyboardLabel[];
}

/** The ruler, in pixels: a short tick for every key, a long one for every C. */
const RULER = {
  height: 10,
  keyTick: 4,
  octaveTick: 9,
} as const;

/**
 * The x axis of a chart on paper.
 *
 * The drawn keyboard is a landmark worth its height on a screen you can
 * scrub along; on a sheet it would cost a fifth of the figure. What a sheet
 * keeps is a tick for every key and a longer one for every C, named
 * underneath — the names alone left a reader counting keys by eye.
 * The ticks stand at the balance rail slots the plot is ruled by, so every
 * measurement stands right over the tick of its key.
 */
export const ChartKeyTicks = ({
  className,
  keys,
  labels,
}: ChartKeyTicksProps) => {
  const ticks = useMemo(() => {
    const at = (isOctave: boolean, length: number) =>
      keys
        .map((key, index) =>
          isOctaveStart(key) === isOctave ? `M${index + 0.5} 0V${length}` : '',
        )
        .join('');
    return {
      keys: at(false, RULER.keyTick),
      octaves: at(true, RULER.octaveTick),
    };
  }, [keys]);

  const placeOf = useCallback(
    (keyNumber: number) =>
      (keys.findIndex((key) => key.number === keyNumber) + 0.5) / keys.length,
    [keys],
  );

  return (
    // Hung from the bottom rule of the plot, in the room its box keeps under
    // the grid: the ticks read as the plot's own axis, and the sheet carries
    // them at no height of their own — a figure that filled it still does.
    <div
      className={className}
      style={{ marginTop: -(PLOT_BOX_MARGIN - GRID_TOP) }}
    >
      {/* Stretched to the width of the plot: only its strokes, which do not scale, are drawn. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${keys.length} ${RULER.height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: RULER.height }}
      >
        <path
          d={ticks.keys}
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          className="stroke-ptl-ink-3"
        />
        <path
          d={ticks.octaves}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          className="stroke-ptl-rule-strong"
        />
      </svg>
      {labels?.length ? (
        <KeyboardLabelRow labels={labels} placeOf={placeOf} />
      ) : null}
    </div>
  );
};
