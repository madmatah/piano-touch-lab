import { describe, it, expect, beforeEach } from 'bun:test';
import { StrikeWeightCalculator } from './strike-weight-calculator';
import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';
import { KeyColor } from '../../keyboard/key-color.enum';

describe('The StrikeWeightCalculator class', () => {
  let instance: StrikeWeightCalculator;

  const fakeKeyNumber = 40;
  const fakeKeyName = 'C4';
  const fakeFrontWeight = 27;
  const fakeStrikeWeightRatio = 6.3;
  const fakeFrictionWeight = 12;
  const fakeWippenBalanceWeight = 9;
  const fakeSupportSpringBalanceWeight = 5;
  const fakeTargetBalanceWeight = 43;

  beforeEach(() => {
    instance = new StrikeWeightCalculator();
  });

  describe('The calculateStrikeWeight() method', () => {
    let key: TouchWeightAnalyzedKey;
    let targetBalanceWeight: number;
    let result: TouchWeightKeyAnalysis;

    const baseKey: TouchWeightAnalyzedKey = {
      color: KeyColor.White,
      name: fakeKeyName,
      number: fakeKeyNumber,
      octave: 4,
      payload: {
        balanceWeight: null,
        computedStrikeWeightRatio: null,
        downWeightWithSpringSupport: null,
        downWeightWithoutSpringSupport: null,
        frictionWeight: fakeFrictionWeight,
        frontWeight: fakeFrontWeight,
        keyWeightRatio: null,
        measuredStrikeWeightRatio: null,
        strikeWeight: null,
        strikeWeightRatio: fakeStrikeWeightRatio,
        supportSpringBalanceWeight: fakeSupportSpringBalanceWeight,
        upWeight: null,
        wippenBalanceWeight: fakeWippenBalanceWeight,
        wippenRadiusWeight: null,
      },
    };

    describe('When all required values are present', () => {
      beforeEach(() => {
        key = { ...baseKey };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should return the correct front weight calculation', () => {
        const expectedStrikeWeight = 10.48;
        expect(result.strikeWeight).toBeCloseTo(expectedStrikeWeight, 2);
      });

      it('should preserve all original payload properties', () => {
        expect(result.frontWeight).toBe(fakeFrontWeight);
        expect(result.strikeWeightRatio).toBe(fakeStrikeWeightRatio);
        expect(result.frictionWeight).toBe(fakeFrictionWeight);
        expect(result.wippenBalanceWeight).toBe(fakeWippenBalanceWeight);
        expect(result.supportSpringBalanceWeight).toBe(
          fakeSupportSpringBalanceWeight,
        );
      });
    });

    describe('When supportSpringBalanceWeight is null', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            supportSpringBalanceWeight: null,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should use 0 for supportSpringBalanceWeight in calculation', () => {
        const expectedStrikeWeight = 9.68;
        expect(result.strikeWeight).toBeCloseTo(expectedStrikeWeight, 2);
      });
    });

    describe('When frontWeight is missing', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            frontWeight: null,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should return strikeWeight as null', () => {
        expect(result.strikeWeight).toBeNull();
      });

      it('should preserve all original payload properties', () => {
        expect(result.frontWeight).toBe(null);
        expect(result.strikeWeightRatio).toBe(fakeStrikeWeightRatio);
        expect(result.frictionWeight).toBe(fakeFrictionWeight);
        expect(result.wippenBalanceWeight).toBe(fakeWippenBalanceWeight);
      });
    });

    describe('When strikeWeightRatio is missing', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            strikeWeightRatio: null,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should return strikeWeight as null', () => {
        expect(result.strikeWeight).toBeNull();
      });
    });

    describe('When frictionWeight is missing', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            frictionWeight: null,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should return strikeWeight as null', () => {
        expect(result.strikeWeight).toBeNull();
      });
    });

    describe('When wippenBalanceWeight is zero', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            wippenBalanceWeight: 0,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateStrikeWeight(key, targetBalanceWeight);
      });

      it('should return strikeWeight as null when wippenBalanceWeight is zero', () => {
        expect(result.strikeWeight).toBeNull();
      });
    });
  });
});
