import { useCallback, useMemo } from 'react';

import {
  computeKeyboardGeometry,
  findKeyAtPosition,
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
  isMuted?: boolean;
  isStrong?: boolean;
  text: string;
}

export interface PianoKeyboardProps {
  className?: string;
  /** Read out to screen readers; the drawing itself carries no text. */
  description: string;
  geometry?: KeyboardGeometryOptions;
  /** The key being read right now, painted brass wherever it sits. */
  highlightedKey?: number | null;
  keys: readonly Key[];
  labels?: readonly PianoKeyboardLabel[];
  onKeyHover?: (keyNumber: number | null) => void;
  onKeySelect?: (keyNumber: number) => void;
  /**
   * Stretch the drawing to the width of its container at this fixed height,
   * so it can sit under a chart and serve as its x axis.
   */
  stretchToHeight?: number;
  toneByKeyNumber?: ReadonlyMap<number, PianoKeyTone>;
}

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
  highlightedKey,
  keys,
  labels,
  onKeyHover,
  onKeySelect,
  stretchToHeight,
  toneByKeyNumber,
}: PianoKeyboardProps) => {
  const geometry = useMemo(
    () => computeKeyboardGeometry(keys, geometryOptions),
    [keys, geometryOptions],
  );

  const paths = useMemo(() => {
    const toneOf = (keyNumber: number): PianoKeyTone =>
      keyNumber === highlightedKey
        ? 'marked'
        : (toneByKeyNumber?.get(keyNumber) ?? 'plain');
    const pick = (source: typeof geometry.whiteKeys, tone: PianoKeyTone) =>
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
  }, [geometry, highlightedKey, toneByKeyNumber]);

  const keybedHeight = geometry.height + KEYBED_OVERHANG;

  /** Turns a pointer position over the drawing into a key number. */
  const keyAtEvent = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (bounds.width === 0) {
        return null;
      }
      const position =
        ((event.clientX - bounds.left) / bounds.width) * geometry.width;
      return findKeyAtPosition(geometry, position);
    },
    [geometry],
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

  const labelPosition = (at: PianoKeyboardLabel['at']) => {
    if (at === 'start') {
      return { left: 0 };
    }
    if (at === 'end') {
      return { right: 0 };
    }
    const center = geometry.keysByNumber.get(at)?.center ?? 0;
    return {
      left: `${(center / geometry.width) * 100}%`,
      transform: 'translateX(-50%)',
    };
  };

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${geometry.width} ${keybedHeight}`}
        preserveAspectRatio={stretchToHeight ? 'none' : undefined}
        style={stretchToHeight ? { height: stretchToHeight } : undefined}
        className={cn('block w-full', !stretchToHeight && 'h-auto')}
        role="img"
        aria-label={description}
        onMouseMove={onKeyHover ? handleMouseMove : undefined}
        onMouseLeave={onKeyHover ? handleMouseLeave : undefined}
        onClick={onKeySelect ? handleClick : undefined}
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
          vectorEffect="non-scaling-stroke"
          className="fill-ptl-key-white stroke-ptl-key-white-edge"
        />
        {paths.whiteMarked && (
          <path d={paths.whiteMarked} className="fill-ptl-key-white-done" />
        )}
        <path d={paths.blacks} className="fill-ptl-key-black" />
        {paths.blackMarked && (
          <path d={paths.blackMarked} className="fill-ptl-key-black-done" />
        )}
        {paths.current && (
          <path d={paths.current} className="fill-ptl-current" />
        )}
      </svg>
      {labels?.length ? (
        <div
          aria-hidden="true"
          className="relative h-[18px] font-mono text-[11px] text-muted-foreground"
        >
          {labels.map((label) => (
            <span
              key={`${String(label.at)}-${label.text}`}
              className={cn(
                'absolute top-1 whitespace-nowrap',
                label.isMuted && 'text-ptl-ink-3',
                label.isStrong && 'font-bold text-ptl-brass',
              )}
              style={labelPosition(label.at)}
            >
              {label.text}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
