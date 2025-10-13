import { describe, it, expect, beforeEach } from 'bun:test';
import { KeyColor } from '@/lib/piano/keyboard/key-color.enum';
import type { KeyWith } from '@/lib/piano/keyboard/key';
import { TouchWeightAnalyzer } from '@/lib/piano/touch-design/touch-weight-analyzer';
import {
  DEFAULT_KEY_WEIGHT_RATIO,
  DEFAULT_WIPPEN_RADIUS_WEIGHT,
} from '@/lib/piano/touch-design/constants';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

describe('The TouchWeightAnalyzer class', () => {
  let analyzer: TouchWeightAnalyzer;
  let key: KeyWith<MeasuredKeyRequirements>;

  const baseKey = {
    color: KeyColor.White,
    name: 'E3',
    number: 40,
    octave: 3,
  };

  const nullPayload: MeasuredKeyRequirements = {
    downWeightWithSpringSupport: null,
    downWeightWithoutSpringSupport: null,
    frontWeight: null,
    keyWeightRatio: null,
    measuredStrikeWeightRatio: null,
    strikeWeight: null,
    upWeight: null,
    wippenRadiusWeight: null,
  };

  const basePayload: MeasuredKeyRequirements = {
    downWeightWithSpringSupport: 35,
    downWeightWithoutSpringSupport: 40,
    frontWeight: 52,
    keyWeightRatio: 0.45,
    measuredStrikeWeightRatio: null,
    strikeWeight: 18,
    upWeight: 10,
    wippenRadiusWeight: 17,
  };

  beforeEach(() => {
    analyzer = new TouchWeightAnalyzer();
  });

  describe('The analyzeKey() method', () => {
    let result: ReturnType<TouchWeightAnalyzer['analyzeKey']>;

    describe('When all measurements are provided', () => {
      beforeEach(() => {
        key = { ...baseKey, payload: basePayload };
        result = analyzer.analyzeKey(key);
      });

      it('should compute balanceWeight as average of down and up weights', () => {
        expect(result.balanceWeight).toBe((40 + 10) / 2);
      });

      it('should compute frictionWeight as half the difference of down and up weights', () => {
        expect(result.frictionWeight).toBe((40 - 10) / 2);
      });

      it('should compute wippenBalanceWeight using keyWeightRatio and wippenRadiusWeight', () => {
        expect(result.wippenBalanceWeight).toBeCloseTo(0.45 * 17);
      });

      it('should compute computedStrikeWeightRatio with provided values', () => {
        expect(result.computedStrikeWeightRatio).toBeCloseTo(
          (52 + (40 + 10) / 2 - 0.45 * 17) / 18,
        );
      });

      it('should set strikeWeightRatio to computed value when measured is null', () => {
        expect(result.strikeWeightRatio).toBe(result.computedStrikeWeightRatio);
      });

      it('should compute supportSpringBalanceWeight', () => {
        expect(result.supportSpringBalanceWeight).toBeCloseTo(5);
      });
    });

    describe('When some measurements are missing', () => {
      beforeEach(() => {
        const payload: MeasuredKeyRequirements = {
          ...nullPayload,
          frontWeight: 50,
          strikeWeight: 20,
        };

        key = { ...baseKey, payload };
        result = analyzer.analyzeKey(key);
      });

      it('should compute balanceWeight as null', () => {
        expect(result.balanceWeight).toBeNull();
      });

      it('should compute frictionWeight as null', () => {
        expect(result.frictionWeight).toBeNull();
      });

      it('should use defaults to compute wippenBalanceWeight', () => {
        expect(result.wippenBalanceWeight).toBe(
          DEFAULT_KEY_WEIGHT_RATIO * DEFAULT_WIPPEN_RADIUS_WEIGHT,
        );
      });

      it('should compute computedStrikeWeightRatio as null when dependencies missing', () => {
        expect(result.computedStrikeWeightRatio).toBeNull();
      });

      it('should set strikeWeightRatio to computed value (null) when measured is null', () => {
        expect(result.strikeWeightRatio).toBeNull();
      });
    });

    describe('When measuredStrikeWeightRatio is provided', () => {
      beforeEach(() => {
        const payload: MeasuredKeyRequirements = {
          downWeightWithSpringSupport: null,
          downWeightWithoutSpringSupport: 40,
          frontWeight: 52,
          keyWeightRatio: 0.5,
          measuredStrikeWeightRatio: 2,
          strikeWeight: 20,
          upWeight: 10,
          wippenRadiusWeight: 18,
        };

        key = { ...baseKey, payload };
        result = analyzer.analyzeKey(key);
      });

      it('should keep strikeWeightRatio equal to measured value', () => {
        expect(result.strikeWeightRatio).toBe(2);
      });

      it('should still compute computedStrikeWeightRatio independently', () => {
        expect(result.computedStrikeWeightRatio).toBeCloseTo(
          (52 + (40 + 10) / 2 - 0.5 * 18) / 20,
        );
      });
    });

    describe('When only one of upWeight or downWeightWithoutSpringSupport is missing', () => {
      let resultA: ReturnType<TouchWeightAnalyzer['analyzeKey']>;
      let resultB: ReturnType<TouchWeightAnalyzer['analyzeKey']>;

      beforeEach(() => {
        const payloadA: MeasuredKeyRequirements = {
          ...basePayload,
          downWeightWithoutSpringSupport: 40,
          upWeight: null,
        };
        const payloadB: MeasuredKeyRequirements = {
          ...basePayload,
          downWeightWithoutSpringSupport: null,
          upWeight: 10,
        };

        resultA = analyzer.analyzeKey({ ...baseKey, payload: payloadA });
        resultB = analyzer.analyzeKey({ ...baseKey, payload: payloadB });
      });

      it('should set balanceWeight to null', () => {
        expect(resultA.balanceWeight).toBeNull();
        expect(resultB.balanceWeight).toBeNull();
      });

      it('should set frictionWeight to null', () => {
        expect(resultA.frictionWeight).toBeNull();
        expect(resultB.frictionWeight).toBeNull();
      });
    });

    describe('When strikeWeight or frontWeight or balanceWeight is missing for ratio', () => {
      let resultStrikeMissing: ReturnType<TouchWeightAnalyzer['analyzeKey']>;
      let resultFrontMissing: ReturnType<TouchWeightAnalyzer['analyzeKey']>;
      let resultBalanceMissing: ReturnType<TouchWeightAnalyzer['analyzeKey']>;

      beforeEach(() => {
        const common: Omit<
          MeasuredKeyRequirements,
          | 'strikeWeight'
          | 'frontWeight'
          | 'downWeightWithoutSpringSupport'
          | 'upWeight'
        > & {
          downWeightWithoutSpringSupport: number | null;
          upWeight: number | null;
        } = {
          downWeightWithSpringSupport: null,
          downWeightWithoutSpringSupport: 40,
          keyWeightRatio: 0.5,
          measuredStrikeWeightRatio: null,
          upWeight: 10,
          wippenRadiusWeight: 18,
        };

        resultStrikeMissing = analyzer.analyzeKey({
          ...baseKey,
          payload: { ...common, frontWeight: 52, strikeWeight: null },
        });
        resultFrontMissing = analyzer.analyzeKey({
          ...baseKey,
          payload: { ...common, frontWeight: null, strikeWeight: 20 },
        });
        resultBalanceMissing = analyzer.analyzeKey({
          ...baseKey,
          payload: {
            ...common,
            downWeightWithoutSpringSupport: null,
            frontWeight: 52,
            strikeWeight: 20,
          },
        });
      });

      it('should compute computedStrikeWeightRatio as null when strikeWeight is missing', () => {
        expect(resultStrikeMissing.computedStrikeWeightRatio).toBeNull();
      });

      it('should compute computedStrikeWeightRatio as null when frontWeight is missing', () => {
        expect(resultFrontMissing.computedStrikeWeightRatio).toBeNull();
      });

      it('should compute computedStrikeWeightRatio as null when balanceWeight is missing', () => {
        expect(resultBalanceMissing.computedStrikeWeightRatio).toBeNull();
      });
    });

    describe('When downWeightWithSpringSupport is not provided', () => {
      let payload: MeasuredKeyRequirements;

      beforeEach(() => {
        payload = { ...basePayload, downWeightWithSpringSupport: null };
      });

      describe('When downWeightWithoutSpringSupport is provided', () => {
        const expectedDownWeight = 40;

        beforeEach(() => {
          payload = {
            ...payload,
            downWeightWithoutSpringSupport: expectedDownWeight,
          };
          result = analyzer.analyzeKey({ ...baseKey, payload });
        });

        it('should set downWeightWithSpringSupport to downWeightWithoutSpringSupport', () => {
          expect(result.downWeightWithSpringSupport).toBe(expectedDownWeight);
        });

        it('should set supportSpringBalanceWeight to null', () => {
          expect(result.supportSpringBalanceWeight).toBeNull();
        });
      });

      describe('When downWeightWithoutSpringSupport is not provided', () => {
        beforeEach(() => {
          payload = {
            ...payload,
            downWeightWithoutSpringSupport: null,
          };
          result = analyzer.analyzeKey({ ...baseKey, payload });
        });

        it('should set downWeightWithSpringSupport to null', () => {
          expect(result.downWeightWithSpringSupport).toBeNull();
        });

        it('should set supportSpringBalanceWeight to null', () => {
          expect(result.supportSpringBalanceWeight).toBeNull();
        });
      });
    });
  });
});
