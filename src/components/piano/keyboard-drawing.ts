import { KeyColor } from '@/lib/piano/keyboard/key-color.enum';
import type { Key } from '@/lib/piano/keyboard/key';
import {
  computeKeyboardPlacement,
  type KeyboardPlacement,
  type PlacedKey,
} from '@/lib/piano/keyboard/keyboard-geometry';

export interface KeyboardDrawingOptions {
  /** Width of one white key, in SVG units. */
  whiteKeyWidth?: number;
  /** Height of a white key, from the top of the keybed to its front edge. */
  keyHeight?: number;
  /** Depth of the felt strip drawn along the back of the keybed. */
  feltHeight?: number;
  /**
   * Depth of the key sticks drawn behind the balance rail. Zero leaves them
   * out, which is what a keyboard shown for itself wants.
   */
  leverHeight?: number;
}

export interface DrawnKey extends PlacedKey {
  /** Outline of the key stick behind the balance rail, when it is drawn. */
  leverPath: string;
  /** Outline of the key, as an SVG path. */
  path: string;
}

/** A keyboard placed and drawn: its keys carry their outlines. */
export interface KeyboardDrawing extends KeyboardPlacement<DrawnKey> {
  feltHeight: number;
  height: number;
  leverHeight: number;
}

const DEFAULTS = {
  feltHeight: 4,
  keyHeight: 104,
  leverHeight: 0,
  whiteKeyWidth: 20,
} as const;

/**
 * How much longer a white key is than it is wide, as far as the player sees
 * it: about 150 mm by 23 mm.
 */
export const WHITE_KEY_LENGTH_RATIO = 6.5;

const WHITE_KEY_INSET = 0.6;

/** Black keys reach a little under two thirds down the white ones. */
const BLACK_KEY_HEIGHT_RATIO = 0.6;
const BLACK_KEY_WIDTH_RATIO = 0.6;

const round = (value: number) => Number(value.toFixed(1));

const whiteKeyPath = (
  x: number,
  top: number,
  width: number,
  height: number,
) => {
  const radius = 2.5;
  const inset = WHITE_KEY_INSET;
  const body = width - inset * 2;
  return (
    `M${round(x + inset)} ${top}` +
    `h${round(body)}` +
    `v${round(height - radius)}` +
    `a${radius} ${radius} 0 0 1 ${-radius} ${radius}` +
    `h${round(-(body - radius * 2))}` +
    `a${radius} ${radius} 0 0 1 ${-radius} ${-radius}` +
    `z`
  );
};

/**
 * The wood of a key, from the balance rail forward to the key itself.
 *
 * It fills its whole slot at the rail and the whole width of the key at the
 * front, so the reading band above it, the wood and the key make one
 * unbroken column. Straight sides: the S a key maker actually cuts was
 * fussy at this size. Only the key being read is drawn, so nothing has to
 * make room for its neighbours.
 */
const leverPath = (
  back: { center: number; halfWidth: number },
  front: { center: number; halfWidth: number },
  height: number,
) => {
  const backLeft = round(back.center - back.halfWidth);
  const backRight = round(back.center + back.halfWidth);
  const frontLeft = round(front.center - front.halfWidth);
  const frontRight = round(front.center + front.halfWidth);
  return (
    `M${backLeft} 0` +
    `H${backRight}` +
    `L${frontRight} ${round(height)}` +
    `H${frontLeft}` +
    `z`
  );
};

const blackKeyPath = (
  center: number,
  top: number,
  width: number,
  height: number,
) => {
  const radius = 1.8;
  const half = width / 2;
  return (
    `M${round(center - half)} ${top}` +
    `h${round(width)}` +
    `v${round(height - radius)}` +
    `a${radius} ${radius} 0 0 1 ${-radius} ${radius}` +
    `h${round(-(width - radius * 2))}` +
    `a${radius} ${radius} 0 0 1 ${-radius} ${-radius}` +
    `z`
  );
};

/**
 * The keyboard as an SVG drawing: where the domain places each key, outlined
 * at the size asked for.
 *
 * With a `leverHeight`, it also draws the back of the keys: the wood that
 * fans out from the even slots of the balance rail to the uneven fronts.
 */
export const computeKeyboardDrawing = (
  keys: readonly Key[],
  options: KeyboardDrawingOptions = {},
): KeyboardDrawing => {
  const whiteKeyWidth = options.whiteKeyWidth ?? DEFAULTS.whiteKeyWidth;
  const keyHeight = options.keyHeight ?? DEFAULTS.keyHeight;
  const feltHeight = options.feltHeight ?? DEFAULTS.feltHeight;
  const leverHeight = options.leverHeight ?? DEFAULTS.leverHeight;

  const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_RATIO;
  const blackKeyHeight = keyHeight * BLACK_KEY_HEIGHT_RATIO;
  const keyTop = leverHeight + feltHeight;

  const placement = computeKeyboardPlacement(keys, whiteKeyWidth);

  const draw = (key: PlacedKey, whiteIndex: number): DrawnKey => {
    const isBlack = key.color === KeyColor.Black;
    return {
      ...key,
      leverPath:
        leverHeight === 0
          ? ''
          : leverPath(
              { center: key.backCenter, halfWidth: placement.slotWidth / 2 },
              {
                center: key.center,
                halfWidth: isBlack
                  ? blackKeyWidth / 2
                  : whiteKeyWidth / 2 - WHITE_KEY_INSET,
              },
              leverHeight,
            ),
      path: isBlack
        ? blackKeyPath(key.center, keyTop, blackKeyWidth, blackKeyHeight)
        : whiteKeyPath(
            whiteIndex * whiteKeyWidth,
            keyTop,
            whiteKeyWidth,
            keyHeight,
          ),
    };
  };

  // In the order of the keyboard, as placed: a pointer halfway between two
  // keys reads the first one met.
  const whiteIndexOf = new Map(
    placement.whiteKeys.map((key, index) => [key.number, index]),
  );
  const keysByNumber = new Map(
    [...placement.keysByNumber.values()].map((key) => [
      key.number,
      draw(key, whiteIndexOf.get(key.number) ?? 0),
    ]),
  );
  const drawn = (key: PlacedKey) => keysByNumber.get(key.number)!;
  const whiteKeys = placement.whiteKeys.map(drawn);
  const blackKeys = placement.blackKeys.map(drawn);

  return {
    ...placement,
    blackKeys,
    feltHeight,
    height: keyTop + keyHeight,
    keysByNumber,
    leverHeight,
    whiteKeys,
  };
};
