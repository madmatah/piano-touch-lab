import { KeyColor } from './key-color.enum';
import type { Key } from './key';

export interface PlacedKey {
  /** Where the key is played: its own place among the white keys. */
  center: number;
  /**
   * Where the key is hinged: its place at the balance rail, one slot per key.
   *
   * Twelve semitones share seven white keys, so the fronts are unevenly
   * spaced while the backs are not — on a grand it is the wood of the key
   * that takes up the difference.
   */
  backCenter: number;
  color: KeyColor;
  name: string;
  number: number;
}

/**
 * Where every key of a keyboard sits, front and back, in widths of a white
 * key — or in whatever unit one white key is given.
 */
export interface KeyboardPlacement<Placed extends PlacedKey = PlacedKey> {
  blackKeys: Placed[];
  keysByNumber: ReadonlyMap<number, Placed>;
  /** The share of the keyboard each key gets at the balance rail. */
  slotWidth: number;
  /** The white keys, from left to right. */
  whiteKeys: Placed[];
  whiteKeyWidth: number;
  width: number;
}

/**
 * Lays a list of keys out as a piano keyboard.
 *
 * White keys sit side by side; a black key straddles the seam between the two
 * white keys it follows. At the balance rail every key gets the same slot, and
 * the wood fans out from there to the uneven fronts, exactly as it does on a
 * grand. The figures plot a key's readings over its slot, and the keyboard
 * drawn under them takes the same placement, so a note always sits at the
 * same place on the page.
 */
export const computeKeyboardPlacement = (
  keys: readonly Key[],
  whiteKeyWidth = 1,
): KeyboardPlacement => {
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
    const placed: PlacedKey = {
      backCenter: (index + 0.5) * slotWidth,
      center: isBlack
        ? whiteIndex * whiteKeyWidth
        : whiteIndex * whiteKeyWidth + whiteKeyWidth / 2,
      color: key.color,
      name: key.name,
      number: key.number,
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
    keysByNumber,
    slotWidth,
    whiteKeyWidth,
    whiteKeys,
    width,
  };
};

const nearestKey = (
  placement: KeyboardPlacement,
  position: number,
  placeOf: (key: PlacedKey) => number,
): number | null => {
  let nearest: PlacedKey | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const key of placement.keysByNumber.values()) {
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
  placement: KeyboardPlacement,
  position: number,
): number | null => nearestKey(placement, position, (key) => key.center);

/**
 * The key whose balance rail slot is nearest to a horizontal position.
 *
 * This is how a chart turns a pointer into a note: its x axis is ruled by the
 * slots, where the keys are evenly spaced, so that a curve computed key by
 * key is drawn evenly too.
 */
export const findKeyAtBackPosition = (
  placement: KeyboardPlacement,
  position: number,
): number | null => nearestKey(placement, position, (key) => key.backCenter);

/** A C, where an octave starts: what the figures mark and the tables rule off. */
export const isOctaveStart = (key: Pick<Key, 'color' | 'name'>): boolean =>
  key.color === KeyColor.White && key.name.startsWith('C');

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
    .filter(isOctaveStart)
    .map((key) => ({ label: key.name, number: key.number }));
