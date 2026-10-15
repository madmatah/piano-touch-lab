import { beforeEach, describe, expect, it } from 'bun:test';

import { screenPlotHeight } from './chart-geometry';

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
      expect(result).toEqual([481]);
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
      expect(result).toEqual([268, 425]);
    });
  });
});
