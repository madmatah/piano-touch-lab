import { beforeEach, describe, expect, it } from 'bun:test';

import {
  chartKeyboardHeight,
  chartKeyboardLayout,
  screenPlotHeight,
} from './chart-geometry';

describe('The chartKeyboardLayout() function', () => {
  let result: number;

  describe('When the white keys are drawn 15 px wide', () => {
    beforeEach(() => {
      result = chartKeyboardLayout(780, 52).keyHeight;
    });

    it('should draw them six and a half times as long, as on the instrument', () => {
      expect(result).toBe(97.5);
    });
  });

  describe('When the white keys are drawn 30 px wide', () => {
    beforeEach(() => {
      result = chartKeyboardLayout(1560, 52).keyHeight;
    });

    it('should stop them at 120 px long', () => {
      expect(result).toBe(120);
    });
  });

  describe('When the keyboard has fewer keys over the same width', () => {
    beforeEach(() => {
      result = chartKeyboardLayout(780, 39).whiteKeyWidth;
    });

    it('should draw each one wider', () => {
      expect(result).toBe(20);
    });
  });
});

describe('The chartKeyboardHeight() function', () => {
  let result: number;

  describe('When the keys are at their longest', () => {
    beforeEach(() => {
      result = chartKeyboardHeight(1560);
    });

    it('should add the sticks, the felt and the keybed to the keys', () => {
      expect(result).toBe(146);
    });
  });
});

describe('The screenPlotHeight() function', () => {
  let result: number[];

  describe('When an Analyze window has no room to spare, as on a laptop', () => {
    beforeEach(() => {
      result = [
        screenPlotHeight(384, 800, 1920, 'analyze'),
        screenPlotHeight(384, 983, 1920, 'analyze'),
      ];
    });

    it('should keep the height the design gives, rather than grow the figure off the screen', () => {
      expect(result).toEqual([384, 384]);
    });
  });

  describe('When an Analyze window is taller', () => {
    beforeEach(() => {
      result = [screenPlotHeight(384, 1080, 1920, 'analyze')];
    });

    it('should take the room it offers', () => {
      expect(result).toEqual([397]);
    });
  });

  describe('When an Analyze window is taller still', () => {
    beforeEach(() => {
      result = [
        screenPlotHeight(384, 1440, 1920, 'analyze'),
        screenPlotHeight(384, 2160, 1920, 'analyze'),
      ];
    });

    it('should stop short of turning eighty-eight keys into a block', () => {
      expect(result).toEqual([620, 620]);
    });
  });

  describe('When the window is taller than it is wide', () => {
    beforeEach(() => {
      result = [
        screenPlotHeight(384, 1203, 706, 'analyze'),
        screenPlotHeight(384, 2000, 1024, 'analyze'),
      ];
    });

    it('should give none of its height, having no width to draw a wider plot against', () => {
      expect(result).toEqual([384, 384]);
    });
  });

  describe('When two plots of different bases share a window', () => {
    beforeEach(() => {
      result = [
        screenPlotHeight(300, 1080, 1920, 'analyze') - 300,
        screenPlotHeight(384, 1080, 1920, 'analyze') - 384,
      ];
    });

    it('should grow them by the same room', () => {
      expect(result[0]).toBe(result[1]!);
    });
  });

  describe('When the page is a Design page, its target above the figure', () => {
    beforeEach(() => {
      result = [
        screenPlotHeight(268, 1080, 1920, 'design'),
        screenPlotHeight(268, 1440, 1920, 'design'),
      ];
    });

    it('should grow the plot only once the target has had its room', () => {
      expect(result).toEqual([268, 341]);
    });
  });
});
