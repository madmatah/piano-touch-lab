import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'bun:test';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';
import { KeyboardProvider } from '@/contexts/keyboard-context';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

describe('The useKeyTabIndex hook', () => {
  type KeyProperty =
    | 'downWeightWithoutSpringSupport'
    | 'upWeight'
    | 'frontWeight'
    | 'strikeWeight';

  const fakeTabGroups: KeyProperty[][] = [
    ['downWeightWithoutSpringSupport', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeyboardProvider>{children}</KeyboardProvider>
  );

  describe('The orderedProperties property', () => {
    let orderedProperties: (keyof MeasuredKeyRequirements)[];
    const fakeKeyIndex = 0;

    beforeEach(() => {
      const { result } = renderHook(
        () => useKeyTabIndex<KeyProperty>(fakeKeyIndex, fakeTabGroups),
        { wrapper },
      );
      orderedProperties = result.current.orderedProperties;
    });

    it('should return the expected orderedProperties', () => {
      expect(orderedProperties).toEqual([
        'downWeightWithoutSpringSupport',
        'upWeight',
        'frontWeight',
        'strikeWeight',
      ]);
    });
  });

  describe('The getTabIndexFor property', () => {
    let getTabIndexFor: ReturnType<
      typeof useKeyTabIndex<KeyProperty>
    >['getTabIndexFor'];

    describe('with provided tab groups', () => {
      describe.each([
        {
          expectedValues: {
            downWeightWithoutSpringSupport: 1,
            frontWeight: 90,
            strikeWeight: 178,
            upWeight: 2,
          },
          keyIndex: 0,
        },
        {
          expectedValues: {
            downWeightWithoutSpringSupport: 2,
            frontWeight: 91,
            strikeWeight: 179,
            upWeight: 3,
          },
          keyIndex: 1,
        },
        {
          expectedValues: {
            downWeightWithoutSpringSupport: 3,
            frontWeight: 92,
            strikeWeight: 180,
            upWeight: 4,
          },
          keyIndex: 2,
        },
        {
          expectedValues: {
            downWeightWithoutSpringSupport: 87,
            frontWeight: 176,
            strikeWeight: 264,
            upWeight: 88,
          },
          keyIndex: 86,
        },
        {
          expectedValues: {
            downWeightWithoutSpringSupport: 88,
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
          expect(getTabIndexFor('downWeightWithoutSpringSupport')).toBe(
            expectedValues.downWeightWithoutSpringSupport,
          );
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
