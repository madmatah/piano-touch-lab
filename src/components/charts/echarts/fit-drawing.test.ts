import { describe, expect, it } from 'bun:test';

import { fitDrawingToBox } from './fit-drawing';

/** What ECharts leaves in the box it was given: a clipping box, and an SVG. */
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

describe('A chart drawing fitted to its box', () => {
  it('should carry the size it was drawn at as its shape', () => {
    const { drawing } = anEchartsBox('991', '384');

    fitDrawingToBox(drawing.parentElement!.parentElement!, true);

    expect(drawing.getAttribute('viewBox')).toBe('0 0 991 384');
    expect(drawing.getAttribute('preserveAspectRatio')).toBe('none');
  });

  it('should mark what the print stylesheet stretches', () => {
    const { box, container, drawing } = anEchartsBox('991', '384');

    fitDrawingToBox(container, true);

    expect(drawing.dataset.slot).toBe('chart-drawing');
    expect(box.dataset.slot).toBe('chart-drawing-box');
  });

  it('should give the drawing its own size back', () => {
    const { box, container, drawing } = anEchartsBox('991', '384');
    fitDrawingToBox(container, true);

    fitDrawingToBox(container, false);

    // On a screen the drawing is sized to its box by ECharts itself, and a
    // shape left behind would scale every mark of a chart it had redrawn.
    expect(drawing.getAttribute('viewBox')).toBeNull();
    expect(drawing.getAttribute('preserveAspectRatio')).toBeNull();
    expect(drawing.dataset.slot).toBeUndefined();
    expect(box.dataset.slot).toBeUndefined();
  });

  it('should leave a drawing of no size alone', () => {
    // Before the first draw there is nothing to take the shape of, and a
    // `viewBox` of nothing would collapse the figure.
    const { container, drawing } = anEchartsBox(null, null);

    fitDrawingToBox(container, true);

    expect(drawing.getAttribute('viewBox')).toBeNull();
    expect(drawing.dataset.slot).toBeUndefined();
  });

  it('should leave a box with nothing drawn in it alone', () => {
    const container = document.createElement('div');

    expect(() => fitDrawingToBox(container, true)).not.toThrow();
  });
});
