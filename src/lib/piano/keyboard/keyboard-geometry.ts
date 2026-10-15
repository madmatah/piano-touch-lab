import { KeyColor } from './key-color.enum';
import type { Key } from './key';

export interface KeyboardGeometryOptions {
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

export interface PlacedKey {
  /** Where the key is played: its own place among the white keys. */
  center: number;
  /**
   * Where the key is hinged: its place at the balance rail, one slot per key.
   *
   * Twelve semitones share seven white keys, so the fronts are unevenly
   * spaced while the backs are not — on a grand it is the wood of the key
   * that takes up the difference, which is what `leverPath` draws.
   */
  backCenter: number;
  color: KeyColor;
  /** Outline of the key stick behind the balance rail, when it is drawn. */
  leverPath: string;
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
  leverHeight: number;
  /** The share of the keyboard each key gets at the balance rail. */
  slotWidth: number;
  whiteKeys: PlacedKey[];
  width: number;
}

const DEFAULTS = {
  feltHeight: 4,
  keyHeight: 104,
  leverHeight: 0,
  whiteKeyWidth: 20,
} as const;

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
 * Lays a list of keys out as a piano keyboard.
 *
 * White keys sit side by side; a black key straddles the seam between the two
 * white keys it follows. The same geometry draws the keyboard preview, the
 * home page figure and the keyboard that serves as the x axis of every chart,
 * so a note always sits at the same place on the page.
 *
 * With a `leverHeight`, it also draws the back of the keys: at the balance
 * rail every key gets the same slot, and the wood fans out from there to the
 * uneven fronts, exactly as it does on a grand.
 */
export const computeKeyboardGeometry = (
  keys: readonly Key[],
  options: KeyboardGeometryOptions = {},
): KeyboardGeometry => {
  const whiteKeyWidth = options.whiteKeyWidth ?? DEFAULTS.whiteKeyWidth;
  const keyHeight = options.keyHeight ?? DEFAULTS.keyHeight;
  const feltHeight = options.feltHeight ?? DEFAULTS.feltHeight;
  const leverHeight = options.leverHeight ?? DEFAULTS.leverHeight;

  const blackKeyWidth = whiteKeyWidth * BLACK_KEY_WIDTH_RATIO;
  const blackKeyHeight = keyHeight * BLACK_KEY_HEIGHT_RATIO;
  const keyTop = leverHeight + feltHeight;

  const whiteKeyCount = keys.filter(
    (key) => key.color !== KeyColor.Black,
  ).length;
  const width = whiteKeyCount * whiteKeyWidth;
  const slotWidth = keys.length === 0 ? 0 : width / keys.length;

  const whiteKeys: PlacedKey[] = [];
  const blackKeys: PlacedKey[] = [];
  const keysByNumber = new Map<number, PlacedKey>();

  let whiteIndex = 0;
  keys.forEach((key, index) => {
    const isBlack = key.color === KeyColor.Black;
    const center = isBlack
      ? whiteIndex * whiteKeyWidth
      : whiteIndex * whiteKeyWidth + whiteKeyWidth / 2;
    const backCenter = (index + 0.5) * slotWidth;

    const placed: PlacedKey = {
      backCenter,
      center,
      color: key.color,
      leverPath:
        leverHeight === 0
          ? ''
          : leverPath(
              { center: backCenter, halfWidth: slotWidth / 2 },
              {
                center,
                halfWidth: isBlack
                  ? blackKeyWidth / 2
                  : whiteKeyWidth / 2 - WHITE_KEY_INSET,
              },
              leverHeight,
            ),
      name: key.name,
      number: key.number,
      path: isBlack
        ? blackKeyPath(center, keyTop, blackKeyWidth, blackKeyHeight)
        : whiteKeyPath(
            whiteIndex * whiteKeyWidth,
            keyTop,
            whiteKeyWidth,
            keyHeight,
          ),
    };

    if (isBlack) {
      blackKeys.push(placed);
    } else {
      whiteKeys.push(placed);
      whiteIndex += 1;
    }
    keysByNumber.set(key.number, placed);
  });

  return {
    blackKeys,
    feltHeight,
    height: keyTop + keyHeight,
    keysByNumber,
    leverHeight,
    slotWidth,
    whiteKeys,
    width,
  };
};

const nearestKey = (
  geometry: KeyboardGeometry,
  position: number,
  placeOf: (key: PlacedKey) => number,
): number | null => {
  let nearest: PlacedKey | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const key of geometry.keysByNumber.values()) {
    const distance = Math.abs(placeOf(key) - position);
    if (distance < nearestDistance) {
      nearest = key;
      nearestDistance = distance;
    }
  }

  return nearest?.number ?? null;
};

/**
 * The key whose front is nearest to a horizontal position.
 *
 * This is how the drawn keyboard turns a pointer into a note: the reader is
 * pointing at the key they would play.
 */
export const findKeyAtPosition = (
  geometry: KeyboardGeometry,
  position: number,
): number | null => nearestKey(geometry, position, (key) => key.center);

/**
 * The key whose balance rail slot is nearest to a horizontal position.
 *
 * This is how a chart turns a pointer into a note: its x axis is ruled by the
 * slots, where the keys are evenly spaced, so that a curve computed key by
 * key is drawn evenly too.
 */
export const findKeyAtBackPosition = (
  geometry: KeyboardGeometry,
  position: number,
): number | null => nearestKey(geometry, position, (key) => key.backCenter);

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
