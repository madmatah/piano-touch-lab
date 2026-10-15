import { useMemo } from 'react';

import { type PianoKeyTone } from '@/components/piano/KeyboardPlate';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { useElementWidth } from '@/hooks/use-element-width';

import { chartKeyboardLayout, PLOT_INSET } from '../chart-geometry';
import { ChartKeyTicks } from './ChartKeyTicks';
import type { Key } from '@/lib/piano/keyboard/key';
import { KeyColor } from '@/lib/piano/keyboard/key-color.enum';
import { octaveMarks } from '@/lib/piano/keyboard/keyboard-geometry';

export interface ChartKeyboardAxisProps {
  description: string;
  highlightedKey?: number | null;
  keys: readonly Key[];
  /**
   * The keys the figure is about — those the springs are on — their white
   * keys washed in brass. The black keys among them keep their colour, as in
   * the mockup: a run of washed white keys already takes them in.
   */
  markedKeys?: ReadonlySet<number>;
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
export const ChartKeyboardAxis = ({
  description,
  highlightedKey,
  keys,
  markedKeys,
  marks = 'all',
  onKeyHover,
}: ChartKeyboardAxisProps) => {
  const [axis, width] = useElementWidth<HTMLDivElement>();

  // Laid out for the width it is given rather than stretched to it, so that
  // a key keeps the shape of a key at any width of the plot.
  const whiteKeyCount = useMemo(
    () => keys.filter((key) => key.color === KeyColor.White).length,
    [keys],
  );
  const geometry = useMemo(
    () => chartKeyboardLayout(width, whiteKeyCount),
    [whiteKeyCount, width],
  );

  const tones = useMemo(
    () =>
      markedKeys
        ? new Map<number, PianoKeyTone>(
            keys
              .filter(
                (key) =>
                  key.color === KeyColor.White && markedKeys.has(key.number),
              )
              .map((key) => [key.number, 'marked']),
          )
        : undefined,
    [keys, markedKeys],
  );

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
      ref={axis}
      data-slot="chart-keyboard"
      style={{
        marginLeft: PLOT_INSET.left,
        marginRight: PLOT_INSET.right,
      }}
    >
      {width > 0 ? (
        <PianoKeyboard
          className="print:hidden"
          geometry={geometry}
          keys={keys}
          description={description}
          highlightedKey={highlightedKey}
          labels={labels}
          onKeyHover={onKeyHover}
          toneByKeyNumber={tones}
        />
      ) : null}
      <ChartKeyTicks
        className="hidden print:block"
        keys={keys}
        labels={labels}
      />
    </div>
  );
};
