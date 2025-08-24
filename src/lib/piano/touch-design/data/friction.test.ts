import { describe, it, expect, beforeEach } from 'bun:test';
import {
  getKeyFrictionThresholds,
  getKeyboardFrictionThresholds,
  type KeyFrictionThresholds,
} from './friction';
import { KeyboardFactory } from '@/lib/piano/keyboard/keyboard-factory';
import { Standard88Layout } from '@/lib/piano/keyboard';

describe('Friction functions', () => {
  const fakeKeyboard = KeyboardFactory.fromLayout(Standard88Layout);

  describe('The getKeyFrictionThresholds() function', () => {
    describe.each([
      {
        expectedValues: {
          highZone: { higher: 21, lower: 17 },
          lowZone: { higher: 13, lower: 9 },
          mediumZone: { higher: 17, lower: 13 },
        },
        key: 1,
        precision: 10,
      },
      {
        expectedValues: {
          highZone: { higher: 18.7, lower: 14.7 },
          lowZone: { higher: 10.7, lower: 6.7 },
          mediumZone: { higher: 14.7, lower: 10.7 },
        },
        key: 51,
        precision: 2,
      },
      {
        expectedValues: {
          highZone: { higher: 17, lower: 13 },
          lowZone: { higher: 9, lower: 5 },
          mediumZone: { higher: 13, lower: 9 },
        },
        key: 88,
        precision: 10,
      },
    ])('when called with key #$key', ({ key, precision, expectedValues }) => {
      let result: KeyFrictionThresholds;

      const expectedZoneLength = 4;

      beforeEach(() => {
        result = getKeyFrictionThresholds(key, fakeKeyboard.size);
      });

      it('should return correct friction thresholds', () => {
        expect(result.lowZone.higher).toBeCloseTo(
          expectedValues.lowZone.higher,
          precision,
        );
        expect(result.lowZone.lower).toBeCloseTo(
          expectedValues.lowZone.lower,
          precision,
        );
        expect(result.mediumZone.higher).toBeCloseTo(
          expectedValues.mediumZone.higher,
          precision,
        );
        expect(result.mediumZone.lower).toBeCloseTo(
          expectedValues.mediumZone.lower,
          precision,
        );
        expect(result.highZone.higher).toBeCloseTo(
          expectedValues.highZone.higher,
          precision,
        );
        expect(result.highZone.lower).toBeCloseTo(
          expectedValues.highZone.lower,
          precision,
        );
      });

      it('should return consistent thresholds for each key', () => {
        expect(result.highZone.higher - result.highZone.lower).toBeCloseTo(
          expectedZoneLength,
          10,
        );
        expect(result.mediumZone.higher - result.mediumZone.lower).toBeCloseTo(
          expectedZoneLength,
          10,
        );
        expect(result.lowZone.higher - result.lowZone.lower).toBeCloseTo(
          expectedZoneLength,
          10,
        );
      });
    });
  });

  describe('The getKeyboardFrictionThresholds() function', () => {
    it('should return array with correct length', () => {
      const result = getKeyboardFrictionThresholds(fakeKeyboard);

      expect(result).toHaveLength(fakeKeyboard.size);
    });

    it('should call getKeyFrictionThresholds() for each key', () => {
      const result = getKeyboardFrictionThresholds(fakeKeyboard);

      for (let i = 0; i < result.length; i++) {
        const keyNumber = i + 1;
        const expectedThresholds = getKeyFrictionThresholds(
          keyNumber,
          fakeKeyboard.size,
        );

        expect(result[i]).toEqual(expectedThresholds);
      }
    });
  });
});
