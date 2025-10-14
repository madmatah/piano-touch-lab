import { describe, it, expect, beforeEach } from 'bun:test';
import { TouchWeightPreviewer } from './touch-weight-previewer';
import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from './touch-weight-key-analysis';
import { KeyColor } from '../keyboard/key-color.enum';

describe('The TouchWeightPreviewer class', () => {
  let instance: TouchWeightPreviewer;

  const fakeKeyWithAllValues: TouchWeightAnalyzedKey = {
    color: KeyColor.White,
    name: 'C4',
    number: 40,
    octave: 4,
    payload: {
      balanceWeight: null,
      computedStrikeWeightRatio: null,
      downWeightWithSpringSupport: null,
      downWeightWithoutSpringSupport: null,
      frictionWeight: 12,
      frontWeight: 27,
      keyWeightRatio: 0.5,
      measuredStrikeWeightRatio: null,
      strikeWeight: 10.5,
      strikeWeightRatio: 5.3,
      supportSpringBalanceWeight: null,
      upWeight: null,
      wippenBalanceWeight: 9,
      wippenRadiusWeight: 18,
    },
  };

  beforeEach(() => {
    instance = new TouchWeightPreviewer();
  });

  describe('The computeTouchWeight() method', () => {
    let result: TouchWeightKeyAnalysis;

    describe('When all required values are present', () => {
      const expectedBalanceWeight = 37.7;
      const expectedUpWeight = 25.7;
      const expectedDownWeight = 49.7;

      beforeEach(() => {
        result = instance.computeTouchWeight(fakeKeyWithAllValues);
      });

      it('should return the key payload with computed weights', () => {
        expect(result).toEqual({
          ...fakeKeyWithAllValues.payload,
          balanceWeight: expect.closeTo(expectedBalanceWeight) as number,
          downWeightWithSpringSupport: expect.closeTo(
            expectedDownWeight,
          ) as number,
          downWeightWithoutSpringSupport: expect.closeTo(
            expectedDownWeight,
          ) as number,
          upWeight: expect.closeTo(expectedUpWeight) as number,
        });
      });
    });

    describe('When frontWeight is missing', () => {
      beforeEach(() => {
        const keyWithMissingFrontWeight = {
          ...fakeKeyWithAllValues,
          payload: {
            ...fakeKeyWithAllValues.payload,
            frontWeight: null,
          },
        };
        result = instance.computeTouchWeight(keyWithMissingFrontWeight);
      });

      it('should return null values for computed weights', () => {
        expect(result.downWeightWithoutSpringSupport).toBeNull();
        expect(result.upWeight).toBeNull();
      });

      it('should preserve the original payload', () => {
        expect(result.frontWeight).toBeNull();
        expect(result.strikeWeight).toBe(10.5);
        expect(result.frictionWeight).toBe(12);
      });
    });

    describe('When strikeWeight is missing', () => {
      beforeEach(() => {
        const keyWithMissingStrikeWeight = {
          ...fakeKeyWithAllValues,
          payload: {
            ...fakeKeyWithAllValues.payload,
            strikeWeight: null,
          },
        };
        result = instance.computeTouchWeight(keyWithMissingStrikeWeight);
      });

      it('should return null values for computed weights', () => {
        expect(result.downWeightWithoutSpringSupport).toBeNull();
        expect(result.upWeight).toBeNull();
      });
    });

    describe('When strikeWeightRatio is missing', () => {
      beforeEach(() => {
        const keyWithMissingStrikeWeightRatio = {
          ...fakeKeyWithAllValues,
          payload: {
            ...fakeKeyWithAllValues.payload,
            strikeWeightRatio: null,
          },
        };
        result = instance.computeTouchWeight(keyWithMissingStrikeWeightRatio);
      });

      it('should return null values for computed weights', () => {
        expect(result.downWeightWithoutSpringSupport).toBeNull();
        expect(result.upWeight).toBeNull();
      });
    });

    describe('When frictionWeight is missing', () => {
      beforeEach(() => {
        const keyWithMissingFrictionWeight = {
          ...fakeKeyWithAllValues,
          payload: {
            ...fakeKeyWithAllValues.payload,
            frictionWeight: null,
          },
        };
        result = instance.computeTouchWeight(keyWithMissingFrictionWeight);
      });

      it('should return null values for computed weights', () => {
        expect(result.downWeightWithoutSpringSupport).toBeNull();
        expect(result.upWeight).toBeNull();
      });
    });
  });
});
