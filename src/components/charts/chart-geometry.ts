/**
 * The frame every chart is drawn in.
 *
 * The plot and the keyboard below it share one horizontal coordinate space —
 * the x axis runs from 0 to the number of white keys — so a measurement sits
 * above the balance rail slot of the key it was taken on, and the wood of the
 * key leads the eye from there to the key itself. That only holds if the two
 * use the same insets, hence these constants rather than per-chart numbers.
 */
export const PLOT_INSET = {
  left: 48,
  right: 56,
} as const;

export const CHART_HEIGHTS = {
  /** The friction panel under the static balance chart. */
  frictionPlot: 96,
  /** The drawn keyboard serving as the x axis, key sticks included. */
  keyboard: 62,
  /** The row of C1…C8 marks under the keyboard. */
  octaveLabels: 18,
  /** The plot area of an Analyze chart. */
  plot: 280,
  /** The plot area of a Design chart, which shares its page with controls. */
  plotCompact: 248,
} as const;

/**
 * What the figure's frame takes from the width of a sheet: its own border, and
 * the padding of the box the plot sits in.
 */
export const FIGURE_CHROME = {
  analyze: 2 + 12 * 2,
  design: 2 + 10 * 2,
} as const;

/**
 * What a printed sheet holds besides the plot: the page title, the frame of
 * the figure with its legend, the octave marks under it and the caption.
 * Measured off a printed page rather than added up from the classes, which is
 * why it is one number.
 *
 * It is a generous one. This is the figure's first height, the one it is
 * given before the browser has laid anything out for paper, and that first
 * layout settles how many sheets the page takes: a figure that runs over by a
 * pixel is moved whole to a second sheet, and the second sheet stays even
 * once the figure has been measured back onto the first. So the figure starts
 * shorter than it will end — short of a two-line caption, of a legend that
 * wraps — and grows into the sheet once it can measure it.
 */
export const PRINT_FURNITURE = 220;

/** The room the plot box keeps under the grid, for the axis labels. */
export const PLOT_BOX_MARGIN = 20;

/** Narrower than this and the axis labels collide; the figure scrolls instead. */
export const MIN_PLOT_WIDTH = {
  analyze: 640,
  design: 600,
} as const;
