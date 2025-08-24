import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'bun:test';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';
import { KeyboardProvider } from '@/contexts/keyboard-context';
import type { KeyMeasureRequirements } from '@/lib/piano/touch-design/measure-requirements';

describe('The useKeyTabIndex hook', () => {
  const fakeTabGroups: Array<Array<keyof KeyMeasureRequirements>> = [
    ['downWeight', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeyboardProvider>{children}</KeyboardProvider>
  );

  describe('The orderedProperties property', () => {
    let orderedProperties: Array<keyof KeyMeasureRequirements>;
    const fakeKeyIndex = 0;

    beforeEach(() => {
      const { result } = renderHook(
        () => useKeyTabIndex(fakeKeyIndex, fakeTabGroups),
        { wrapper },
      );
      orderedProperties = result.current.orderedProperties;
    });

    it('should return the expected orderedProperties', () => {
      expect(orderedProperties).toEqual([
        'downWeight',
        'upWeight',
        'frontWeight',
        'strikeWeight',
      ]);
    });
  });

  describe('The getTabIndexFor property', () => {
    let getTabIndexFor: ReturnType<typeof useKeyTabIndex>['getTabIndexFor'];

    describe('with provided tab groups', () => {
      describe.each([
        {
          expectedValues: {
            downWeight: 1,
            frontWeight: 90,
            strikeWeight: 178,
            upWeight: 2,
          },
          keyIndex: 0,
        },
        {
          expectedValues: {
            downWeight: 2,
            frontWeight: 91,
            strikeWeight: 179,
            upWeight: 3,
          },
          keyIndex: 1,
        },
        {
          expectedValues: {
            downWeight: 3,
            frontWeight: 92,
            strikeWeight: 180,
            upWeight: 4,
          },
          keyIndex: 2,
        },
        {
          expectedValues: {
            downWeight: 87,
            frontWeight: 176,
            strikeWeight: 264,
            upWeight: 88,
          },
          keyIndex: 86,
        },
        {
          expectedValues: {
            downWeight: 88,
            frontWeight: 177,
            strikeWeight: 265,
            upWeight: 89,
          },
          keyIndex: 87,
        },
      ])('keyIndex = $keyIndex', ({ keyIndex, expectedValues }) => {
        beforeEach(() => {
          const { result } = renderHook(
            () => useKeyTabIndex(keyIndex, fakeTabGroups),
            { wrapper },
          );
          getTabIndexFor = result.current.getTabIndexFor;
        });

        it('should compute tabIndex for provided groups', () => {
          expect(getTabIndexFor('downWeight')).toBe(expectedValues.downWeight);
          expect(getTabIndexFor('upWeight')).toBe(expectedValues.upWeight);
          expect(getTabIndexFor('frontWeight')).toBe(
            expectedValues.frontWeight,
          );
          expect(getTabIndexFor('strikeWeight')).toBe(
            expectedValues.strikeWeight,
          );
        });
      });

      describe('when a property is not present in any group', () => {
        beforeEach(() => {
          const { result } = renderHook(
            () => useKeyTabIndex(0, [['downWeight']]),
            { wrapper },
          );
          getTabIndexFor = result.current.getTabIndexFor;
        });

        it('should return undefined for that property', () => {
          expect(getTabIndexFor('strikeWeight')).toBeUndefined();
        });
      });
    });
  });
});
