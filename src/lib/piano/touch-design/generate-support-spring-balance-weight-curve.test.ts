import { describe, it, expect, beforeEach } from 'bun:test';
import { generateSupportSpringBalanceWeightCurve } from './generate-support-spring-balance-weight-curve';

describe('The generateSupportSpringBalanceWeightCurve() function', () => {
  let numberOfSprings: number;
  let baseTension: number;
  let tensionDropIndex: number;
  let result: number[];

  describe('When parameters are valid', () => {
    describe('When tensionDropIndex is 1', () => {
      beforeEach(() => {
        numberOfSprings = 5;
        baseTension = 10;
        tensionDropIndex = 1;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should return a curve with decreasing values from baseTension to 0', () => {
        expect(result).toHaveLength(5);
        expect(result[0]).toBeCloseTo(10);
        expect(result[1]).toBeCloseTo(8);
        expect(result[2]).toBeCloseTo(6);
        expect(result[3]).toBeCloseTo(4);
        expect(result[4]).toBeCloseTo(2);
      });
    });

    describe('When tensionDropIndex is in the middle', () => {
      beforeEach(() => {
        numberOfSprings = 6;
        baseTension = 12;
        tensionDropIndex = 3;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should return constant values before drop index and decreasing values after', () => {
        expect(result).toEqual([12, 12, 12, 9, 6, 3]);
      });
    });

    describe('When tensionDropIndex equals numberOfSprings', () => {
      beforeEach(() => {
        numberOfSprings = 4;
        baseTension = 8;
        tensionDropIndex = 4;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should return all constant values', () => {
        expect(result).toEqual([8, 8, 8, 8]);
      });
    });

    describe('When baseTension is 0', () => {
      beforeEach(() => {
        numberOfSprings = 3;
        baseTension = 0;
        tensionDropIndex = 1;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should return all zeros', () => {
        expect(result).toEqual([0, 0, 0]);
      });
    });

    describe('When tensionDropIndex is 0', () => {
      beforeEach(() => {
        numberOfSprings = 4;
        baseTension = 10;
        tensionDropIndex = 0;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should treat tensionDropIndex as 1 and return decreasing values', () => {
        expect(result).toEqual([10, 7.5, 5, 2.5]);
      });
    });

    describe('When tensionDropIndex exceeds numberOfSprings', () => {
      beforeEach(() => {
        numberOfSprings = 3;
        baseTension = 10;
        tensionDropIndex = 5;
        result = generateSupportSpringBalanceWeightCurve({
          baseTension,
          numberOfSprings,
          tensionDropIndex,
        });
      });

      it('should return all constant values', () => {
        expect(result).toEqual([10, 10, 10]);
      });
    });
  });

  describe('When parameters are invalid', () => {
    describe('When numberOfSprings is 0', () => {
      beforeEach(() => {
        result = generateSupportSpringBalanceWeightCurve({
          baseTension: 10,
          numberOfSprings: 0,
          tensionDropIndex: 1,
        });
      });

      it('should return an empty array', () => {
        expect(result).toEqual([]);
      });
    });

    describe('When numberOfSprings is negative', () => {
      beforeEach(() => {
        result = generateSupportSpringBalanceWeightCurve({
          baseTension: 10,
          numberOfSprings: -1,
          tensionDropIndex: 1,
        });
      });

      it('should return an empty array', () => {
        expect(result).toEqual([]);
      });
    });
  });
});
