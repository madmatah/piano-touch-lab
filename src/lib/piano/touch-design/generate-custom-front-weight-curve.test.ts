import { describe, it, expect } from 'bun:test';
import { getFrontWeightCurve } from './generate-custom-front-weight-curve';
import { frontWeightData } from './data/front-weights';
import { FrontWeightLevel } from './front-weight-level';

describe('getFrontWeightCurve', () => {
  describe('reference levels (5-9) - should return exact reference data', () => {
    it('should return exact reference data for level 5', () => {
      const result = getFrontWeightCurve(5);
      expect(result).toEqual(frontWeightData[FrontWeightLevel.Level5]);
    });

    it('should return exact reference data for level 6', () => {
      const result = getFrontWeightCurve(6);
      expect(result).toEqual(frontWeightData[FrontWeightLevel.Level6]);
    });

    it('should return exact reference data for level 7', () => {
      const result = getFrontWeightCurve(7);
      expect(result).toEqual(frontWeightData[FrontWeightLevel.Level7]);
    });

    it('should return exact reference data for level 8', () => {
      const result = getFrontWeightCurve(8);
      expect(result).toEqual(frontWeightData[FrontWeightLevel.Level8]);
    });

    it('should return exact reference data for level 9', () => {
      const result = getFrontWeightCurve(9);
      expect(result).toEqual(frontWeightData[FrontWeightLevel.Level9]);
    });

    it('should return the same reference array instance for level 5', () => {
      const result1 = getFrontWeightCurve(5);
      const result2 = getFrontWeightCurve(5);
      expect(result1).toBe(frontWeightData[FrontWeightLevel.Level5]);
      expect(result2).toBe(frontWeightData[FrontWeightLevel.Level5]);
      expect(result1).toBe(result2);
    });

    it('should return the same reference array instance for level 6', () => {
      const result1 = getFrontWeightCurve(6);
      const result2 = getFrontWeightCurve(6);
      expect(result1).toBe(frontWeightData[FrontWeightLevel.Level6]);
      expect(result2).toBe(frontWeightData[FrontWeightLevel.Level6]);
      expect(result1).toBe(result2);
    });
  });

  describe('custom levels (outside 5-9)', () => {
    it('should generate custom curve for level 4', () => {
      const result = getFrontWeightCurve(4);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(
        frontWeightData[FrontWeightLevel.Level5].length,
      );

      result.forEach((value, index) => {
        expect(value).toBeLessThan(
          frontWeightData[FrontWeightLevel.Level5][index]!,
        );
      });
    });

    it('should generate custom curve for level 10', () => {
      const result = getFrontWeightCurve(10);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(
        frontWeightData[FrontWeightLevel.Level5].length,
      );

      result.forEach((value, index) => {
        expect(value).toBeGreaterThan(
          frontWeightData[FrontWeightLevel.Level9][index]!,
        );
      });
    });
  });

  it('should generate custom curve for level 0', () => {
    const result = getFrontWeightCurve(0);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(
      frontWeightData[FrontWeightLevel.Level5].length,
    );
  });

  it('should generate custom curve for decimal level 5.5', () => {
    const result = getFrontWeightCurve(5.5);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(
      frontWeightData[FrontWeightLevel.Level5].length,
    );
  });
});

describe('data structure validation', () => {
  it('should return an array of numbers', () => {
    const result = getFrontWeightCurve(5);
    expect(Array.isArray(result)).toBe(true);
    result.forEach((value) => {
      expect(typeof value).toBe('number');
      expect(Number.isFinite(value)).toBe(true);
    });
  });

  it('should return array with correct length', () => {
    const result = getFrontWeightCurve(5);
    expect(result).toHaveLength(
      frontWeightData[FrontWeightLevel.Level5].length,
    );
  });
});
