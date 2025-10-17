import { describe, it, expect, beforeEach } from 'bun:test';
import { generateCustomFrontWeightKeypoints } from './generate-custom-front-weight-keypoints';
import { frontWeightOriginalData } from './data/front-weights';
import { FrontWeightLevel } from './front-weight-level';

describe('The generateCustomFrontWeightKeypoints() function', () => {
  let level: number;
  let result: Map<number, number>;

  const expectedIndexes = [0, 21, 43, 65, 87];
  const keypointPositions = [1, 22, 44, 66, 88];

  const testCases = [
    { frontWeightLevel: FrontWeightLevel.Level5, level: 5 },
    { frontWeightLevel: FrontWeightLevel.Level6, level: 6 },
    { frontWeightLevel: FrontWeightLevel.Level7, level: 7 },
    { frontWeightLevel: FrontWeightLevel.Level8, level: 8 },
    { frontWeightLevel: FrontWeightLevel.Level9, level: 9 },
  ];

  testCases.forEach(({ level: testLevel, frontWeightLevel }) => {
    describe(`When level is ${testLevel}`, () => {
      beforeEach(() => {
        level = testLevel;
        result = generateCustomFrontWeightKeypoints(level);
      });

      it('should generate correct number of keypoints', () => {
        expect(result.size).toBe(5);
      });

      it('should have correct key positions', () => {
        const actualPositions = Array.from(result.keys()).sort((a, b) => a - b);
        expect(actualPositions).toEqual(keypointPositions);
      });

      it('should match reference data at expected indexes', () => {
        const referenceData = frontWeightOriginalData[frontWeightLevel];

        expectedIndexes.forEach((index, i) => {
          const expectedValue = referenceData[index]!;
          const keypointPosition = keypointPositions[i]!;
          const actualValue = result.get(keypointPosition);

          expect(actualValue).toBeDefined();
          const actual: number = actualValue!;
          expect(actual).toBeCloseTo(expectedValue, 0);
        });
      });

      it('should generate values within expected range', () => {
        const referenceData = frontWeightOriginalData[frontWeightLevel];
        const minValue = Math.min(...referenceData);
        const maxValue = Math.max(...referenceData);

        result.forEach((value) => {
          expect(value).toBeGreaterThanOrEqual(minValue - 5);
          expect(value).toBeLessThanOrEqual(maxValue + 5);
        });
      });
    });
  });

  describe('When level is 0', () => {
    beforeEach(() => {
      level = 0;
      result = generateCustomFrontWeightKeypoints(level);
    });

    it('should generate correct number of keypoints', () => {
      expect(result.size).toBe(5);
    });

    it('should generate valid numeric values', () => {
      const values = Array.from(result.values());
      values.forEach((value) => {
        expect(typeof value).toBe('number');
        expect(isFinite(value)).toBe(true);
      });
    });
  });

  describe('When level is negative', () => {
    beforeEach(() => {
      level = -1;
      result = generateCustomFrontWeightKeypoints(level);
    });

    it('should generate correct number of keypoints', () => {
      expect(result.size).toBe(5);
    });

    it('should generate valid numeric values', () => {
      const values = Array.from(result.values());
      values.forEach((value) => {
        expect(typeof value).toBe('number');
        expect(isFinite(value)).toBe(true);
      });
    });
  });

  describe('When level is high', () => {
    beforeEach(() => {
      level = 15;
      result = generateCustomFrontWeightKeypoints(level);
    });

    it('should generate correct number of keypoints', () => {
      expect(result.size).toBe(5);
    });

    it('should generate valid numeric values', () => {
      const values = Array.from(result.values());
      values.forEach((value) => {
        expect(typeof value).toBe('number');
        expect(isFinite(value)).toBe(true);
      });
    });
  });

  describe('When checking mathematical consistency', () => {
    beforeEach(() => {
      level = 5;
      result = generateCustomFrontWeightKeypoints(level);
    });

    it('should have decreasing values from first to last keypoint', () => {
      const positions = Array.from(result.keys()).sort((a, b) => a - b);

      for (let i = 1; i < positions.length; i++) {
        const current = result.get(positions[i]!);
        const previous = result.get(positions[i - 1]!);
        if (current !== undefined && previous !== undefined) {
          expect(current).toBeLessThan(previous);
        }
      }
    });

    it('should maintain consistent slope pattern across levels', () => {
      const levels = [5, 6, 7, 8, 9];
      const slopes: number[] = [];

      levels.forEach((level) => {
        const keypoints = generateCustomFrontWeightKeypoints(level);
        const values = Array.from(keypoints.values()).sort((a, b) => a - b);

        const slope =
          (values[0]! - values[values.length - 1]!) /
          (keypointPositions[keypointPositions.length - 1]! -
            keypointPositions[0]!);
        slopes.push(slope);
      });

      slopes.forEach((slope, index) => {
        if (index > 0) {
          expect(Math.abs(slope - slopes[0]!)).toBeLessThan(0.1);
        }
      });
    });
  });
});
