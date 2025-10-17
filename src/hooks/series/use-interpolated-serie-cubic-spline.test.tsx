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
