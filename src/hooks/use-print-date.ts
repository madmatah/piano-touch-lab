import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * The day a sheet is printed on.
 *
 * Taken again when a print starts: a page left open overnight would print
 * the day it was opened. Flushed at once, because the browser lays the sheet
 * out as soon as `beforeprint` returns.
 */
export const usePrintDate = (): Date => {
  const [printDate, setPrintDate] = useState(() => new Date());

  useEffect(() => {
    const takeToday = () => {
      flushSync(() => setPrintDate(new Date()));
    };
    window.addEventListener('beforeprint', takeToday);
    return () => {
      window.removeEventListener('beforeprint', takeToday);
    };
  }, []);

  return printDate;
};
