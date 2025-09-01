import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'bun:test';
import { useGenerateSerie } from './use-generate-serie';
import { Keyboard } from '@/lib/piano/keyboard';
import { TouchDesignSerieVariant } from '../TouchDesignChart';
import { KeyColor } from '@/lib/piano/keyboard';
import type { KeyWith } from '@/lib/piano/keyboard';
import type { EchartsDataItemStyle, TouchDesignSerie } from '../interfaces';

describe('The useGenerateSerie hook', () => {
  type TestPayload = { weight: number };

  const fakeKeys: Array<KeyWith<TestPayload>> = [
    {
      color: KeyColor.White,
      name: 'C1',
      number: 1,
      octave: 1,
      payload: { weight: 10 },
    },
    {
      color: KeyColor.Black,
      name: 'C#1',
      number: 2,
      octave: 1,
      payload: { weight: 15 },
    },
    {
      color: KeyColor.White,
      name: 'D1',
      number: 3,
      octave: 1,
      payload: { weight: 12 },
    },
  ];

  const fakeKeyboard = new Keyboard(fakeKeys);
  const fakeValueSelector = (key: KeyWith<TestPayload>) => key.payload.weight;
  const fakeName = 'Test Serie';
  const fakeVariant = TouchDesignSerieVariant.Measured;

  describe('The generateSerie function', () => {
    let result: TouchDesignSerie;
    let generateSerie: ReturnType<
      typeof useGenerateSerie<TestPayload>
    >['generateSerie'];

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        useGenerateSerie(fakeKeyboard),
      );
      generateSerie = hookResult.current.generateSerie;
    });

    describe('When called with basic parameters', () => {
      beforeEach(() => {
        result = generateSerie(fakeValueSelector, fakeName, fakeVariant);
      });

      it('should return a serie with the expected structure', () => {
        expect(result).toEqual({
          data: [
            {
              color: KeyColor.White,
              name: 'C1',
              number: 1,
              octave: 1,
              payload: 10,
            },
            {
              color: KeyColor.Black,
              name: 'C#1',
              number: 2,
              octave: 1,
              payload: 15,
            },
            {
              color: KeyColor.White,
              name: 'D1',
              number: 3,
              octave: 1,
              payload: 12,
            },
          ],
          flatItemStyle: undefined,
          name: fakeName,
          sharpItemStyle: undefined,
          variant: fakeVariant,
        });
      });

      it('should map keyboard keys using the value selector', () => {
        expect(result.data).toHaveLength(3);
        expect(result.data[0]?.payload).toBe(10);
        expect(result.data[1]?.payload).toBe(15);
        expect(result.data[2]?.payload).toBe(12);
      });

      it('should preserve key properties', () => {
        expect(result.data[0]?.number).toBe(1);
        expect(result.data[0]?.color).toBe(KeyColor.White);
        expect(result.data[0]?.name).toBe('C1');
        expect(result.data[0]?.octave).toBe(1);
      });
    });

    describe('When called with custom item styles', () => {
      const fakeFlatItemStyle: EchartsDataItemStyle = { color: '#ffffff' };
      const fakeSharpItemStyle: EchartsDataItemStyle = { color: '#000000' };

      beforeEach(() => {
        result = generateSerie(fakeValueSelector, fakeName, fakeVariant, {
          flatItemStyle: fakeFlatItemStyle,
          sharpItemStyle: fakeSharpItemStyle,
        });
      });

      it('should include the custom item styles', () => {
        expect(result.flatItemStyle).toBe(fakeFlatItemStyle);
        expect(result.sharpItemStyle).toBe(fakeSharpItemStyle);
      });
    });

    describe('When called with only flat item style', () => {
      const fakeFlatItemStyle: EchartsDataItemStyle = { color: '#ffffff' };

      beforeEach(() => {
        result = generateSerie(fakeValueSelector, fakeName, fakeVariant, {
          flatItemStyle: fakeFlatItemStyle,
        });
      });

      it('should include only the flat item style', () => {
        expect(result.flatItemStyle).toBe(fakeFlatItemStyle);
        expect(result.sharpItemStyle).toBeUndefined();
      });
    });

    describe('When called with only sharp item style', () => {
      const fakeSharpItemStyle: EchartsDataItemStyle = { color: '#000000' };

      beforeEach(() => {
        result = generateSerie(fakeValueSelector, fakeName, fakeVariant, {
          sharpItemStyle: fakeSharpItemStyle,
        });
      });

      it('should include only the sharp item style', () => {
        expect(result.flatItemStyle).toBeUndefined();
        expect(result.sharpItemStyle).toBe(fakeSharpItemStyle);
      });
    });

    describe('When the value selector returns null for some keys', () => {
      const valueSelectorWithNull = (key: KeyWith<TestPayload>) =>
        key.number === 2 ? null : key.payload.weight;

      beforeEach(() => {
        result = generateSerie(valueSelectorWithNull, fakeName, fakeVariant);
      });

      it('should handle null values correctly', () => {
        expect(result.data[0]?.payload).toBe(10);
        expect(result.data[1]?.payload).toBeUndefined();
        expect(result.data[2]?.payload).toBe(12);
      });
    });

    describe('When using different variants', () => {
      it.each([
        TouchDesignSerieVariant.Default,
        TouchDesignSerieVariant.DefaultBold,
        TouchDesignSerieVariant.Target,
        TouchDesignSerieVariant.Measured,
      ])('should set the correct variant for %s', (variant) => {
        result = generateSerie(fakeValueSelector, fakeName, variant);
        expect(result.variant).toBe(variant);
      });
    });

    describe('When using different names', () => {
      it('should set the correct name', () => {
        const customName = 'Custom Serie Name';
        result = generateSerie(fakeValueSelector, customName, fakeVariant);
        expect(result.name).toBe(customName);
      });
    });

    describe('When the keyboard is empty', () => {
      const emptyKeyboard = new Keyboard([]);

      beforeEach(() => {
        const { result: hookResult } = renderHook(() =>
          useGenerateSerie<TestPayload>(emptyKeyboard),
        );
        generateSerie = hookResult.current.generateSerie;
        result = generateSerie(fakeValueSelector, fakeName, fakeVariant);
      });

      it('should return an empty data array', () => {
        expect(result.data).toHaveLength(0);
      });

      it('should still include other properties', () => {
        expect(result.name).toBe(fakeName);
        expect(result.variant).toBe(fakeVariant);
        expect(result.flatItemStyle).toBeUndefined();
        expect(result.sharpItemStyle).toBeUndefined();
      });
    });
  });

  describe('The hook memoization', () => {
    it('should return the same generateSerie function reference when keyboard is unchanged', () => {
      const { result, rerender } = renderHook(() =>
        useGenerateSerie<TestPayload>(fakeKeyboard),
      );
      const firstGenerateSerie = result.current.generateSerie;

      rerender();

      expect(result.current.generateSerie).toBe(firstGenerateSerie);
    });

    it('should generate different data when keyboard changes', () => {
      const firstHook = renderHook(() =>
        useGenerateSerie<TestPayload>(fakeKeyboard),
      );
      const firstData = firstHook.result.current.generateSerie(
        fakeValueSelector,
        fakeName,
        fakeVariant,
      ).data;

      const differentKeys: Array<KeyWith<TestPayload>> = [
        {
          color: KeyColor.White,
          name: 'E1',
          number: 4,
          octave: 1,
          payload: { weight: 20 },
        },
        {
          color: KeyColor.Black,
          name: 'F1',
          number: 5,
          octave: 1,
          payload: { weight: 25 },
        },
      ];
      const newKeyboard = new Keyboard(differentKeys);
      const secondHook = renderHook(() =>
        useGenerateSerie<TestPayload>(newKeyboard),
      );

      const secondData = secondHook.result.current.generateSerie(
        fakeValueSelector,
        fakeName,
        fakeVariant,
      ).data;
      expect(secondData).not.toEqual(firstData);
      expect(secondData).toHaveLength(2);
      expect(firstData).toHaveLength(3);
    });
  });
});
