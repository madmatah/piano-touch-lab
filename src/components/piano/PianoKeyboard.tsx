import { useCallback, useMemo } from 'react';

import {
  findKeyAtBackPosition,
  findKeyAtPosition,
} from '@/lib/piano/keyboard/keyboard-geometry';
import type { Key } from '@/lib/piano/keyboard/key';
import { cn } from '@/lib/utils';

import {
  computeKeyboardDrawing,
  type KeyboardDrawingOptions,
} from './keyboard-drawing';
import { KeyboardLabelRow, type PianoKeyboardLabel } from './KeyboardLabelRow';
import {
  KeyboardPlate,
  keybedHeight,
  type PianoKeyTone,
} from './KeyboardPlate';

export interface PianoKeyboardProps {
  className?: string;
  /** Read out to screen readers; the drawing itself carries no text. */
  description: string;
  geometry?: KeyboardDrawingOptions;
  /** The key being read right now, painted brass wherever it sits. */
  highlightedKey?: number | null;
  keys: readonly Key[];
  labels?: readonly PianoKeyboardLabel[];
  onKeyHover?: (keyNumber: number | null) => void;
  onKeySelect?: (keyNumber: number) => void;
  toneByKeyNumber?: ReadonlyMap<number, PianoKeyTone>;
}

/**
 * The keyboard of the instrument, drawn to scale.
 *
 * It appears as a figure of its own on the piano and home pages, and as the
 * x axis under every chart, so that a reader finds a note by looking at the
 * keyboard rather than by reading an axis label.
 */
export const PianoKeyboard = ({
  className,
  description,
  geometry: geometryOptions,
  highlightedKey,
  keys,
  labels,
  onKeyHover,
  onKeySelect,
  toneByKeyNumber,
}: PianoKeyboardProps) => {
  const geometry = useMemo(
    () => computeKeyboardDrawing(keys, geometryOptions),
    [keys, geometryOptions],
  );

  const height = keybedHeight(geometry);

  /**
   * Turns a pointer position over the drawing into a key number.
   *
   * Over the key sticks the keys are evenly spaced, over the keys they are
   * not, so the pointer is read against whichever of the two it is on —
   * otherwise pointing at a stick would light the key beside it.
   */
  const keyAtEvent = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) {
        return null;
      }
      const x = ((event.clientX - bounds.left) / bounds.width) * geometry.width;
      const y = ((event.clientY - bounds.top) / bounds.height) * height;
      return y < geometry.leverHeight
        ? findKeyAtBackPosition(geometry, x)
        : findKeyAtPosition(geometry, x);
    },
    [geometry, height],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      onKeyHover?.(keyAtEvent(event));
    },
    [keyAtEvent, onKeyHover],
  );

  const handleMouseLeave = useCallback(() => {
    onKeyHover?.(null);
  }, [onKeyHover]);

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const keyNumber = keyAtEvent(event);
      if (keyNumber !== null) {
        onKeySelect?.(keyNumber);
      }
    },
    [keyAtEvent, onKeySelect],
  );

  /** A label sits under the key a player would press, not under its stick. */
  const placeOf = useCallback(
    (keyNumber: number) =>
      (geometry.keysByNumber.get(keyNumber)?.center ?? 0) / geometry.width,
    [geometry],
  );

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${geometry.width} ${height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={description}
        onMouseMove={onKeyHover ? handleMouseMove : undefined}
        onMouseLeave={onKeyHover ? handleMouseLeave : undefined}
        onClick={onKeySelect ? handleClick : undefined}
      >
        <KeyboardPlate
          geometry={geometry}
          highlightedKey={highlightedKey}
          toneByKeyNumber={toneByKeyNumber}
        />
      </svg>
      {labels?.length ? (
        <KeyboardLabelRow labels={labels} placeOf={placeOf} />
      ) : null}
    </div>
  );
};
