import { KeyColor } from './key-color.enum';
import type { Key } from './key';

export interface KeyboardGeometryOptions {
  /** Width of one white key, in SVG units. */
  whiteKeyWidth?: number;
  /** Height of a white key, from the top of the keybed to its front edge. */
  keyHeight?: number;
  /** Depth of the felt strip drawn along the back of the keybed. */
  feltHeight?: number;
}

export interface PlacedKey {
  center: number;
  color: KeyColor;
  name: string;
  number: number;
  /** Outline of the key, as an SVG path. */
  path: string;
}

export interface KeyboardGeometry {
  blackKeys: PlacedKey[];
  feltHeight: number;
  height: number;
  keysByNumber: ReadonlyMap<number, PlacedKey>;
  whiteKeys: PlacedKey[];
  width: number;
}

const DEFAULTS = {
  feltHeight: 4,
  keyHeight: 104,
  whiteKeyWidth: 20,
} as const;

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
  const inset = 0.6;
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
 * Lays a list of keys out as a piano keyboard.
 *
 * White keys sit side by side; a black key straddles the seam between the two
 * white keys it follows. The same geometry draws the keyboard preview, the
 * home page figure and the keyboard that serves as the x axis of every chart,
 * so a note always sits at the same place on the page.
 */
export const computeKeyboardGeometry = (
  keys: readonly Key[],
  options: KeyboardGeometryOptions = {},
): KeyboardGeometry => {
  const whiteKeyWidth = options.whiteKeyWidth ?? DEFAULTS.whiteKeyWidth;
  const keyHeight = options.keyHeight ?? DEFAULTS.keyHeight;
  const feltHeight = options.feltHeight ?? DEFAULTS.feltHeight;

  const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_RATIO;
  const blackKeyHeight = keyHeight * BLACK_KEY_HEIGHT_RATIO;

  const whiteKeys: PlacedKey[] = [];
  const blackKeys: PlacedKey[] = [];
  const keysByNumber = new Map<number, PlacedKey>();

  let whiteIndex = 0;
  for (const key of keys) {
    const placed: PlacedKey =
      key.color === KeyColor.Black
        ? {
            center: whiteIndex * whiteKeyWidth,
            color: key.color,
            name: key.name,
            number: key.number,
            path: blackKeyPath(
              whiteIndex * whiteKeyWidth,
              feltHeight,
              blackKeyWidth,
              blackKeyHeight,
            ),
          }
        : {
            center: whiteIndex * whiteKeyWidth + whiteKeyWidth / 2,
            color: key.color,
            name: key.name,
            number: key.number,
            path: whiteKeyPath(
              whiteIndex * whiteKeyWidth,
              feltHeight,
              whiteKeyWidth,
              keyHeight,
            ),
          };

    if (key.color === KeyColor.Black) {
      blackKeys.push(placed);
    } else {
      whiteKeys.push(placed);
      whiteIndex += 1;
    }
    keysByNumber.set(key.number, placed);
  }

  return {
    blackKeys,
    feltHeight,
    height: keyHeight + feltHeight,
    keysByNumber,
    whiteKeys,
    width: whiteIndex * whiteKeyWidth,
  };
};

/**
 * The key whose centre is nearest to a horizontal position.
 *
 * This is how a chart turns a pointer into a note: its x axis runs in the same
 * units as the keyboard below it, so the reading follows the finger.
 */
export const findKeyAtPosition = (
  geometry: KeyboardGeometry,
  position: number,
): number | null => {
  let nearest: PlacedKey | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const key of geometry.keysByNumber.values()) {
    const distance = Math.abs(key.center - position);
    if (distance < nearestDistance) {
      nearest = key;
      nearestDistance = distance;
    }
  }

  return nearest?.number ?? null;
};

/**
 * The C of every octave, which is how a technician reads along a keyboard.
 *
 * Derived from the keys themselves rather than hard-coded C1…C8: the
 * application supports keyboards that are neither 88 keys nor start on A.
 */
export const octaveMarks = (
  keys: readonly Key[],
): { label: string; number: number }[] =>
  keys
    .filter((key) => key.color === KeyColor.White && key.name.startsWith('C'))
    .map((key) => ({ label: key.name, number: key.number }));
