import { describe, expect, it } from 'bun:test';

import {
  A4_LANDSCAPE,
  A4_PORTRAIT,
  filledPlotHeight,
  printablePlotHeight,
  printablePlotWidth,
  rememberPrintedSheetWidth,
  setPrintSheet,
  sheetBoxOf,
  sheetRoomUnder,
} from './print-session';

/** A print laid out in a box of `width`, as the browser would report it. */
const laidOutOn = (width: number) => {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    configurable: true,
    value: width,
  });
  rememberPrintedSheetWidth();
};

describe('The print session', () => {
  describe('filledPlotHeight', () => {
    it('should give the plot the room measured under it', () => {
      // 94 pixels of sheet under the figure, and the plot takes them.
      expect(filledPlotHeight(537, 94)).toBe(629);
    });

    it('should stop short of the edge of the sheet', () => {
      // A figure that ends exactly on the edge is a figure that may be
      // broken across two sheets by half a pixel of rounding.
      expect(filledPlotHeight(537, 0)).toBeLessThan(537);
      expect(filledPlotHeight(537, 2)).toBe(537);
    });

    it('should never round its way over the edge', () => {
      expect(filledPlotHeight(537, 10.9)).toBe(545);
    });

    it('should give back the room a figure runs over by', () => {
      expect(filledPlotHeight(537, -200)).toBe(335);
    });

    it('should leave a plot that is still a plot', () => {
      // A sheet too small for the figure shrinks it, but not out of being a
      // plot: what is left is cropped rather than flattened to nothing.
      expect(filledPlotHeight(537, -2000)).toBe(160);
    });
  });

  describe('the sheet a page declares', () => {
    it('should size the plot in pixels, frame taken off', () => {
      const restore = setPrintSheet(A4_LANDSCAPE);
      // 297mm − 2 × 14mm of margin is 269mm, which is 1017 pixels at 96 dpi.
      expect(printablePlotWidth(0)).toBe(1017);
      expect(printablePlotWidth(26)).toBe(991);
      // 210mm − 2 × 12mm is 186mm, 703 pixels, less what the page puts
      // around the plot.
      expect(printablePlotHeight(166)).toBe(537);
      restore();
    });

    it('should go back to the sheet it was on', () => {
      const before = printablePlotWidth(0);
      const restore = setPrintSheet(A4_LANDSCAPE);
      restore();
      expect(printablePlotWidth(0)).toBe(before);
    });
  });

  describe('a figure measured against its sheet', () => {
    /**
     * A page on paper under a reader's zoom: the sheet comes back in its own
     * pixels, every rectangle at the zoom.
     */
    const onPaperAt = (zoom: number, sheet = { height: 703, width: 1016 }) => {
      for (const [side, value] of [
        ['clientWidth', sheet.width],
        ['clientHeight', sheet.height],
      ] as const) {
        Object.defineProperty(document.documentElement, side, {
          configurable: true,
          value,
        });
      }
      document.documentElement.getBoundingClientRect = () =>
        ({ width: sheet.width / zoom }) as DOMRect;
    };

    const anElement = (rect: Partial<DOMRect>) =>
      ({ getBoundingClientRect: () => rect as DOMRect }) as Element;

    it('should give its box in the pixels the sheet is given in', () => {
      onPaperAt(1.1);
      // The figure fills a 1016 pixel sheet, less the 26 of its own frame;
      // zoomed, the browser hands that back as 901.
      const box = sheetBoxOf(anElement({ height: 503, width: 901 }));
      expect(Math.round(box.width)).toBe(991);
      expect(Math.round(box.height)).toBe(553);
    });

    it('should leave a box alone when the page is not zoomed', () => {
      onPaperAt(1);
      const box = sheetBoxOf(anElement({ height: 553, width: 991 }));
      expect(Math.round(box.width)).toBe(991);
    });

    it('should measure the room under a figure in those same pixels', () => {
      onPaperAt(1.1);
      // A figure whose foot the browser puts at 637 stands at 701 on the
      // sheet, two short of the 703 the sheet is worth. Measured without the
      // zoom it would read 66, and the figure would grow off the edge.
      expect(Math.round(sheetRoomUnder(anElement({ bottom: 637 })))).toBe(2);
    });

    it('should take a page it cannot measure at face value', () => {
      onPaperAt(1, { height: 703, width: 0 });
      expect(sheetBoxOf(anElement({ height: 553, width: 991 })).width).toBe(
        991,
      );
    });
  });

  describe('the sheet the last print really had', () => {
    it('should be where the next print starts', () => {
      const restore = setPrintSheet(A4_LANDSCAPE);
      // A dialog fitting the page to a sheet it was not laid out for lays it
      // out wider than the 1017 pixels `@page` asked for.
      laidOutOn(1271);
      expect(printablePlotWidth(26)).toBe(1245);
      restore();
    });

    it('should carry over to the next page on the same sheet', () => {
      const first = setPrintSheet(A4_LANDSCAPE);
      laidOutOn(1271);
      // Leaving one chart page for the next: the declaration goes back
      // through the default on the way, and both ask for the same sheet.
      first();
      const second = setPrintSheet(A4_LANDSCAPE);
      expect(printablePlotWidth(26)).toBe(1245);
      second();
    });

    it('should say nothing about another sheet', () => {
      const landscape = setPrintSheet(A4_LANDSCAPE);
      laidOutOn(1271);
      landscape();

      const portrait = setPrintSheet(A4_PORTRAIT);
      // 210mm − 2 × 15mm is 180mm, 680 pixels: the sheet, not the memory.
      expect(printablePlotWidth(0)).toBe(680);
      portrait();
    });
  });
});
