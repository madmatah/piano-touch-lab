import { beforeEach, describe, expect, it } from 'bun:test';

import {
  decimalSeparatorOf,
  EMPTY_VALUE,
  formatAxisValue,
  formatGrams,
  formatRatio,
  formatSignedGrams,
  formatSignedRatio,
  formatWholeGrams,
} from './format-weight';

const NBSP = ' ';
const MINUS = '−';

describe('The formatGrams() function', () => {
  let result: string[];

  describe('When the weight is a whole number', () => {
    beforeEach(() => {
      result = [formatGrams(4, 'en')];
    });

    it('should still show one decimal, and keep the unit on its line', () => {
      expect(result).toEqual([`4.0${NBSP}g`]);
    });
  });

  describe('When the reader writes French', () => {
    beforeEach(() => {
      result = [formatGrams(4.14, 'fr')];
    });

    it('should round to a tenth with a decimal comma', () => {
      expect(result).toEqual([`4,1${NBSP}g`]);
    });
  });

  describe('When the weight is negative', () => {
    beforeEach(() => {
      result = [formatGrams(-8.9, 'en')];
    });

    it('should use a real minus sign', () => {
      expect(result).toEqual([`${MINUS}8.9${NBSP}g`]);
    });
  });

  describe('When there is nothing to show', () => {
    beforeEach(() => {
      result = [
        formatGrams(null, 'fr'),
        formatGrams(undefined, 'fr'),
        formatGrams(Number.NaN, 'fr'),
      ];
    });

    it('should show a dash, and no unit', () => {
      expect(result).toEqual([EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE]);
    });
  });
});

describe('The formatWholeGrams() function', () => {
  let result: string;

  describe('When the weight has decimals', () => {
    beforeEach(() => {
      result = formatWholeGrams(38.6, 'fr');
    });

    it('should round it to the gram', () => {
      expect(result).toBe(`39${NBSP}g`);
    });
  });
});

describe('The formatSignedGrams() function', () => {
  let result: string[];

  describe('When the weight is to be added or removed', () => {
    beforeEach(() => {
      result = [formatSignedGrams(15.1, 'en'), formatSignedGrams(-2.5, 'en')];
    });

    it('should always carry a sign', () => {
      expect(result).toEqual([`+15.1${NBSP}g`, `${MINUS}2.5${NBSP}g`]);
    });
  });
});

describe('The formatRatio() function', () => {
  let result: string[];

  describe('When the ratio has a single decimal', () => {
    beforeEach(() => {
      result = [formatRatio(6.2, 'en'), formatRatio(6.2, 'fr')];
    });

    it('should show two decimals and no unit', () => {
      expect(result).toEqual(['6.20', '6,20']);
    });
  });
});

describe('The formatSignedRatio() function', () => {
  let result: string;

  describe('When the ratio is negative', () => {
    beforeEach(() => {
      result = formatSignedRatio(-0.25, 'fr');
    });

    it('should carry a real minus sign', () => {
      expect(result).toBe(`${MINUS}0,25`);
    });
  });
});

describe('The formatAxisValue() function', () => {
  let result: string[];

  describe('When the value falls on a round number', () => {
    beforeEach(() => {
      result = [formatAxisValue(40, 'fr'), formatAxisValue(5.5, 'fr')];
    });

    it('should drop the trailing zeros', () => {
      expect(result).toEqual(['40', '5,5']);
    });
  });
});

describe('The decimalSeparatorOf() function', () => {
  let result: string[];

  describe('When the reader writes French or English', () => {
    beforeEach(() => {
      result = [decimalSeparatorOf('fr'), decimalSeparatorOf('en')];
    });

    it('should give the separator each writes with', () => {
      expect(result).toEqual([',', '.']);
    });
  });
});
