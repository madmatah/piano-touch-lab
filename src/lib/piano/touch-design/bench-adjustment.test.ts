import { beforeEach, describe, expect, it } from 'bun:test';

import {
  benchAdjustment,
  isWorthAdjusting,
} from '@/lib/piano/touch-design/bench-adjustment';

describe('The benchAdjustment() function', () => {
  let result: number | null;

  describe('When the weights do not fall on a tenth', () => {
    beforeEach(() => {
      result = benchAdjustment(4.74, 22.96);
    });

    it('should give the difference between the weights as printed', () => {
      expect(result).toBe(18.3);
    });
  });

  describe('When the weights differ by a tenth once printed', () => {
    beforeEach(() => {
      result = benchAdjustment(35.2, 35.3);
    });

    it('should give exactly a tenth', () => {
      expect(result).toBe(0.1);
    });
  });

  describe('When a negative reading falls halfway between two tenths', () => {
    beforeEach(() => {
      result = benchAdjustment(-7.25, 9.3);
    });

    it('should round it away from zero, as the screen does', () => {
      expect(result).toBe(16.6);
    });
  });

  describe('When a positive weight falls halfway between two tenths', () => {
    beforeEach(() => {
      result = benchAdjustment(0, 22.95);
    });

    it('should round it up, as the screen does', () => {
      expect(result).toBe(23);
    });
  });

  describe('When the reading is unknown', () => {
    beforeEach(() => {
      result = benchAdjustment(null, 9.5);
    });

    it('should return null', () => {
      expect(result).toBeNull();
    });
  });

  describe('When the target is unknown', () => {
    beforeEach(() => {
      result = benchAdjustment(9.5, null);
    });

    it('should return null', () => {
      expect(result).toBeNull();
    });
  });
});

describe('The isWorthAdjusting() function', () => {
  let result: boolean;

  describe('When the change is a tenth', () => {
    beforeEach(() => {
      result = isWorthAdjusting(benchAdjustment(35.2, 35.3));
    });

    it('should be worth making', () => {
      expect(result).toBe(true);
    });
  });

  describe('When the weights print the same', () => {
    beforeEach(() => {
      result = isWorthAdjusting(benchAdjustment(10.26, 10.34));
    });

    it('should not be worth making', () => {
      expect(result).toBe(false);
    });
  });

  describe('When the change is unknown', () => {
    beforeEach(() => {
      result = isWorthAdjusting(null);
    });

    it('should not be worth making', () => {
      expect(result).toBe(false);
    });
  });
});
