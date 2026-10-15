import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

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

const seriesOf = (withSpringSupport: boolean) => {
  const keyboard = new Keyboard([key({})]);
  const { result } = renderHook(() =>
    useTouchWeightSeries(keyboard, withSpringSupport),
  );
  return result.current;
};

describe('The useTouchWeightSeries hook', () => {
  describe('When the springs are counted in', () => {
    it('should take what they carry off the weights felt at the key', () => {
      const series = seriesOf(true);

      expect(series.balance.data[0]?.payload).toBe(48.5 - SPRING);
      expect(series.down.data[0]?.payload).toBe(60 - SPRING);
      expect(series.up.data[0]?.payload).toBe(37 - SPRING);
    });

    it('should leave the friction alone', () => {
      // Friction is the half-difference of the two weights, so a spring that
      // lifts both of them equally cancels out of it.
      expect(seriesOf(true).friction.data[0]?.payload).toBe(11.5);
    });
  });

  describe('When the springs are left out', () => {
    it('should report the weights as measured with no spring helping', () => {
      const series = seriesOf(false);

      expect(series.balance.data[0]?.payload).toBe(48.5);
      expect(series.down.data[0]?.payload).toBe(60);
      expect(series.up.data[0]?.payload).toBe(37);
    });
  });

  describe('When a key reads no weight at all', () => {
    it('should still draw it', () => {
      // A key that only just comes back up on its own reads 0g of up weight:
      // a reading, and the worst one on the instrument, not a missing one.
      const keyboard = new Keyboard([key({ upWeight: 0 })]);
      const { result } = renderHook(() =>
        useTouchWeightSeries(keyboard, false),
      );

      expect(result.current.up.data[0]?.payload).toBe(0);
    });
  });

  describe('When a key carries no spring', () => {
    it('should report the same weights either way', () => {
      const keyboard = new Keyboard([
        key({ supportSpringBalanceWeight: null }),
      ]);
      const withSprings = renderHook(() =>
        useTouchWeightSeries(keyboard, true),
      );
      const withoutSprings = renderHook(() =>
        useTouchWeightSeries(keyboard, false),
      );

      expect(withSprings.result.current.balance.data[0]?.payload).toBe(48.5);
      expect(withoutSprings.result.current.balance.data[0]?.payload).toBe(48.5);
    });
  });
});
