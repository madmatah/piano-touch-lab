import { beforeEach, describe, expect, it } from 'bun:test';

import {
  computeKeyboardGeometry,
  findKeyAtBackPosition,
  findKeyAtPosition,
  isOctaveStart,
  type KeyboardGeometry,
} from './keyboard-geometry';
import { KeyboardFactory } from './keyboard-factory';
import { Standard88Layout } from './layout/standard-88-layout';
import { KeyColor } from './key-color.enum';

const KEYS = KeyboardFactory.fromLayout(Standard88Layout).getKeys();
const PROBED_KEYS = [1, 2, 44, 87, 88];

describe('The computeKeyboardGeometry() function', () => {
  let result: KeyboardGeometry;

  describe('When laying out a standard 88-key keyboard', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry(KEYS);
    });

    it('should place every key', () => {
      expect(result.keysByNumber.size).toBe(88);
    });

    it('should split the keys by colour', () => {
      expect(result.whiteKeys).toHaveLength(52);
      expect(result.blackKeys).toHaveLength(36);
    });

    it('should be as wide as its white keys', () => {
      expect(result.width).toBe(52 * 20);
    });

    it('should centre the first white key half a key in', () => {
      expect(result.whiteKeys[0]?.center).toBe(10);
    });

    it('should sit a black key on the seam between two white keys', () => {
      expect(result.blackKeys[0]?.name).toBe('A#0');
      expect(result.blackKeys[0]?.center).toBe(20);
    });

    it('should keep the keys in ascending order', () => {
      const centers = result.whiteKeys.map((key) => key.center);
      expect(centers).toEqual([...centers].sort((a, b) => a - b));
    });

    it('should leave room for the felt above the keys', () => {
      expect(result.height).toBe(104 + 4);
      expect(result.whiteKeys[0]?.path.startsWith('M0.6 4')).toBe(true);
    });
  });

  describe('When placing the keys at the balance rail', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry(KEYS);
    });

    it('should give every key the same slot', () => {
      const backCenters = [...result.keysByNumber.values()]
        .sort((left, right) => left.number - right.number)
        .map((key) => key.backCenter);
      const strides = backCenters
        .slice(1)
        .map((center, index) => center - backCenters[index]!);

      expect(result.slotWidth).toBeCloseTo((52 * 20) / 88, 10);
      for (const stride of strides) {
        expect(stride).toBeCloseTo(result.slotWidth, 10);
      }
    });

    it('should keep the slots inside the keyboard', () => {
      expect(result.keysByNumber.get(1)?.backCenter).toBeCloseTo(
        result.slotWidth / 2,
        10,
      );
      expect(result.keysByNumber.get(88)?.backCenter).toBeCloseTo(
        result.width - result.slotWidth / 2,
        10,
      );
    });

    it('should cut the stick of middle C askew, its front a little apart from its slot', () => {
      const middleC = result.keysByNumber.get(40)!;
      expect(middleC.name).toBe('C4');
      expect(middleC.center - middleC.backCenter).toBeCloseTo(3.18, 1);
    });

    it('should never set the front of a key further than two thirds of a white key from its slot', () => {
      const worst = Math.max(
        ...[...result.keysByNumber.values()].map((key) =>
          Math.abs(key.center - key.backCenter),
        ),
      );
      expect(worst).toBeLessThan(20 * (2 / 3));
    });
  });

  describe('When the key sticks are not asked for', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry(KEYS);
    });

    it('should leave them out', () => {
      expect(result.leverHeight).toBe(0);
      expect(result.keysByNumber.get(1)?.leverPath).toBe('');
    });
  });

  describe('When the key sticks are asked for', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry(KEYS, { leverHeight: 46 });
    });

    it('should push the keys down under them', () => {
      expect(result.height).toBe(46 + 4 + 104);
      expect(result.whiteKeys[0]?.path.startsWith('M0.6 50')).toBe(true);
    });

    it('should draw one behind every key', () => {
      for (const key of result.keysByNumber.values()) {
        expect(key.leverPath).not.toBe('');
      }
    });
  });

  describe('When given a custom white key width', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry(KEYS, { whiteKeyWidth: 10 });
    });

    it('should scale the layout', () => {
      expect(result.width).toBe(520);
      expect(result.whiteKeys[0]?.center).toBe(5);
    });
  });

  describe('When given a keyboard that starts on a black key', () => {
    beforeEach(() => {
      result = computeKeyboardGeometry([
        { color: KeyColor.Black, name: 'A#0', number: 1, octave: 0 },
        { color: KeyColor.White, name: 'B0', number: 2, octave: 0 },
      ]);
    });

    it('should keep the black key at the left edge', () => {
      expect(result.blackKeys[0]?.center).toBe(0);
      expect(result.width).toBe(20);
    });
  });
});

describe('The findKeyAtBackPosition() function', () => {
  const geometry = computeKeyboardGeometry(KEYS);
  let result: (number | null)[];

  describe('When the position is over the slots of the balance rail', () => {
    beforeEach(() => {
      result = PROBED_KEYS.map((number) =>
        findKeyAtBackPosition(
          geometry,
          geometry.keysByNumber.get(number)!.backCenter,
        ),
      );
    });

    it('should read the key hinged there', () => {
      expect(result).toEqual(PROBED_KEYS);
    });
  });
});

describe('The findKeyAtPosition() function', () => {
  const geometry = computeKeyboardGeometry(KEYS);
  let result: (number | null)[];

  describe('When the position is over the keys', () => {
    beforeEach(() => {
      result = PROBED_KEYS.map((number) =>
        findKeyAtPosition(geometry, geometry.keysByNumber.get(number)!.center),
      );
    });

    it('should read the key played there', () => {
      expect(result).toEqual(PROBED_KEYS);
    });
  });
});

describe('The isOctaveStart() function', () => {
  let result: boolean;

  describe('When the key is a C', () => {
    beforeEach(() => {
      result = isOctaveStart({ color: KeyColor.White, name: 'C4' });
    });

    it('should open an octave', () => {
      expect(result).toBe(true);
    });
  });

  describe('When the key is a C sharp', () => {
    beforeEach(() => {
      result = isOctaveStart({ color: KeyColor.Black, name: 'C#4' });
    });

    it('should not', () => {
      expect(result).toBe(false);
    });
  });

  describe('When the key is any other white key', () => {
    beforeEach(() => {
      result = isOctaveStart({ color: KeyColor.White, name: 'B3' });
    });

    it('should not', () => {
      expect(result).toBe(false);
    });
  });
});
