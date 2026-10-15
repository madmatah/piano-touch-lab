import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

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

/** A design that fits springs: the previewer leaves them on the weight. */
const designedKeyboard = new Keyboard([
  key({
    balanceWeight: TARGET_BALANCE_WEIGHT + SPRING,
    supportSpringBalanceWeight: SPRING,
  }),
]);

/** The same piano as it stands, springs fitted but never weighed with them. */
const analyzedKeyboard = new Keyboard([
  key({ balanceWeight: 58.5, supportSpringBalanceWeight: SPRING }),
]);

const render = (useSupportSpringMeasurements: boolean) =>
  renderHook(() =>
    useTouchWeightPreviewSeries(
      designedKeyboard,
      analyzedKeyboard,
      useSupportSpringMeasurements,
    ),
  ).result.current;

describe('The useTouchWeightPreviewSeries hook', () => {
  describe('The touch the design gives', () => {
    it.each([true, false])(
      'should land on the target whether or not the springs were measured (%s)',
      (useSupportSpringMeasurements) => {
        const { designed } = render(useSupportSpringMeasurements);

        expect(designed.balance.data[0]?.payload).toBe(TARGET_BALANCE_WEIGHT);
      },
    );
  });

  describe('The touch the piano has today', () => {
    it('should take the springs off when they were measured', () => {
      const { current } = render(true);

      expect(current.balance.data[0]?.payload).toBe(58.5 - SPRING);
    });

    it('should report the weights as they were taken when they were not', () => {
      const { current } = render(false);

      expect(current.balance.data[0]?.payload).toBe(58.5);
    });
  });
});
