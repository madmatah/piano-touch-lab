import { describe, expect, it } from 'bun:test';

import { computeKeyboardGeometry } from './keyboard-geometry';
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
