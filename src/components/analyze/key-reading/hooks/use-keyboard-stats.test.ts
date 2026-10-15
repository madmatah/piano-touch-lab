import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';

import { Keyboard, KeyColor, type KeyWith } from '@/lib/piano/keyboard';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';

import { useKeyboardStats, type KeyboardStats } from './use-keyboard-stats';

const keyboardOf = (values: OptionalNumber[]) =>
  new Keyboard<KeyWith<OptionalNumber>>(
    values.map((payload, index) => ({
      color: KeyColor.White,
      name: `K${index + 1}`,
      number: index + 1,
      octave: 0,
      payload,
    })),
  );

const selectPayload = (key: KeyWith<OptionalNumber>) => key.payload;

const statsOf = (values: OptionalNumber[]) =>
  renderHook(() => useKeyboardStats(keyboardOf(values), selectPayload)).result
    .current;

describe('The useKeyboardStats hook', () => {
  let result: KeyboardStats;

  describe('When an odd number of keys carry a value', () => {
    beforeEach(() => {
      result = statsOf([6.4, 5.8, 6.1]);
    });

    it('should give the middle value as the median', () => {
      expect(result.median).toBe(6.1);
    });

    it('should name the keys at either end of the spread', () => {
      expect(result).toMatchObject({
        max: 6.4,
        maxKeyName: 'K1',
        min: 5.8,
        minKeyName: 'K2',
      });
    });
  });

  describe('When an even number of keys carry a value', () => {
    beforeEach(() => {
      result = statsOf([6, 5, 7, 8]);
    });

    it('should give the mean of the two middle values as the median', () => {
      expect(result.median).toBe(6.5);
    });
  });

  describe('When some keys carry nothing', () => {
    beforeEach(() => {
      result = statsOf([6, null, Number.NaN, 8]);
    });

    it('should leave them out of every figure', () => {
      expect(result).toMatchObject({ count: 2, mean: 7, median: 7 });
    });

    it('should still know how many keys the instrument has', () => {
      expect(result.size).toBe(4);
    });
  });

  describe('When no key carries a value', () => {
    beforeEach(() => {
      result = statsOf([null, null]);
    });

    it('should have no figure to give', () => {
      expect(result).toEqual({
        count: 0,
        max: null,
        maxKeyName: null,
        mean: null,
        median: null,
        min: null,
        minKeyName: null,
        size: 2,
      });
    });
  });
});
