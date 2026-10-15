import { beforeEach, describe, expect, it } from 'bun:test';

import {
  nextMeasureField,
  type MeasureField,
} from '@/components/measures/measure-tab-order';

type Property = 'DS' | 'D' | 'U' | 'FW' | 'SW' | 'SWR';

describe('The nextMeasureField() function', () => {
  const plainPasses: Property[][] = [['D', 'U'], ['FW'], ['SW']];
  const springPasses: Property[][] = [['DS', 'D', 'U'], ['FW'], ['SW', 'SWR']];
  const keyCount = 88;
  let result: MeasureField<Property> | null;

  describe('When moving on within a key', () => {
    beforeEach(() => {
      result = nextMeasureField(
        plainPasses,
        keyCount,
        { keyNumber: 1, property: 'D' },
        1,
      );
    });

    it('should go to the next field of the same key', () => {
      expect(result).toEqual({ keyNumber: 1, property: 'U' });
    });
  });

  describe('When leaving the last field of a key', () => {
    beforeEach(() => {
      result = nextMeasureField(
        plainPasses,
        keyCount,
        { keyNumber: 1, property: 'U' },
        1,
      );
    });

    it('should go to the first field of the next key', () => {
      expect(result).toEqual({ keyNumber: 2, property: 'D' });
    });
  });

  describe('When leaving the last key of a pass', () => {
    beforeEach(() => {
      result = nextMeasureField(
        plainPasses,
        keyCount,
        { keyNumber: 88, property: 'U' },
        1,
      );
    });

    it('should go to the first key of the next pass', () => {
      expect(result).toEqual({ keyNumber: 1, property: 'FW' });
    });
  });

  describe('When the spring reading belongs to the first pass', () => {
    beforeEach(() => {
      result = nextMeasureField(
        springPasses,
        keyCount,
        { keyNumber: 1, property: 'DS' },
        1,
      );
    });

    it('should go on to the down weight of the same key', () => {
      expect(result).toEqual({ keyNumber: 1, property: 'D' });
    });
  });

  describe('When the hand-measured ratio belongs to the last pass', () => {
    beforeEach(() => {
      result = nextMeasureField(
        springPasses,
        keyCount,
        { keyNumber: 88, property: 'FW' },
        1,
      );
    });

    it('should start that pass on the strike weight of the first key', () => {
      expect(result).toEqual({ keyNumber: 1, property: 'SW' });
    });
  });

  describe('When going back from the first field of a key', () => {
    beforeEach(() => {
      result = nextMeasureField(
        springPasses,
        keyCount,
        { keyNumber: 2, property: 'DS' },
        -1,
      );
    });

    it('should go to the last field of the key before', () => {
      expect(result).toEqual({ keyNumber: 1, property: 'U' });
    });
  });

  describe('When going back from the first key of a pass', () => {
    beforeEach(() => {
      result = nextMeasureField(
        springPasses,
        keyCount,
        { keyNumber: 1, property: 'SW' },
        -1,
      );
    });

    it('should go to the last key of the pass before', () => {
      expect(result).toEqual({ keyNumber: 88, property: 'FW' });
    });
  });

  describe('When moving on from the very last field', () => {
    beforeEach(() => {
      result = nextMeasureField(
        springPasses,
        keyCount,
        { keyNumber: 88, property: 'SWR' },
        1,
      );
    });

    it('should leave the table', () => {
      expect(result).toBeNull();
    });
  });

  describe('When going back from the very first field', () => {
    beforeEach(() => {
      result = nextMeasureField(
        plainPasses,
        keyCount,
        { keyNumber: 1, property: 'D' },
        -1,
      );
    });

    it('should leave the table', () => {
      expect(result).toBeNull();
    });
  });

  describe('When the field belongs to no pass', () => {
    beforeEach(() => {
      result = nextMeasureField(
        plainPasses,
        keyCount,
        { keyNumber: 1, property: 'SWR' },
        1,
      );
    });

    it('should return null', () => {
      expect(result).toBeNull();
    });
  });
});
