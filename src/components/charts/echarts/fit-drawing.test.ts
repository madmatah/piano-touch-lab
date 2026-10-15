import { beforeEach, describe, expect, it } from 'bun:test';

import { fitDrawingToBox } from './fit-drawing';

const anEchartsBox = (width: string | null, height: string | null) => {
  const container = document.createElement('div');
  const box = document.createElement('div');
  const drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (width !== null) {
    drawing.setAttribute('width', width);
  }
  if (height !== null) {
    drawing.setAttribute('height', height);
  }
  box.append(drawing);
  container.append(box);
  return { box, container, drawing };
};

describe('The fitDrawingToBox() function', () => {
  let echarts: ReturnType<typeof anEchartsBox>;

  describe('When the page prints a drawing of a size', () => {
    beforeEach(() => {
      echarts = anEchartsBox('991', '384');
      fitDrawingToBox(echarts.container, true);
    });

    it('should carry the size it was drawn at as its shape', () => {
      expect(echarts.drawing.getAttribute('viewBox')).toBe('0 0 991 384');
      expect(echarts.drawing.getAttribute('preserveAspectRatio')).toBe('none');
    });

    it('should mark what the print stylesheet stretches', () => {
      expect(echarts.drawing.dataset.slot).toBe('chart-drawing');
      expect(echarts.box.dataset.slot).toBe('chart-drawing-box');
    });
  });

  describe('When the page is back on screen', () => {
    beforeEach(() => {
      echarts = anEchartsBox('991', '384');
      fitDrawingToBox(echarts.container, true);
      fitDrawingToBox(echarts.container, false);
    });

    it('should give the drawing its own size back, so that a redrawn chart is not scaled', () => {
      expect(echarts.drawing.getAttribute('viewBox')).toBeNull();
      expect(echarts.drawing.getAttribute('preserveAspectRatio')).toBeNull();
    });

    it('should take the marks off', () => {
      expect(echarts.drawing.dataset.slot).toBeUndefined();
      expect(echarts.box.dataset.slot).toBeUndefined();
    });
  });

  describe('When nothing has been drawn at a size yet', () => {
    beforeEach(() => {
      echarts = anEchartsBox(null, null);
      fitDrawingToBox(echarts.container, true);
    });

    it('should leave the drawing alone, a shape of nothing collapsing the figure', () => {
      expect(echarts.drawing.getAttribute('viewBox')).toBeNull();
      expect(echarts.drawing.dataset.slot).toBeUndefined();
    });
  });

  describe('When the box has nothing drawn in it', () => {
    let act: () => unknown;

    beforeEach(() => {
      act = () => fitDrawingToBox(document.createElement('div'), true);
    });

    it('should leave it alone', () => {
      expect(act).not.toThrow();
    });
  });
});
