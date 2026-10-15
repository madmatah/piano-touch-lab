import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

import {
  LANDSCAPE_SHEET,
  PORTRAIT_SHEET,
  filledPlotHeight,
  printablePlotHeight,
  printablePlotWidth,
  rememberPrintedSheetWidth,
  setPrintSheet,
  sheetBoxOf,
  sheetRoomUnder,
} from './print-session';

const root = document.documentElement;

const laidOutOn = (width: number) => {
  Object.defineProperty(root, 'clientWidth', {
    configurable: true,
    value: width,
  });
  rememberPrintedSheetWidth();
};

const onPaperAt = (zoom: number, sheet = { height: 703, width: 1016 }) => {
  Object.defineProperty(root, 'clientWidth', {
    configurable: true,
    value: sheet.width,
  });
  Object.defineProperty(root, 'clientHeight', {
    configurable: true,
    value: sheet.height,
  });
  Object.defineProperty(root, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ width: sheet.width / zoom }) as DOMRect,
  });
};

const backOnScreen = () => {
  Reflect.deleteProperty(root, 'clientWidth');
  Reflect.deleteProperty(root, 'clientHeight');
  Reflect.deleteProperty(root, 'getBoundingClientRect');
};

const anElement = (rect: Partial<DOMRect>) =>
  ({ getBoundingClientRect: () => rect as DOMRect }) as Element;

describe('The filledPlotHeight() function', () => {
  let result: number;

  describe('When there is room under the figure', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, 94);
    });

    it('should give it to the plot', () => {
      expect(result).toBe(629);
    });
  });

  describe('When the figure ends exactly on the edge of the sheet', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, 0);
    });

    it('should stop short of it, half a pixel of rounding breaking it across two sheets', () => {
      expect(result).toBeLessThan(537);
    });
  });

  describe('When the figure ends just short of the edge', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, 2);
    });

    it('should leave it as it is', () => {
      expect(result).toBe(537);
    });
  });

  describe('When the room is not a whole number of pixels', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, 10.9);
    });

    it('should never round its way over the edge', () => {
      expect(result).toBe(545);
    });
  });

  describe('When the figure runs over the sheet', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, -200);
    });

    it('should give back what it runs over by', () => {
      expect(result).toBe(335);
    });
  });

  describe('When the sheet is far too small for the figure', () => {
    beforeEach(() => {
      result = filledPlotHeight(537, -2000);
    });

    it('should leave a plot that is still a plot, cropped rather than flattened', () => {
      expect(result).toBe(160);
    });
  });
});

describe('The printablePlotWidth() function', () => {
  let restore: () => void;
  let result: number[];

  afterEach(() => {
    restore();
  });

  describe('When the page declares a landscape sheet, with 14 mm side margins', () => {
    beforeEach(() => {
      restore = setPrintSheet(LANDSCAPE_SHEET);
      result = [printablePlotWidth(0), printablePlotWidth(26)];
    });

    it('should size the plot for the narrower of A4 and Letter, at 96 dpi, the frame taken off', () => {
      expect(result).toEqual([950, 924]);
    });
  });

  describe('When the page declares a portrait sheet, with 15 mm side margins', () => {
    beforeEach(() => {
      restore = setPrintSheet(PORTRAIT_SHEET);
      result = [printablePlotWidth(0)];
    });

    it('should size the plot to that sheet', () => {
      expect(result).toEqual([680]);
    });
  });
});

describe('The printablePlotHeight() function', () => {
  let restore: () => void;
  let result: number;

  afterEach(() => {
    restore();
  });

  describe('When the page declares a landscape sheet, with 12 mm margins top and bottom', () => {
    beforeEach(() => {
      restore = setPrintSheet(LANDSCAPE_SHEET);
      result = printablePlotHeight(166);
    });

    it('should give the plot what the page leaves of the 703 pixels the lower of A4 and Letter has', () => {
      expect(result).toBe(537);
    });
  });
});

describe('The setPrintSheet() function', () => {
  let before: number;
  let result: number;

  describe('When the page that declared a sheet goes', () => {
    beforeEach(() => {
      before = printablePlotWidth(0);
      setPrintSheet(LANDSCAPE_SHEET)();
      result = printablePlotWidth(0);
    });

    it('should go back to the sheet it was on', () => {
      expect(result).toBe(before);
    });
  });
});

describe('The sheetBoxOf() function', () => {
  let result: { height: number; width: number };

  afterEach(() => {
    backOnScreen();
  });

  describe('When the page is printed under a zoom of 110 %', () => {
    beforeEach(() => {
      onPaperAt(1.1);
      result = sheetBoxOf(anElement({ height: 503, width: 901 }));
    });

    it('should give the box in the pixels the sheet is given in', () => {
      expect(Math.round(result.width)).toBe(991);
      expect(Math.round(result.height)).toBe(553);
    });
  });

  describe('When the page is not zoomed', () => {
    beforeEach(() => {
      onPaperAt(1);
      result = sheetBoxOf(anElement({ height: 553, width: 991 }));
    });

    it('should leave the box alone', () => {
      expect(Math.round(result.width)).toBe(991);
    });
  });

  describe('When the page cannot be measured', () => {
    beforeEach(() => {
      onPaperAt(1, { height: 703, width: 0 });
      result = sheetBoxOf(anElement({ height: 553, width: 991 }));
    });

    it('should take the box at face value', () => {
      expect(result.width).toBe(991);
    });
  });
});

describe('The sheetRoomUnder() function', () => {
  let result: number;

  afterEach(() => {
    backOnScreen();
  });

  describe('When the page is printed under a zoom of 110 %', () => {
    beforeEach(() => {
      onPaperAt(1.1);
      result = sheetRoomUnder(anElement({ bottom: 637 }));
    });

    it('should measure the room under the figure in the pixels of the sheet, not those of the zoom', () => {
      expect(Math.round(result)).toBe(2);
    });
  });
});

describe('The rememberPrintedSheetWidth() function', () => {
  let restore: () => void;
  let result: number;

  afterEach(() => {
    restore();
    restore = setPrintSheet(LANDSCAPE_SHEET);
    laidOutOn(950);
    restore();
    backOnScreen();
  });

  describe('When the print dialog laid the page out wider than the sheet it asked for', () => {
    beforeEach(() => {
      restore = setPrintSheet(LANDSCAPE_SHEET);
      laidOutOn(1271);
      result = printablePlotWidth(26);
    });

    it('should start the next print from the sheet the last one really had', () => {
      expect(result).toBe(1245);
    });
  });

  describe('When the next page asks for the same sheet', () => {
    beforeEach(() => {
      const first = setPrintSheet(LANDSCAPE_SHEET);
      laidOutOn(1271);
      first();
      restore = setPrintSheet(LANDSCAPE_SHEET);
      result = printablePlotWidth(26);
    });

    it('should carry over to it', () => {
      expect(result).toBe(1245);
    });
  });

  describe('When the next page asks for another sheet', () => {
    beforeEach(() => {
      const landscape = setPrintSheet(LANDSCAPE_SHEET);
      laidOutOn(1271);
      landscape();
      restore = setPrintSheet(PORTRAIT_SHEET);
      result = printablePlotWidth(0);
    });

    it('should say nothing about it', () => {
      expect(result).toBe(680);
    });
  });
});
