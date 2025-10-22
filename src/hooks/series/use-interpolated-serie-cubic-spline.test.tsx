import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'bun:test';
import { useInterpolatedSerieCubicSpline } from './use-interpolated-serie-cubic-spline';

import { Provider } from 'inversify-react';
import { Container } from 'inversify';
import React from 'react';
import { Keyboard } from '@/lib/piano/keyboard';
import { KeyColor } from '@/lib/piano/keyboard';
import type { KeyWith } from '@/lib/piano/keyboard';
import { smootherContainerModule } from '@/container-modules/smoother-container-module';

describe('The useInterpolatedSerieCubicSpline hook', () => {
  interface TestPayload {
    value: number;
  }

  const fakeKeys: KeyWith<TestPayload>[] = Array.from(
    { length: 88 },
    (_, index) => ({
      color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
      name: `Key${index + 1}`,
      number: index + 1,
      octave: Math.floor(index / 12) + 1,
      payload: { value: 0 },
    }),
  );

  const fakeKeyboard = new Keyboard(fakeKeys);

  const renderHookWithContainer = <T,>(keyboard: Keyboard<KeyWith<T>>) => {
    const testContainer = new Container();
    void testContainer.load(smootherContainerModule);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider container={testContainer}>{children}</Provider>
    );

    return renderHook(() => useInterpolatedSerieCubicSpline(keyboard), {
      wrapper,
    });
  };

  describe('The generateCubicInterpolatedKeyboardSerie function', () => {
    let generateCubicInterpolatedKeyboardSerie: ReturnType<
      typeof useInterpolatedSerieCubicSpline<TestPayload>
    >['generateCubicInterpolatedKeyboardSerie'];

    describe('When called with a valid keypoints map', () => {
      let result: number[];
      const fakeKeypoints = new Map([
        [1, 50],
        [22, 55],
        [44, 60],
        [66, 65],
        [88, 70],
      ]);

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(fakeKeyboard);
        generateCubicInterpolatedKeyboardSerie =
          hookResult.current.generateCubicInterpolatedKeyboardSerie;
        result = generateCubicInterpolatedKeyboardSerie(fakeKeypoints);
      });

      it('should return an array with 88 elements', () => {
        expect(result).toHaveLength(88);
      });

      it('should return numeric values for all keys', () => {
        result.forEach((value) => {
          expect(typeof value).toBe('number');
        });
      });

      it('should interpolate values at keypoint positions', () => {
        expect(result[0]).toBe(50);
        expect(result[21]).toBe(55);
        expect(result[43]).toBe(60);
        expect(result[65]).toBe(65);
        expect(result[87]).toBe(70);
      });
    });

    describe('When called with sparse keypoints', () => {
      let result: number[];
      const sparseKeypoints = new Map([
        [1, 40],
        [88, 80],
      ]);

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(fakeKeyboard);
        generateCubicInterpolatedKeyboardSerie =
          hookResult.current.generateCubicInterpolatedKeyboardSerie;
        result = generateCubicInterpolatedKeyboardSerie(sparseKeypoints);
      });

      it('should return an array with 88 elements', () => {
        expect(result).toHaveLength(88);
      });

      it('should interpolate between the sparse points', () => {
        expect(result[0]).toBe(40);
        expect(result[87]).toBe(80);
        expect(result[43]).toBeGreaterThan(40);
        expect(result[43]).toBeLessThan(80);
      });
    });

    describe('When called with an empty keypoints map', () => {
      let act: () => unknown;
      const emptyKeypoints = new Map<number, number>();

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(fakeKeyboard);
        generateCubicInterpolatedKeyboardSerie =
          hookResult.current.generateCubicInterpolatedKeyboardSerie;
        act = () => generateCubicInterpolatedKeyboardSerie(emptyKeypoints);
      });

      it('should throw an error', () => {
        expect(act).toThrowError();
      });
    });
  });

  describe('The interpolateStandardKeypointsToKeyboardSize function', () => {
    let interpolateStandardKeypointsToKeyboardSize: ReturnType<
      typeof useInterpolatedSerieCubicSpline<TestPayload>
    >['interpolateStandardKeypointsToKeyboardSize'];

    const standardKeypoints = new Map([
      [1, 50],
      [22, 55],
      [44, 60],
      [66, 65],
      [88, 70],
    ]);

    describe('When keyboard has 88 keys (standard)', () => {
      let result: Map<number, number>;

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(fakeKeyboard);
        interpolateStandardKeypointsToKeyboardSize =
          hookResult.current.interpolateStandardKeypointsToKeyboardSize;
        result = interpolateStandardKeypointsToKeyboardSize(standardKeypoints);
      });

      it('should return identity transformation', () => {
        expect(result.size).toBe(5);
        expect(result.get(1)).toBe(50);
        expect(result.get(22)).toBe(55);
        expect(result.get(44)).toBe(60);
        expect(result.get(66)).toBe(65);
        expect(result.get(88)).toBe(70);
      });
    });

    describe('When keyboard has 100 keys', () => {
      let result: Map<number, number>;
      const hundredKeyKeys: KeyWith<TestPayload>[] = Array.from(
        { length: 100 },
        (_, index) => ({
          color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
          name: `Key${index + 1}`,
          number: index + 1,
          octave: Math.floor(index / 12) + 1,
          payload: { value: 0 },
        }),
      );
      const hundredKeyKeyboard = new Keyboard(hundredKeyKeys);

      beforeEach(() => {
        const { result: hookResult } =
          renderHookWithContainer(hundredKeyKeyboard);
        interpolateStandardKeypointsToKeyboardSize =
          hookResult.current.interpolateStandardKeypointsToKeyboardSize;
        result = interpolateStandardKeypointsToKeyboardSize(standardKeypoints);
      });

      it('should map first key to 1', () => {
        expect(result.get(1)).toBe(50);
      });

      it('should map middle key to 50', () => {
        expect(result.get(50)).toBe(60);
      });

      it('should map last key to 100', () => {
        expect(result.get(100)).toBe(70);
      });

      it('should have correct number of keypoints', () => {
        expect(result.size).toBe(5);
      });
    });

    describe('When keyboard has 85 keys', () => {
      let result: Map<number, number>;
      const eightyFiveKeyKeys: KeyWith<TestPayload>[] = Array.from(
        { length: 85 },
        (_, index) => ({
          color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
          name: `Key${index + 1}`,
          number: index + 1,
          octave: Math.floor(index / 12) + 1,
          payload: { value: 0 },
        }),
      );
      const eightyFiveKeyKeyboard = new Keyboard(eightyFiveKeyKeys);

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(
          eightyFiveKeyKeyboard,
        );
        interpolateStandardKeypointsToKeyboardSize =
          hookResult.current.interpolateStandardKeypointsToKeyboardSize;
        result = interpolateStandardKeypointsToKeyboardSize(standardKeypoints);
      });

      it('should map first key to 1', () => {
        expect(result.get(1)).toBe(50);
      });

      it('should map last key to 85', () => {
        expect(result.get(85)).toBe(70);
      });

      it('should have correct number of keypoints', () => {
        expect(result.size).toBe(5);
      });
    });

    describe('When keyboard has 109 keys', () => {
      let result: Map<number, number>;
      const hundredNineKeyKeys: KeyWith<TestPayload>[] = Array.from(
        { length: 109 },
        (_, index) => ({
          color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
          name: `Key${index + 1}`,
          number: index + 1,
          octave: Math.floor(index / 12) + 1,
          payload: { value: 0 },
        }),
      );
      const hundredNineKeyKeyboard = new Keyboard(hundredNineKeyKeys);

      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(
          hundredNineKeyKeyboard,
        );
        interpolateStandardKeypointsToKeyboardSize =
          hookResult.current.interpolateStandardKeypointsToKeyboardSize;
        result = interpolateStandardKeypointsToKeyboardSize(standardKeypoints);
      });

      it('should map first key to 1', () => {
        expect(result.get(1)).toBe(50);
      });

      it('should map last key to 109', () => {
        expect(result.get(109)).toBe(70);
      });

      it('should have correct number of keypoints', () => {
        expect(result.size).toBe(5);
      });
    });

    describe('When called with edge cases', () => {
      beforeEach(() => {
        const { result: hookResult } = renderHookWithContainer(fakeKeyboard);
        interpolateStandardKeypointsToKeyboardSize =
          hookResult.current.interpolateStandardKeypointsToKeyboardSize;
      });

      describe('When called with empty keypoints', () => {
        let result: Map<number, number>;

        beforeEach(() => {
          result = interpolateStandardKeypointsToKeyboardSize(new Map());
        });

        it('should return empty map', () => {
          expect(result.size).toBe(0);
        });
      });

      describe('When called with single keypoint', () => {
        let result: Map<number, number>;
        const singleKeypoint = new Map([[44, 60]]);

        beforeEach(() => {
          result = interpolateStandardKeypointsToKeyboardSize(singleKeypoint);
        });

        it('should return single keypoint', () => {
          expect(result.size).toBe(1);
          expect(result.get(44)).toBe(60);
        });
      });
    });

    describe('When validating boundary conditions', () => {
      const boundaryKeypoints = new Map([
        [1, 10],
        [88, 20],
      ]);

      it('should always map first key to 1 for any keyboard size', () => {
        const keyboardSizes = [85, 88, 100, 109];

        keyboardSizes.forEach((size) => {
          const testKeys: KeyWith<TestPayload>[] = Array.from(
            { length: size },
            (_, index) => ({
              color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
              name: `Key${index + 1}`,
              number: index + 1,
              octave: Math.floor(index / 12) + 1,
              payload: { value: 0 },
            }),
          );
          const testKeyboard = new Keyboard(testKeys);
          const { result: hookResult } = renderHookWithContainer(testKeyboard);
          const interpolateFunction =
            hookResult.current.interpolateStandardKeypointsToKeyboardSize;
          const result = interpolateFunction(boundaryKeypoints);

          expect(result.get(1)).toBe(10);
        });
      });

      it('should always map last key to keyboard size', () => {
        const keyboardSizes = [85, 88, 100, 109];

        keyboardSizes.forEach((size) => {
          const testKeys: KeyWith<TestPayload>[] = Array.from(
            { length: size },
            (_, index) => ({
              color: index % 2 === 0 ? KeyColor.White : KeyColor.Black,
              name: `Key${index + 1}`,
              number: index + 1,
              octave: Math.floor(index / 12) + 1,
              payload: { value: 0 },
            }),
          );
          const testKeyboard = new Keyboard(testKeys);
          const { result: hookResult } = renderHookWithContainer(testKeyboard);
          const interpolateFunction =
            hookResult.current.interpolateStandardKeypointsToKeyboardSize;
          const result = interpolateFunction(boundaryKeypoints);

          expect(result.get(size)).toBe(20);
        });
      });
    });
  });

  describe('The hook memoization', () => {
    it('should return different function references when keyboard changes', () => {
      const firstHook = renderHookWithContainer(fakeKeyboard);
      const firstGenerateCubicInterpolated =
        firstHook.result.current.generateCubicInterpolatedKeyboardSerie;

      const newKeyboard = new Keyboard(fakeKeys.slice(0, 44));
      const secondHook = renderHookWithContainer(newKeyboard);
      const secondGenerateCubicInterpolated =
        secondHook.result.current.generateCubicInterpolatedKeyboardSerie;

      expect(secondGenerateCubicInterpolated).not.toBe(
        firstGenerateCubicInterpolated,
      );
    });

    it('should return stable function references when keyboard is unchanged', () => {
      const { result, rerender } = renderHookWithContainer(fakeKeyboard);
      const firstGenerateCubicInterpolated =
        result.current.generateCubicInterpolatedKeyboardSerie;

      rerender();

      expect(result.current.generateCubicInterpolatedKeyboardSerie).toBe(
        firstGenerateCubicInterpolated,
      );
    });
  });
});
