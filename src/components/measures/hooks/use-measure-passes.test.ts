import { beforeEach, describe, expect, it } from 'bun:test';

import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

import {
  isPassDone,
  passProgress,
  type MeasurePass,
  type MeasurePassId,
} from './use-measure-passes';

const DOWN_UP: MeasurePass = {
  fields: ['downWeightWithoutSpringSupport', 'upWeight'],
  id: 'down-up',
  number: 1,
};
const FRONT_WEIGHT: MeasurePass = {
  fields: ['frontWeight'],
  id: 'front-weight',
  number: 2,
};

const reading = (
  values: Partial<MeasuredKeyRequirements>,
): MeasuredKeyRequirements => ({
  downWeightWithSpringSupport: null,
  downWeightWithoutSpringSupport: null,
  frontWeight: null,
  keyWeightRatio: null,
  measuredStrikeWeightRatio: null,
  strikeWeight: null,
  upWeight: null,
  wippenRadiusWeight: null,
  ...values,
});

describe('The isPassDone() function', () => {
  let result: boolean;

  describe('When the key has every reading the pass asks for', () => {
    beforeEach(() => {
      result = isPassDone(
        DOWN_UP,
        reading({ downWeightWithoutSpringSupport: 52, upWeight: 30 }),
      );
    });

    it('should be done', () => {
      expect(result).toBe(true);
    });
  });

  describe('When the key is missing one of them', () => {
    beforeEach(() => {
      result = isPassDone(
        DOWN_UP,
        reading({ downWeightWithoutSpringSupport: 52 }),
      );
    });

    it('should not be done', () => {
      expect(result).toBe(false);
    });
  });

  describe('When a reading is zero', () => {
    beforeEach(() => {
      result = isPassDone(FRONT_WEIGHT, reading({ frontWeight: 0 }));
    });

    it('should count it as taken', () => {
      expect(result).toBe(true);
    });
  });
});

describe('The passProgress() function', () => {
  let result: Map<MeasurePassId, number>;

  describe('When the keys are filled pass by pass', () => {
    beforeEach(() => {
      result = passProgress(
        [DOWN_UP, FRONT_WEIGHT],
        [
          reading({
            downWeightWithoutSpringSupport: 52,
            frontWeight: 20,
            upWeight: 30,
          }),
          reading({ downWeightWithoutSpringSupport: 51, upWeight: 31 }),
          reading({ frontWeight: 21 }),
        ],
        3,
      );
    });

    it('should count each pass on its own', () => {
      expect([...result]).toEqual([
        ['down-up', 2],
        ['front-weight', 2],
      ]);
    });
  });

  describe('When the store holds more keys than the keyboard', () => {
    beforeEach(() => {
      result = passProgress(
        [FRONT_WEIGHT],
        [reading({ frontWeight: 20 }), reading({ frontWeight: 21 })],
        1,
      );
    });

    it('should count the keys of the keyboard only', () => {
      expect(result.get('front-weight')).toBe(1);
    });
  });
});
