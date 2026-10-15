import { describe, expect, it } from 'bun:test';

import { KeyColor, type KeyWith } from '../keyboard';
import { FrontWeightCalculator } from './front-weight-calculator/front-weight-calculator';
import { generateSupportSpringBalanceWeightCurve } from './generate-support-spring-balance-weight-curve';
import { designedBalanceWeight } from './designed-balance-weight';
import { TouchWeightPreviewer } from './touch-weight-previewer/touch-weight-previewer';
import type { TouchWeightKeyAnalysis } from './touch-weight-key-analysis';

const TARGET_BALANCE_WEIGHT = 39;

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
  },
  ...payload,
});

/**
 * The front weight calculator and the touch weight previewer are two halves of
 * one calculation, and they are wired together through four screens. These
 * tests pin the seam: what the design aims at, and what the preview reports.
 */
describe('The designed balance weight', () => {
  const calculator = new FrontWeightCalculator();
  const previewer = new TouchWeightPreviewer();

  /** The whole design pipeline for one key, as the application runs it. */
  const designKey = (supportSpringBalanceWeight: number | null) => {
    const measured = analyzedKey({});
    const designed = {
      ...measured,
      payload: { ...measured.payload, supportSpringBalanceWeight },
    };
    const withFrontWeight = calculator.calculateFrontWeight(
      designed,
      TARGET_BALANCE_WEIGHT,
    );
    return previewer.computeTouchWeight({
      ...designed,
      payload: withFrontWeight,
    });
  };

  describe('When the design fits no support spring', () => {
    it('should land on the target, read either way', () => {
      const previewed = designKey(null);

      expect(previewed.balanceWeight).toBe(TARGET_BALANCE_WEIGHT);
      expect(designedBalanceWeight(previewed)).toBe(TARGET_BALANCE_WEIGHT);
    });
  });

  describe('When the design fits a support spring', () => {
    const SPRING = 9.5;

    it('should land on the target once the spring is accounted for', () => {
      const previewed = designKey(SPRING);

      expect(designedBalanceWeight(previewed)).toBe(TARGET_BALANCE_WEIGHT);
    });

    it('should leave the static balance weight one spring above it', () => {
      const previewed = designKey(SPRING);

      // Not a quirk to work around but the definition: the analyser measures
      // the balance weight with no spring helping, and the previewer keeps it.
      expect(previewed.balanceWeight).toBe(TARGET_BALANCE_WEIGHT + SPRING);
    });
  });

  describe('When the design tapers the springs across the keyboard', () => {
    it('should land on the target on every key, however the spring varies', () => {
      const curve = generateSupportSpringBalanceWeightCurve({
        baseTension: 9.5,
        numberOfSprings: 48,
        tensionDropIndex: 1,
      });

      const previewed = Array.from({ length: 88 }, (_, index) =>
        designKey(curve[index] ?? null),
      );

      for (const key of previewed) {
        // The previewer rounds the balance weight to the tenth a technician
        // reads, so a spring that is not itself a round tenth leaves that much
        // behind. Anything beyond is the spring going missing.
        expect(designedBalanceWeight(key)).toBeCloseTo(
          TARGET_BALANCE_WEIGHT,
          1,
        );
      }
    });
  });
});
