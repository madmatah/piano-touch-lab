import { describe, expect, it } from 'bun:test';

import { screenPlotHeight } from './chart-geometry';

describe('The height a plot is drawn at on screen', () => {
  it('should be the height the design gives it on a laptop', () => {
    // A window with no room to spare keeps the figure whole rather than
    // growing it off the bottom of the screen.
    expect(screenPlotHeight(384, 800, 1920, 'analyze')).toBe(384);
    expect(screenPlotHeight(384, 983, 1920, 'analyze')).toBe(384);
  });

  it('should take the room a taller window offers', () => {
    expect(screenPlotHeight(384, 1080, 1920, 'analyze')).toBe(481);
  });

  it('should stop short of turning a keyboard into a square', () => {
    // Past this the room is left as white under the figure: a plot as tall
    // as it is wide reads as a block, not as a line of eighty-eight keys.
    expect(screenPlotHeight(384, 1440, 1920, 'analyze')).toBe(620);
    expect(screenPlotHeight(384, 2160, 1920, 'analyze')).toBe(620);
  });

  it('should give a narrow window none of the height it has', () => {
    // A window taller than it is wide: all the room in the world below the
    // figure, and no width to draw a wider plot against it.
    expect(screenPlotHeight(384, 1203, 706, 'analyze')).toBe(384);
    expect(screenPlotHeight(384, 2000, 1024, 'analyze')).toBe(384);
  });

  it('should grow every plot by the same room, whatever its base', () => {
    expect(screenPlotHeight(300, 1080, 1920, 'analyze') - 300).toBe(
      screenPlotHeight(384, 1080, 1920, 'analyze') - 384,
    );
  });

  it('should give a Design page nothing it has not got', () => {
    // A Design page carries its target above the figure, so the window that
    // leaves an Analyze plot a hundred pixels leaves this one none.
    expect(screenPlotHeight(268, 1080, 1920, 'design')).toBe(268);
    expect(screenPlotHeight(268, 1440, 1920, 'design')).toBe(425);
  });
});
