import { act, renderHook } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  setSystemTime,
} from 'bun:test';

import { usePrintDate } from '@/hooks/use-print-date';

describe('The usePrintDate hook', () => {
  const openedOn = new Date('2026-10-14T22:00:00');
  const printedOn = new Date('2026-10-15T09:30:00');
  let result: Date;

  afterEach(() => {
    setSystemTime();
  });

  describe('When the page is printed the day it was opened', () => {
    beforeEach(() => {
      setSystemTime(openedOn);
      result = renderHook(() => usePrintDate()).result.current;
    });

    it('should give the day the page was opened', () => {
      expect(result).toEqual(openedOn);
    });
  });

  describe('When the page is printed the next morning', () => {
    beforeEach(() => {
      setSystemTime(openedOn);
      const hook = renderHook(() => usePrintDate());
      setSystemTime(printedOn);
      act(() => {
        window.dispatchEvent(new Event('beforeprint'));
      });
      result = hook.result.current;
    });

    it('should give the day of the print', () => {
      expect(result).toEqual(printedOn);
    });
  });
});
