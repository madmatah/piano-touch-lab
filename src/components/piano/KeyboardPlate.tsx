import { useMemo } from 'react';

import type { KeyboardDrawing } from './keyboard-drawing';

/**
 * How a single key is painted: plain, tinted brass (the key under the
 * pointer, or an end of the range), stone (a key still to measure) or the red
 * felt of the key being worked on.
 */
export type PianoKeyTone = 'plain' | 'marked' | 'pending' | 'current';

export interface KeyboardPlateProps {
  /** Drawn over the keys, in the same coordinates. */
  children?: React.ReactNode;
  geometry: KeyboardDrawing;
  /** The key being read right now, painted brass wherever it sits. */
  highlightedKey?: number | null;
  toneByKeyNumber?: ReadonlyMap<number, PianoKeyTone>;
}

/** The keybed shows a sliver of itself below the front of the keys. */
export const KEYBED_OVERHANG = 4;

/** How tall the plate is drawn, keybed included, in the units of its geometry. */
export const keybedHeight = (geometry: KeyboardDrawing): number =>
  geometry.height + KEYBED_OVERHANG;

const joinPaths = (paths: string[]) => paths.join('');

/**
 * The keyboard itself — keybed, felt, keys and, behind the balance rail, the
 * board of the key sticks — as SVG layers without an `<svg>` of their own.
 *
 * Every keyboard of the application is this one drawing: the home page lays
 * it under its figure, `PianoKeyboard` wraps it for the piano and measure
 * pages and for the axis of the charts. A change to how a keyboard looks is
 * therefore made once.
 */
export const KeyboardPlate = ({
  children,
  geometry,
  highlightedKey,
  toneByKeyNumber,
}: KeyboardPlateProps) => {
  const paths = useMemo(() => {
    const toneOf = (keyNumber: number): PianoKeyTone =>
      keyNumber === highlightedKey
        ? 'marked'
        : (toneByKeyNumber?.get(keyNumber) ?? 'plain');
    const pick = (source: typeof geometry.whiteKeys, tone: PianoKeyTone) =>
      joinPaths(
        source.filter((key) => toneOf(key.number) === tone).map((k) => k.path),
      );

    // Each tone is painted in two layers, white keys then black: a white key
    // is drawn whole, and the black keys have to come over it afterwards.
    return {
      blackCurrent: pick(geometry.blackKeys, 'current'),
      blackMarked: pick(geometry.blackKeys, 'marked'),
      blackPending: pick(geometry.blackKeys, 'pending'),
      blacks: joinPaths(geometry.blackKeys.map((key) => key.path)),
      // The stick of the key being read is cut out of the board in the wash
      // of the reading band above it, so the two make one column from the
      // plot down to the key.
      readLever:
        highlightedKey === null || highlightedKey === undefined
          ? ''
          : (geometry.keysByNumber.get(highlightedKey)?.leverPath ?? ''),
      whiteCurrent: pick(geometry.whiteKeys, 'current'),
      whiteMarked: pick(geometry.whiteKeys, 'marked'),
      whitePending: pick(geometry.whiteKeys, 'pending'),
      whites: joinPaths(geometry.whiteKeys.map((key) => key.path)),
    };
  }, [geometry, highlightedKey, toneByKeyNumber]);

  return (
    <>
      <rect
        x="0"
        y="0"
        width={geometry.width}
        height={keybedHeight(geometry)}
        rx="3"
        className="fill-ptl-keybed"
      />
      {/*
       * The sticks are left as one unbroken board: eighty-seven saw
       * lines across the back of the figure drowned out the plot above
       * them. Only the key being read is cut out of it, which is enough
       * to show where the wood goes.
       */}
      {geometry.leverHeight > 0 && (
        <rect
          x="0"
          y="0"
          width={geometry.width}
          height={geometry.leverHeight}
          // The colour of the card it lies on, in both themes: painted as
          // a white key it vanished on paper-white and stood out as an
          // ivory band in the dark, where the keys are the ivory.
          className="fill-card"
        />
      )}
      {paths.readLever && (
        <path d={paths.readLever} className="fill-ptl-brass-soft" />
      )}
      <rect
        x="0"
        y={geometry.leverHeight}
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
      {paths.whitePending && (
        <path d={paths.whitePending} className="fill-ptl-key-white-pending" />
      )}
      {paths.whiteMarked && (
        <path d={paths.whiteMarked} className="fill-ptl-key-white-done" />
      )}
      {paths.whiteCurrent && (
        <path d={paths.whiteCurrent} className="fill-ptl-current" />
      )}
      <path d={paths.blacks} className="fill-ptl-key-black" />
      {paths.blackPending && (
        <path d={paths.blackPending} className="fill-ptl-key-black-pending" />
      )}
      {paths.blackMarked && (
        <path d={paths.blackMarked} className="fill-ptl-key-black-done" />
      )}
      {paths.blackCurrent && (
        <path d={paths.blackCurrent} className="fill-ptl-current" />
      )}
      {children}
    </>
  );
};
