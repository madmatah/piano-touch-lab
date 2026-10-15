import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';

import { Keyboard, KeyColor, type KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { useAdjustmentRows, type AdjustmentRows } from './use-adjustment-rows';

const key = (
  number: number,
  payload: Partial<TouchWeightKeyAnalysis>,
): KeyWith<TouchWeightKeyAnalysis> => ({
  color: KeyColor.White,
  name: `K${number}`,
  number,
  octave: 0,
  payload: {
    balanceWeight: 40,
    computedStrikeWeightRatio: 6,
    downWeightWithSpringSupport: null,
    downWeightWithoutSpringSupport: 50,
    frictionWeight: 10,
    frontWeight: 20,
    keyWeightRatio: 0.5,
    measuredStrikeWeightRatio: null,
    strikeWeight: 10,
    strikeWeightRatio: 6,
    supportSpringBalanceWeight: null,
    upWeight: 30,
    wippenBalanceWeight: 9.75,
    wippenRadiusWeight: 19.5,
    ...payload,
  },
});

const rowsOf = (
  analyzed: KeyWith<TouchWeightKeyAnalysis>[],
  designed: KeyWith<TouchWeightKeyAnalysis>[],
) =>
  renderHook(() =>
    useAdjustmentRows(new Keyboard(analyzed), new Keyboard(designed)),
  ).result.current;

describe('The useAdjustmentRows hook', () => {
  let result: AdjustmentRows;

  describe('When every weight of a key is known', () => {
    beforeEach(() => {
      result = rowsOf(
        [key(1, { frontWeight: 18, strikeWeight: 9.5 })],
        [key(1, { frontWeight: 22.5, strikeWeight: 10 })],
      );
    });

    it('should give the key a row, from what it weighs to what it should', () => {
      expect(result.keyboard.getKeyByNumber(1)?.payload).toMatchObject({
        actualFrontWeight: 18,
        actualStrikeWeight: 9.5,
        targetFrontWeight: 22.5,
        targetStrikeWeight: 10,
      });
    });
  });

  describe('When a key is missing a reading', () => {
    beforeEach(() => {
      result = rowsOf(
        [key(1, {}), key(2, { strikeWeight: null })],
        [key(1, { frontWeight: 25 }), key(2, { frontWeight: 25 })],
      );
    });

    it('should leave it blank', () => {
      expect(result.keyboard.getKeyByNumber(2)?.payload).toBeNull();
    });

    it('should count only the keys that have a row', () => {
      expect(result.summary.frontWeightCount).toBe(1);
    });
  });

  describe('When some front weights move and others stay within a tenth', () => {
    beforeEach(() => {
      result = rowsOf(
        [key(1, {}), key(2, {}), key(3, {})],
        [
          key(1, { frontWeight: 22 }),
          key(2, { frontWeight: 20.04 }),
          key(3, { frontWeight: 19 }),
        ],
      );
    });

    it('should count the keys whose weight moves', () => {
      expect(result.summary.frontWeightCount).toBe(2);
    });

    it('should average what moves over those keys alone', () => {
      expect(result.summary.frontWeightMean).toBe(0.5);
    });
  });

  describe('When the strike weights move by different amounts', () => {
    beforeEach(() => {
      result = rowsOf(
        [key(1, {}), key(2, {}), key(3, {})],
        [
          key(1, { strikeWeight: 11.5 }),
          key(2, { strikeWeight: 10 }),
          key(3, { strikeWeight: 9.2 }),
        ],
      );
    });

    it('should give the range of what moves', () => {
      expect(result.summary.strikeWeightMin).toBe(-0.8);
      expect(result.summary.strikeWeightMax).toBe(1.5);
    });

    it('should count the hammers left as they are', () => {
      expect(result.summary.strikeWeightUnchanged).toBe(1);
    });
  });

  describe('When nothing moves', () => {
    beforeEach(() => {
      result = rowsOf([key(1, {})], [key(1, {})]);
    });

    it('should have no average and no range to give', () => {
      expect(result.summary.frontWeightMean).toBeNull();
      expect(result.summary.strikeWeightMin).toBeNull();
      expect(result.summary.strikeWeightMax).toBeNull();
    });
  });

  describe('When the design fits springs on keys still missing a reading', () => {
    beforeEach(() => {
      result = rowsOf(
        [key(1, { frontWeight: null }), key(2, {}), key(3, {})],
        [
          key(1, { supportSpringBalanceWeight: 9.5 }),
          key(2, { supportSpringBalanceWeight: 5 }),
          key(3, {}),
        ],
      );
    });

    it('should read the springs off the design, not off the rows', () => {
      expect(result.summary).toMatchObject({
        hasSprings: true,
        springCount: 2,
        springFirstKey: 1,
        springLastKey: 2,
      });
    });
  });
});
