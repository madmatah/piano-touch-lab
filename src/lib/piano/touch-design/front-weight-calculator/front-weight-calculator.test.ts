import { describe, it, expect, beforeEach } from 'bun:test';
import { FrontWeightCalculator } from './front-weight-calculator';
import type {
  TouchWeightAnalyzedKey,
  TouchWeightKeyAnalysis,
} from '../touch-weight-key-analysis';
import { KeyColor } from '../../keyboard/key-color.enum';

describe('The FrontWeightCalculator class', () => {
  let instance: FrontWeightCalculator;

  const fakeKeyNumber = 40;
  const fakeKeyName = 'C4';
  const fakeStrikeWeight = 9.6;
  const fakeStrikeWeightRatio = 6.3;
  const fakeFrictionWeight = 12;
  const fakeWippenBalanceWeight = 9;
  const fakeSupportSpringBalanceWeight = 5;
  const fakeTargetBalanceWeight = 43;

  beforeEach(() => {
    instance = new FrontWeightCalculator();
  });

  describe('The calculateFrontWeight() method', () => {
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
        frontWeight: null,
        keyWeightRatio: null,
        measuredStrikeWeightRatio: null,
        strikeWeight: fakeStrikeWeight,
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
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should return the correct front weight calculation', () => {
        const expectedFrontWeight = 21.48;
        expect(result.frontWeight).toBeCloseTo(expectedFrontWeight, 2);
      });

      it('should preserve all original payload properties', () => {
        expect(result.strikeWeight).toBe(fakeStrikeWeight);
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
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should use 0 for supportSpringBalanceWeight in calculation', () => {
        const expectedFrontWeight = 26.48;
        expect(result.frontWeight).toBeCloseTo(expectedFrontWeight, 2);
      });
    });

    describe('When strikeWeight is missing', () => {
      beforeEach(() => {
        key = {
          ...baseKey,
          payload: {
            ...baseKey.payload,
            strikeWeight: null,
          },
        };
        targetBalanceWeight = fakeTargetBalanceWeight;
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should return frontWeight as null', () => {
        expect(result.frontWeight).toBeNull();
      });

      it('should preserve all original payload properties', () => {
        expect(result.strikeWeight).toBeNull();
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
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should return frontWeight as null', () => {
        expect(result.frontWeight).toBeNull();
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
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should return frontWeight as null', () => {
        expect(result.frontWeight).toBeNull();
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
        result = instance.calculateFrontWeight(key, targetBalanceWeight);
      });

      it('should return frontWeight as null when wippenBalanceWeight is zero', () => {
        expect(result.frontWeight).toBeNull();
      });
    });
  });
});
