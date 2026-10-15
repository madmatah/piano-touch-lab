import { useMemo } from 'react';

import {
  computeKeyboardGeometry,
  type KeyboardGeometryOptions,
} from '@/lib/piano/keyboard/keyboard-geometry';
import type { Key } from '@/lib/piano/keyboard/key';
import { cn } from '@/lib/utils';

/**
 * How a single key is painted: plain, tinted brass (a key already measured,
 * or an end of the range) or the red felt of the key being worked on.
 */
export type PianoKeyTone = 'plain' | 'marked' | 'current';

export interface PianoKeyboardLabel {
  /** The key the label sits under, or an edge of the keyboard. */
  at: number | 'start' | 'end';
  text: string;
  isMuted?: boolean;
}

export interface PianoKeyboardProps {
  className?: string;
  /** Read out to screen readers; the drawing itself carries no text. */
  description: string;
  geometry?: KeyboardGeometryOptions;
  keys: readonly Key[];
  labels?: readonly PianoKeyboardLabel[];
  toneByKeyNumber?: ReadonlyMap<number, PianoKeyTone>;
}

const LABEL_HEIGHT = 20;
/** The keybed shows a sliver of itself below the front of the keys. */
const KEYBED_OVERHANG = 3;

const joinPaths = (paths: string[]) => paths.join('');

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
  keys,
  labels,
  toneByKeyNumber,
}: PianoKeyboardProps) => {
  const geometry = useMemo(
    () => computeKeyboardGeometry(keys, geometryOptions),
    [keys, geometryOptions],
  );

  const paths = useMemo(() => {
    const toneOf = (keyNumber: number) =>
      toneByKeyNumber?.get(keyNumber) ?? 'plain';
    const pick = (
      source: typeof geometry.whiteKeys,
      tone: PianoKeyTone,
    ): string =>
      joinPaths(
        source.filter((key) => toneOf(key.number) === tone).map((k) => k.path),
      );

    return {
      blackMarked: pick(geometry.blackKeys, 'marked'),
      blacks: joinPaths(geometry.blackKeys.map((key) => key.path)),
      current: joinPaths(
        [...geometry.whiteKeys, ...geometry.blackKeys]
          .filter((key) => toneOf(key.number) === 'current')
          .map((key) => key.path),
      ),
      whiteMarked: pick(geometry.whiteKeys, 'marked'),
      whites: joinPaths(geometry.whiteKeys.map((key) => key.path)),
    };
  }, [geometry, toneByKeyNumber]);

  const keybedHeight = geometry.height + KEYBED_OVERHANG;
  const totalHeight = keybedHeight + (labels?.length ? LABEL_HEIGHT : 0);

  const labelPosition = (at: PianoKeyboardLabel['at']) => {
    if (at === 'start') {
      return { anchor: 'start' as const, x: 0 };
    }
    if (at === 'end') {
      return { anchor: 'end' as const, x: geometry.width };
    }
    return {
      anchor: 'middle' as const,
      x: geometry.keysByNumber.get(at)?.center ?? 0,
    };
  };

  return (
    <svg
      viewBox={`0 0 ${geometry.width} ${totalHeight}`}
      className={cn('block h-auto w-full', className)}
      role="img"
      aria-label={description}
    >
      <rect
        x="0"
        y="0"
        width={geometry.width}
        height={keybedHeight}
        rx="3"
        className="fill-ptl-keybed"
      />
      <rect
        x="0"
        y="0"
        width={geometry.width}
        height={geometry.feltHeight}
        className="fill-ptl-felt"
      />
      <path
        d={paths.whites}
        strokeWidth="0.8"
        className="fill-ptl-key-white stroke-ptl-key-white-edge"
      />
      {paths.whiteMarked && (
        <path d={paths.whiteMarked} className="fill-ptl-key-white-done" />
      )}
      <path d={paths.blacks} className="fill-ptl-key-black" />
      {paths.blackMarked && (
        <path d={paths.blackMarked} className="fill-ptl-key-black-done" />
      )}
      {paths.current && <path d={paths.current} className="fill-ptl-current" />}
      {labels?.length ? (
        <g
          className="fill-muted-foreground font-mono"
          fontSize="12"
          aria-hidden="true"
        >
          {labels.map((label) => {
            const { anchor, x } = labelPosition(label.at);
            return (
              <text
                key={`${String(label.at)}-${label.text}`}
                x={x}
                y={totalHeight - 4}
                textAnchor={anchor}
                className={label.isMuted ? 'fill-ptl-ink-3' : undefined}
              >
                {label.text}
              </text>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
};
