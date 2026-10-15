import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';

import { Keyboard, KeyColor, type KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { useTouchWeightSeries } from './use-touch-weight-series';

const SPRING = 9.5;

const key = (
  payload: Partial<TouchWeightKeyAnalysis>,
): KeyWith<TouchWeightKeyAnalysis> => ({
  color: KeyColor.White,
  name: 'A0',
  number: 1,
  octave: 0,
  payload: {
    balanceWeight: 48.5,
    computedStrikeWeightRatio: 6,
    downWeightWithSpringSupport: 50.5,
    downWeightWithoutSpringSupport: 60,
    frictionWeight: 11.5,
    frontWeight: 23.1,
    keyWeightRatio: 0.5,
    measuredStrikeWeightRatio: null,
    strikeWeight: 10.3,
    strikeWeightRatio: 6,
    supportSpringBalanceWeight: SPRING,
    upWeight: 37,
    wippenBalanceWeight: 9.75,
    wippenRadiusWeight: 19.5,
    ...payload,
  },
});

const seriesOf = (
  keyboard: Keyboard<KeyWith<TouchWeightKeyAnalysis>>,
  withSpringSupport: boolean,
) =>
  renderHook(() => useTouchWeightSeries(keyboard, withSpringSupport)).result
    .current;

describe('The useTouchWeightSeries hook', () => {
  let result: ReturnType<typeof useTouchWeightSeries>;

  describe('When the springs are counted in', () => {
    beforeEach(() => {
      result = seriesOf(new Keyboard([key({})]), true);
    });

    it('should take what they carry off the weights felt at the key', () => {
      expect(result.balance.data[0]?.payload).toBe(48.5 - SPRING);
      expect(result.down.data[0]?.payload).toBe(60 - SPRING);
      expect(result.up.data[0]?.payload).toBe(37 - SPRING);
    });

    it('should leave the friction alone, a spring lifting the down and up weights alike', () => {
      expect(result.friction.data[0]?.payload).toBe(11.5);
    });
  });

  describe('When the springs are left out', () => {
    beforeEach(() => {
      result = seriesOf(new Keyboard([key({})]), false);
    });

    it('should report the weights as measured with no spring helping', () => {
      expect(result.balance.data[0]?.payload).toBe(48.5);
      expect(result.down.data[0]?.payload).toBe(60);
      expect(result.up.data[0]?.payload).toBe(37);
    });
  });

  describe('When a key only just comes back up, and reads no up weight at all', () => {
    beforeEach(() => {
      result = seriesOf(new Keyboard([key({ upWeight: 0 })]), false);
    });

    it('should still draw it, as a reading rather than a missing one', () => {
      expect(result.up.data[0]?.payload).toBe(0);
    });
  });

  describe('When a key carries no spring', () => {
    let withoutSprings: ReturnType<typeof useTouchWeightSeries>;

    beforeEach(() => {
      const keyboard = new Keyboard([
        key({ supportSpringBalanceWeight: null }),
      ]);
      result = seriesOf(keyboard, true);
      withoutSprings = seriesOf(keyboard, false);
    });

    it('should report the same weights either way', () => {
      expect(result.balance.data[0]?.payload).toBe(48.5);
      expect(withoutSprings.balance.data[0]?.payload).toBe(48.5);
    });
  });
});
