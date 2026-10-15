import { useEffect } from 'react';

import {
  A4_LANDSCAPE,
  setPrintSheet,
  type PrintSheet,
} from '@/lib/print/print-session';

/**
 * The sheet this page prints on.
 *
 * `@page` takes no selector, so a stylesheet cannot say that one route prints
 * upright and another on its side. A named page is meant to — `page: chart`
 * against an `@page chart` rule — but Chrome kept the default size through it,
 * so the rule is written to the document while the page is on screen and taken
 * away when it leaves. One route is mounted at a time, so one rule is.
 */
export const usePrintPageSize = (sheet: PrintSheet) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.media = 'print';
    style.textContent = `@page { size: ${sheet.size}; margin: ${sheet.margin} }`;
    document.head.append(style);
    const restoreSheet = setPrintSheet(sheet);

    return () => {
      style.remove();
      restoreSheet();
    };
  }, [sheet]);
};

/** A figure of eighty-eight keys only fits across the sheet. */
export const usePrintLandscape = () => usePrintPageSize(A4_LANDSCAPE);
