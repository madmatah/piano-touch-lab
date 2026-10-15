import { describe, expect, it } from 'bun:test';

import {
  EMPTY_VALUE,
  formatAxisValue,
  formatGrams,
  formatRatio,
  formatSignedGrams,
  formatSignedRatio,
} from './format-weight';

const NARROW_NBSP = ' ';
const NBSP = ' ';
const MINUS = '−';

/** Intl puts a space of its own choosing before the unit in French. */
const normalise = (text: string) =>
  text.replaceAll(NARROW_NBSP, ' ').replaceAll(NBSP, ' ');

describe('The weight formatters', () => {
  describe('formatGrams', () => {
    it('should always show one decimal', () => {
      expect(formatGrams(4, 'en')).toBe(`4.0${NBSP}g`);
      expect(normalise(formatGrams(4.14, 'fr'))).toBe('4,1 g');
    });

    it('should use a real minus sign', () => {
      expect(formatGrams(-8.9, 'en')).toBe(`${MINUS}8.9${NBSP}g`);
    });

    it('should show a dash when there is nothing to show', () => {
      expect(formatGrams(null, 'fr')).toBe(EMPTY_VALUE);
      expect(formatGrams(undefined, 'fr')).toBe(EMPTY_VALUE);
      expect(formatGrams(Number.NaN, 'fr')).toBe(EMPTY_VALUE);
    });
  });

  describe('formatSignedGrams', () => {
    it('should always carry a sign', () => {
      expect(formatSignedGrams(15.1, 'en')).toBe(`+15.1${NBSP}g`);
      expect(formatSignedGrams(-2.5, 'en')).toBe(`${MINUS}2.5${NBSP}g`);
    });
  });

  describe('formatRatio', () => {
    it('should show two decimals and no unit', () => {
      expect(formatRatio(6.2, 'en')).toBe('6.20');
      expect(formatRatio(6.2, 'fr')).toBe('6,20');
    });
  });

  describe('formatSignedRatio', () => {
    it('should always carry a sign', () => {
      expect(formatSignedRatio(-0.25, 'fr')).toBe(`${MINUS}0,25`);
    });
  });

  describe('formatAxisValue', () => {
    it('should drop trailing zeros', () => {
      expect(formatAxisValue(40, 'fr')).toBe('40');
      expect(formatAxisValue(5.5, 'fr')).toBe('5,5');
    });
  });
});
