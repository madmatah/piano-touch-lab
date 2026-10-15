/**
 * A chart's drawing, told to fit the box it sits in rather than to fill it.
 *
 * ECharts draws into an SVG sized in pixels — a drawing *of a size*. Hand it
 * the wrong one and the box keeps the rest: a band of white down the side of
 * the figure, and measurements that no longer stand over the keys of the
 * keyboard drawn under them, which is the whole point of the figure.
 *
 * Printing is where the wrong size comes from. The sheet belongs to the print
 * dialog, and a browser asked to fit a sheet the page was not laid out for
 * lays it out a second time, wider, with no turn of script in between: the
 * figure measures the first box and the printer is handed the second.
 *
 * Written as a `viewBox`, the same drawing becomes a drawing *of a shape*,
 * and the print stylesheet stretches it to whatever box it ends up in (see
 * `styles/globals.css`). Where the size was right after all — which is every
 * browser the figures are checked against — the shape and the box agree and
 * nothing is stretched. Where it was not, the figure is drawn a little wide
 * rather than a quarter of a sheet short of its own keyboard.
 */

/** What the stylesheet stretches: the drawing, and the box ECharts clips it in. */
const DRAWING = 'chart-drawing';
const DRAWING_BOX = 'chart-drawing-box';

/**
 * Hands the drawing its own shape while `fits`, and its own size back after.
 * `container` is the box an ECharts instance was given.
 */
export const fitDrawingToBox = (
  container: HTMLElement,
  fits: boolean,
): void => {
  const drawing = container.querySelector('svg');
  // The box ECharts sizes and clips in; the drawing is laid over it.
  const box = drawing?.parentElement;
  if (!drawing || !box) {
    return;
  }

  if (!fits) {
    drawing.removeAttribute('viewBox');
    drawing.removeAttribute('preserveAspectRatio');
    delete drawing.dataset.slot;
    delete box.dataset.slot;
    return;
  }

  const width = drawing.getAttribute('width');
  const height = drawing.getAttribute('height');
  if (!width || !height) {
    return;
  }
  drawing.setAttribute('viewBox', `0 0 ${width} ${height}`);
  // Only the width of a sheet is ever in doubt, and a fit that kept the
  // proportions would answer it with the band of white it is there to spare.
  drawing.setAttribute('preserveAspectRatio', 'none');
  drawing.dataset.slot = DRAWING;
  box.dataset.slot = DRAWING_BOX;
};
