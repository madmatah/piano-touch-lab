import { beforeEach, describe, expect, it } from 'bun:test';

import {
  scaleFromReadings,
  scaleOver,
  type AxisScale,
} from '@/components/charts/echarts/build-base-option';

const WEIGHT: AxisScale = { interval: 20, max: 100, min: 0 };
const FRONT_WEIGHT: AxisScale = { interval: 10, max: 45, min: -10 };

describe('The scaleOver() function', () => {
  let result: AxisScale;

  describe('When the readings fit in the design scale', () => {
    beforeEach(() => {
      result = scaleOver(WEIGHT, [40, 88]);
    });

    it('should keep the design scale', () => {
      expect(result).toEqual(WEIGHT);
    });
  });

  describe('When the design ceiling is off the rules and nothing reaches it', () => {
    beforeEach(() => {
      result = scaleOver(FRONT_WEIGHT, [-8.9, 41.2]);
    });

    it('should keep the design ceiling', () => {
      expect(result.max).toBe(45);
    });
  });

  describe('When a reading goes over the design ceiling', () => {
    beforeEach(() => {
      result = scaleOver(WEIGHT, [40, 104]);
    });

    it('should take the ceiling to the next rule above it', () => {
      expect(result.max).toBe(120);
    });
  });

  describe('When a reading goes under the design floor', () => {
    beforeEach(() => {
      result = scaleOver(FRONT_WEIGHT, [-14, 30]);
    });

    it('should take the floor to the next rule under it', () => {
      expect(result.min).toBe(-20);
    });
  });
});

describe('The scaleFromReadings() function', () => {
  let result: AxisScale;

  describe('When nothing reads near zero', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, [37.4, 88]);
    });

    it('should rule the panel from the first round step under the lowest reading', () => {
      expect(result).toEqual({ interval: 10, max: 100, min: 30 });
    });
  });

  describe('When the lowest reading falls on a round step', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, [40, 88]);
    });

    it('should keep that reading off the foot of the panel', () => {
      expect(result.min).toBe(30);
    });
  });

  describe('When a piano reads low', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, [4, 88]);
    });

    it('should keep the design scale whole', () => {
      expect(result).toEqual(WEIGHT);
    });
  });

  describe('When a key reads nothing at all', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, [0, 88]);
    });

    it('should keep the design scale whole', () => {
      expect(result).toEqual(WEIGHT);
    });
  });

  describe('When a reading goes over the design ceiling', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, [37, 104]);
    });

    it('should widen the scale and rule it more coarsely', () => {
      expect(result).toEqual({ interval: 20, max: 120, min: 20 });
    });
  });

  describe('When there are no readings', () => {
    beforeEach(() => {
      result = scaleFromReadings(WEIGHT, []);
    });

    it('should keep the design scale', () => {
      expect(result).toEqual(WEIGHT);
    });
  });
});
