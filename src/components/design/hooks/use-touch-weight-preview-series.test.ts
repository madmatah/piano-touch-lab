import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';

import { Keyboard, KeyColor, type KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { useTouchWeightPreviewSeries } from './use-touch-weight-preview-series';

const TARGET_BALANCE_WEIGHT = 39;
const SPRING = 9.5;

const key = (
  payload: Partial<TouchWeightKeyAnalysis>,
): KeyWith<TouchWeightKeyAnalysis> => ({
  color: KeyColor.White,
  name: 'A0',
  number: 1,
  octave: 0,
  payload: {
    balanceWeight: 0,
    computedStrikeWeightRatio: 6,
    downWeightWithSpringSupport: null,
    downWeightWithoutSpringSupport: 60,
    frictionWeight: 11.5,
    frontWeight: 23.1,
    keyWeightRatio: 0.5,
    measuredStrikeWeightRatio: null,
    strikeWeight: 10.3,
    strikeWeightRatio: 6,
    supportSpringBalanceWeight: null,
    upWeight: 37,
    wippenBalanceWeight: 9.75,
    wippenRadiusWeight: 19.5,
    ...payload,
  },
});

describe('The useTouchWeightPreviewSeries hook', () => {
  const designedKeyboard = new Keyboard([
    key({
      balanceWeight: TARGET_BALANCE_WEIGHT + SPRING,
      supportSpringBalanceWeight: SPRING,
    }),
  ]);
  const analyzedKeyboard = new Keyboard([
    key({ balanceWeight: 58.5, supportSpringBalanceWeight: SPRING }),
  ]);
  let result: ReturnType<typeof useTouchWeightPreviewSeries>;

  const render = (useSupportSpringMeasurements: boolean) =>
    renderHook(() =>
      useTouchWeightPreviewSeries(
        designedKeyboard,
        analyzedKeyboard,
        useSupportSpringMeasurements,
      ),
    ).result.current;

  describe('When the springs were measured', () => {
    beforeEach(() => {
      result = render(true);
    });

    it('should land the designed touch on the target, the springs taken off it', () => {
      expect(result.designed.balance.data[0]?.payload).toBe(
        TARGET_BALANCE_WEIGHT,
      );
    });

    it('should take the springs off the touch the piano has today', () => {
      expect(result.current.balance.data[0]?.payload).toBe(58.5 - SPRING);
    });
  });

  describe('When the springs were fitted but never weighed', () => {
    beforeEach(() => {
      result = render(false);
    });

    it('should still land the designed touch on the target', () => {
      expect(result.designed.balance.data[0]?.payload).toBe(
        TARGET_BALANCE_WEIGHT,
      );
    });

    it('should report the touch of today as it was taken', () => {
      expect(result.current.balance.data[0]?.payload).toBe(58.5);
    });
  });
});
