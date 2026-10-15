/**
 * The frame every chart is drawn in.
 *
 * The plot and the keyboard below it share one horizontal coordinate space —
 * the x axis runs from 0 to the number of white keys — so a measurement sits
 * exactly above the key it was taken on. That only holds if the two use the
 * same insets, hence these constants rather than per-chart numbers.
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

/** Narrower than this and the axis labels collide; the figure scrolls instead. */
export const MIN_PLOT_WIDTH = {
  analyze: 640,
  design: 600,
} as const;
