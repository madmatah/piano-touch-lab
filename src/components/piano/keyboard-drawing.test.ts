import { beforeEach, describe, expect, it } from 'bun:test';

import {
  computeKeyboardDrawing,
  type KeyboardDrawing,
} from './keyboard-drawing';
import { KeyboardFactory } from '@/lib/piano/keyboard/keyboard-factory';
import { computeKeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';
import { Standard88Layout } from '@/lib/piano/keyboard/layout/standard-88-layout';

const KEYS = KeyboardFactory.fromLayout(Standard88Layout).getKeys();

describe('The computeKeyboardDrawing() function', () => {
  let result: KeyboardDrawing;

  describe('When drawing a standard keyboard at the default size', () => {
    beforeEach(() => {
      result = computeKeyboardDrawing(KEYS);
    });

    it('should place the keys where the domain places them', () => {
      const placement = computeKeyboardPlacement(KEYS, 20);
      expect(
        [...result.keysByNumber.values()].map((key) => key.center),
      ).toEqual([...placement.keysByNumber.values()].map((key) => key.center));
    });

    it('should keep the keys in the order of the keyboard', () => {
      expect([...result.keysByNumber.keys()]).toEqual(
        KEYS.map((key) => key.number),
      );
    });

    it('should leave room for the felt above the keys', () => {
      expect(result.height).toBe(104 + 4);
      expect(result.whiteKeys[0]?.path.startsWith('M0.6 4')).toBe(true);
    });
  });

  describe('When the key sticks are not asked for', () => {
    beforeEach(() => {
      result = computeKeyboardDrawing(KEYS);
    });

    it('should leave them out', () => {
      expect(result.leverHeight).toBe(0);
      expect(result.keysByNumber.get(1)?.leverPath).toBe('');
    });
  });

  describe('When the key sticks are asked for', () => {
    beforeEach(() => {
      result = computeKeyboardDrawing(KEYS, { leverHeight: 46 });
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
});
