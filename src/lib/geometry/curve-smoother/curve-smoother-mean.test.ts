import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { CurveSmootherMean } from './curve-smoother-mean';
import type { DataPointsExtractorRequirements } from './data-points-extractor/data-points-extractor-requirements';

describe('The CurveSmootherMean class', () => {
  let curveSmoother: CurveSmootherMean;
  let mockDataPointsExtractor: DataPointsExtractorRequirements;
  let extractDataPointsMock: ReturnType<typeof mock>;

  beforeEach(() => {
    extractDataPointsMock = mock(() => ({
      x: [] as number[],
      y: [] as number[],
    }));
    mockDataPointsExtractor = {
      extractDataPoints: extractDataPointsMock,
    };
    curveSmoother = new CurveSmootherMean(mockDataPointsExtractor);
  });

  describe('The smoothCurve() method', () => {
    let inputData: (number | undefined)[];
    let result: number[];

    describe('When no valid data points exist', () => {
      beforeEach(() => {
        inputData = [undefined, undefined, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [],
          y: [],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return array of NaN', () => {
        expect(result).toEqual([NaN, NaN, NaN]);
      });

      it('should call extractDataPoints with input data', () => {
        expect(extractDataPointsMock).toHaveBeenCalledWith(inputData);
      });
    });

    describe('When valid data points exist', () => {
      beforeEach(() => {
        inputData = [1, 2, 3, undefined, 5];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2, 4],
          y: [1, 2, 3, 5],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return mean value for all positions', () => {
        expect(result).toEqual([2.75, 2.75, 2.75, 2.75, 2.75]);
      });

      it('should call extractDataPoints with input data', () => {
        expect(extractDataPointsMock).toHaveBeenCalledWith(inputData);
      });
    });

    describe('When there is a single data point', () => {
      beforeEach(() => {
        inputData = [undefined, 42, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [1],
          y: [42],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return the single value for all positions', () => {
        expect(result).toEqual([42, 42, 42]);
      });
    });

    describe('When there are two data points', () => {
      beforeEach(() => {
        inputData = [10, 20, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1],
          y: [10, 20],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return the average of the two values', () => {
        expect(result).toEqual([15, 15, 15]);
      });
    });

    describe('When there are three data points', () => {
      beforeEach(() => {
        inputData = [10, 20, 30, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [10, 20, 30],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return the mean of the three values', () => {
        expect(result).toEqual([20, 20, 20, 20]);
      });
    });

    describe('When data contains negative numbers', () => {
      beforeEach(() => {
        inputData = [-5, -1, -3, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [-5, -1, -3],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should calculate mean correctly', () => {
        expect(result).toEqual([-3, -3, -3, -3]);
      });
    });

    describe('When data contains decimal numbers', () => {
      beforeEach(() => {
        inputData = [1.5, 2.7, 3.1, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [1.5, 2.7, 3.1],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should calculate mean correctly', () => {
        const expectedMean = (1.5 + 2.7 + 3.1) / 3;
        expect(result[0]).toBeCloseTo(expectedMean, 10);
        expect(result[1]).toBeCloseTo(expectedMean, 10);
        expect(result[2]).toBeCloseTo(expectedMean, 10);
        expect(result[3]).toBeCloseTo(expectedMean, 10);
      });
    });

    describe('When data contains duplicate values', () => {
      beforeEach(() => {
        inputData = [5, 5, 5, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [5, 5, 5],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return the duplicate value for all positions', () => {
        expect(result).toEqual([5, 5, 5, 5]);
      });
    });

    describe('When data points are unsorted', () => {
      beforeEach(() => {
        inputData = [30, 10, 20, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [30, 10, 20],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should calculate mean correctly regardless of order', () => {
        expect(result).toEqual([20, 20, 20, 20]);
      });
    });

    describe('When handling large dataset', () => {
      beforeEach(() => {
        inputData = Array.from({ length: 100 }, (_, i) =>
          i % 2 === 0 ? i : undefined,
        );
        const validValues = inputData.filter(
          (val): val is number => val !== undefined,
        );
        extractDataPointsMock.mockReturnValue({
          x: Array.from({ length: 50 }, (_, i) => i * 2),
          y: validValues,
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should return array with correct length', () => {
        expect(result).toHaveLength(100);
      });

      it('should return mean value for all positions', () => {
        expect(result.every((val) => val === 49)).toBe(true);
      });
    });

    describe('When data contains zero values', () => {
      beforeEach(() => {
        inputData = [0, 10, 0, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [0, 10, 0],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should calculate mean correctly including zeros', () => {
        const expectedMean = (0 + 10 + 0) / 3;
        expect(result[0]).toBeCloseTo(expectedMean, 10);
        expect(result[1]).toBeCloseTo(expectedMean, 10);
        expect(result[2]).toBeCloseTo(expectedMean, 10);
        expect(result[3]).toBeCloseTo(expectedMean, 10);
      });
    });

    describe('When data contains very small numbers', () => {
      beforeEach(() => {
        inputData = [0.001, 0.002, 0.003, undefined];
        extractDataPointsMock.mockReturnValue({
          x: [0, 1, 2],
          y: [0.001, 0.002, 0.003],
        });
        result = curveSmoother.smoothCurve(inputData);
      });

      it('should calculate mean correctly with precision', () => {
        expect(result).toEqual([0.002, 0.002, 0.002, 0.002]);
      });
    });
  });
});
