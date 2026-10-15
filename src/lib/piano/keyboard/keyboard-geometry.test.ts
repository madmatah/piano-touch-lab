import { describe, expect, it } from 'bun:test';

import {
  computeKeyboardGeometry,
  findKeyAtBackPosition,
  findKeyAtPosition,
} from './keyboard-geometry';
import { KeyboardFactory } from './keyboard-factory';
import { Standard88Layout } from './layout/standard-88-layout';
import { KeyColor } from './key-color.enum';

describe('The computeKeyboardGeometry function', () => {
  const keys = KeyboardFactory.fromLayout(Standard88Layout).getKeys();

  describe('When laying out a standard 88-key keyboard', () => {
    const geometry = computeKeyboardGeometry(keys);

    it('should place every key', () => {
      expect(geometry.keysByNumber.size).toBe(88);
    });

    it('should split the keys by colour', () => {
      expect(geometry.whiteKeys).toHaveLength(52);
      expect(geometry.blackKeys).toHaveLength(36);
    });

    it('should be as wide as its white keys', () => {
      expect(geometry.width).toBe(52 * 20);
    });

    it('should centre the first white key half a key in', () => {
      expect(geometry.whiteKeys[0]?.center).toBe(10);
    });

    it('should sit a black key on the seam between two white keys', () => {
      const firstBlack = geometry.blackKeys[0];
      expect(firstBlack?.name).toBe('A#0');
      expect(firstBlack?.center).toBe(20);
    });

    it('should keep the keys in ascending order', () => {
      const centers = geometry.whiteKeys.map((key) => key.center);
      expect(centers).toEqual([...centers].sort((a, b) => a - b));
    });

    it('should leave room for the felt above the keys', () => {
      expect(geometry.height).toBe(104 + 4);
      expect(geometry.whiteKeys[0]?.path.startsWith('M0.6 4')).toBe(true);
    });
  });

  describe('When placing the keys at the balance rail', () => {
    const geometry = computeKeyboardGeometry(keys);

    it('should give every key the same slot', () => {
      const backCenters = [...geometry.keysByNumber.values()]
        .sort((left, right) => left.number - right.number)
        .map((key) => key.backCenter);
      const strides = backCenters
        .slice(1)
        .map((center, index) => center - backCenters[index]!);

      expect(geometry.slotWidth).toBeCloseTo((52 * 20) / 88, 10);
      for (const stride of strides) {
        expect(stride).toBeCloseTo(geometry.slotWidth, 10);
      }
    });

    it('should keep the slots inside the keyboard', () => {
      expect(geometry.keysByNumber.get(1)?.backCenter).toBeCloseTo(
        geometry.slotWidth / 2,
        10,
      );
      expect(geometry.keysByNumber.get(88)?.backCenter).toBeCloseTo(
        geometry.width - geometry.slotWidth / 2,
        10,
      );
    });

    it('should read a position over the slots as the key hinged there', () => {
      for (const number of [1, 2, 44, 87, 88]) {
        const placed = geometry.keysByNumber.get(number)!;
        expect(findKeyAtBackPosition(geometry, placed.backCenter)).toBe(number);
      }
    });

    it('should read a position over the keys as the key played there', () => {
      for (const number of [1, 2, 44, 87, 88]) {
        const placed = geometry.keysByNumber.get(number)!;
        expect(findKeyAtPosition(geometry, placed.center)).toBe(number);
      }
    });

    it('should set the front of a key apart from its slot, within reason', () => {
      // The whole reason the wood of a key is cut askew — and the measure of
      // how far a reading on the chart stands from the key it belongs to.
      const middleC = geometry.keysByNumber.get(40)!;
      expect(middleC.name).toBe('C4');
      expect(middleC.center - middleC.backCenter).toBeCloseTo(3.18, 1);

      const worst = Math.max(
        ...[...geometry.keysByNumber.values()].map((key) =>
          Math.abs(key.center - key.backCenter),
        ),
      );
      // Never further than two thirds of a white key, and symmetric: the
      // first and last sticks lean by the same amount, in opposite ways.
      expect(worst).toBeLessThan(20 * (2 / 3));
    });
  });

  describe('When asked for the key sticks', () => {
    it('should leave them out by default', () => {
      const geometry = computeKeyboardGeometry(keys);
      expect(geometry.leverHeight).toBe(0);
      expect(geometry.keysByNumber.get(1)?.leverPath).toBe('');
    });

    it('should draw one behind every key, and push the keys down', () => {
      const geometry = computeKeyboardGeometry(keys, { leverHeight: 46 });
      expect(geometry.height).toBe(46 + 4 + 104);
      expect(geometry.whiteKeys[0]?.path.startsWith('M0.6 50')).toBe(true);
      for (const key of geometry.keysByNumber.values()) {
        expect(key.leverPath).not.toBe('');
      }
    });
  });

  describe('When given a custom white key width', () => {
    const geometry = computeKeyboardGeometry(keys, { whiteKeyWidth: 10 });

    it('should scale the layout', () => {
      expect(geometry.width).toBe(520);
      expect(geometry.whiteKeys[0]?.center).toBe(5);
    });
  });

  describe('When given a keyboard that starts on a black key', () => {
    const geometry = computeKeyboardGeometry([
      { color: KeyColor.Black, name: 'A#0', number: 1, octave: 0 },
      { color: KeyColor.White, name: 'B0', number: 2, octave: 0 },
    ]);

    it('should keep the black key at the left edge', () => {
      expect(geometry.blackKeys[0]?.center).toBe(0);
      expect(geometry.width).toBe(20);
    });
  });
});
