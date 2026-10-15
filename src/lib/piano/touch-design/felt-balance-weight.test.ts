import { beforeEach, describe, expect, it } from 'bun:test';

import { KeyColor, type KeyWith } from '../keyboard';
import { FrontWeightCalculator } from './front-weight-calculator/front-weight-calculator';
import { generateSupportSpringBalanceWeightCurve } from './generate-support-spring-balance-weight-curve';
import { feltBalanceWeight, feltWeight } from './felt-balance-weight';
import { TouchWeightPreviewer } from './touch-weight-previewer/touch-weight-previewer';
import type { TouchWeightKeyAnalysis } from './touch-weight-key-analysis';

const TARGET_BALANCE_WEIGHT = 39;
const SPRING = 9.5;

const analyzedKey = (
  payload: Partial<TouchWeightKeyAnalysis>,
): KeyWith<TouchWeightKeyAnalysis> => ({
  color: KeyColor.White,
  name: 'A0',
  number: 1,
  octave: 0,
  payload: {
    balanceWeight: 58.5,
    computedStrikeWeightRatio: 6,
    downWeightWithSpringSupport: 58,
    downWeightWithoutSpringSupport: 70,
    frictionWeight: 11.5,
    frontWeight: 7.1,
    keyWeightRatio: 0.5,
    measuredStrikeWeightRatio: null,
    strikeWeight: 10.3,
    strikeWeightRatio: 6,
    supportSpringBalanceWeight: 12,
    upWeight: 47,
    wippenBalanceWeight: 9.75,
    wippenRadiusWeight: 19.5,
    ...payload,
  },
});

describe('The feltBalanceWeight() function', () => {
  const calculator = new FrontWeightCalculator();
  const previewer = new TouchWeightPreviewer();

  const designKey = (supportSpringBalanceWeight: number | null) => {
    const designed = analyzedKey({ supportSpringBalanceWeight });
    const withFrontWeight = calculator.calculateFrontWeight(
      designed,
      TARGET_BALANCE_WEIGHT,
    );
    return previewer.computeTouchWeight({
      ...designed,
      payload: withFrontWeight,
    });
  };

  let previewed: ReturnType<typeof designKey>;

  describe('When the design fits no support spring', () => {
    beforeEach(() => {
      previewed = designKey(null);
    });

    it('should land on the target', () => {
      expect(feltBalanceWeight(previewed)).toBe(TARGET_BALANCE_WEIGHT);
    });

    it('should agree with the static balance weight the previewer reports', () => {
      expect(previewed.balanceWeight).toBe(TARGET_BALANCE_WEIGHT);
    });
  });

  describe('When the design fits a support spring', () => {
    beforeEach(() => {
      previewed = designKey(SPRING);
    });

    it('should land on the target once the spring is accounted for', () => {
      expect(feltBalanceWeight(previewed)).toBe(TARGET_BALANCE_WEIGHT);
    });

    it('should leave the static balance weight, measured with no spring helping, one spring above it', () => {
      expect(previewed.balanceWeight).toBe(TARGET_BALANCE_WEIGHT + SPRING);
    });
  });

  describe('When the design tapers the springs across the keyboard', () => {
    let result: ReturnType<typeof feltBalanceWeight>[];

    beforeEach(() => {
      const curve = generateSupportSpringBalanceWeightCurve({
        baseTension: SPRING,
        numberOfSprings: 48,
        tensionDropIndex: 1,
      });
      result = Array.from({ length: 88 }, (_, index) =>
        feltBalanceWeight(designKey(curve[index] ?? null)),
      );
    });

    it('should land on the target on every key, to the tenth the previewer rounds to', () => {
      for (const balanceWeight of result) {
        expect(balanceWeight).toBeCloseTo(TARGET_BALANCE_WEIGHT, 1);
      }
    });
  });
  describe('When a measured key was weighed with its spring', () => {
    let felt: ReturnType<typeof feltBalanceWeight>;

    beforeEach(() => {
      felt = feltBalanceWeight(analyzedKey({}).payload);
    });

    it('should take what the spring carries off the static balance weight', () => {
      expect(felt).toBe(58.5 - 12);
    });
  });

  describe('When a measured key carries no spring reading', () => {
    let felt: ReturnType<typeof feltBalanceWeight>;

    beforeEach(() => {
      felt = feltBalanceWeight(
        analyzedKey({ supportSpringBalanceWeight: null }).payload,
      );
    });

    it('should be the static balance weight', () => {
      expect(felt).toBe(58.5);
    });
  });

  describe('When a key has no balance weight yet', () => {
    let felt: ReturnType<typeof feltBalanceWeight>;

    beforeEach(() => {
      felt = feltBalanceWeight(analyzedKey({ balanceWeight: null }).payload);
    });

    it('should have none to feel', () => {
      expect(felt).toBeNull();
    });
  });
});

describe('The feltWeight() function', () => {
  let result: ReturnType<typeof feltWeight>[];

  describe('When a weight is read with and without a spring', () => {
    beforeEach(() => {
      result = [feltWeight(66, 14), feltWeight(66, null)];
    });

    it('should take off what the spring carries, and nothing when there is none', () => {
      expect(result).toEqual([52, 66]);
    });
  });

  describe('When there is no weight', () => {
    beforeEach(() => {
      result = [feltWeight(null, 14)];
    });

    it('should have none to feel', () => {
      expect(result).toEqual([null]);
    });
  });
});
