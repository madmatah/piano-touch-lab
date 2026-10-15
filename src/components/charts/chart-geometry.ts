import { KEYBED_OVERHANG } from '@/components/piano/KeyboardPlate';
import {
  WHITE_KEY_LENGTH_RATIO,
  type KeyboardDrawingOptions,
} from '@/components/piano/keyboard-drawing';

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
 * the figure with its legend, and the octave marks under it. A Design sheet
 * also carries the recap of the four parameters it was computed from, which
 * is the difference between the two. Measured off printed pages rather than
 * added up from the classes, which is why these are two numbers.
 *
 * They are generous ones. This is the figure's first height, the one it is
 * given before the browser has laid anything out for paper, and that first
 * layout settles how many sheets the page takes: a figure that runs over by a
 * pixel is moved whole to a second sheet, and the second sheet stays even
 * once the figure has been measured back onto the first. So the figure starts
 * shorter than it will end — short of a legend that wraps, of a page title
 * that does — and grows into the sheet once it can measure it.
 */
export const PRINT_FURNITURE = {
  analyze: 220,
  design: 340,
} as const;

/** The room the plot box keeps under the grid, for the axis labels. */
export const PLOT_BOX_MARGIN = 20;

/**
 * The keyboard under a chart, in pixels.
 *
 * It is drawn to scale, as on the home page: stretched to the width of the
 * plot and squeezed into a strip, its keys came out barely longer than wide
 * and its black keys twice too fat.
 */
const CHART_KEYBOARD = {
  /** The felt along the back of the keybed. */
  feltLength: 4,
  /**
   * The longest a key is drawn. On a wide screen a key to scale would be
   * half as long again, and the keyboard would weigh as much as the plot it
   * serves; past this, the keys are only made shorter.
   */
  mostKeyLength: 120,
  /** The sticks behind the balance rail, which the read key's wood fans across. */
  stickLength: 18,
} as const;

/** The white keys of a standard keyboard, which a page's height is ruled by. */
const STANDARD_WHITE_KEYS = 52;

/**
 * The keyboard under a chart, laid out for the width it is drawn at, one
 * unit to the pixel.
 */
export const chartKeyboardLayout = (
  width: number,
  whiteKeyCount: number,
): Required<KeyboardDrawingOptions> => {
  const whiteKeyWidth = whiteKeyCount === 0 ? 0 : width / whiteKeyCount;
  return {
    feltHeight: CHART_KEYBOARD.feltLength,
    keyHeight: Math.min(
      whiteKeyWidth * WHITE_KEY_LENGTH_RATIO,
      CHART_KEYBOARD.mostKeyLength,
    ),
    leverHeight: CHART_KEYBOARD.stickLength,
    whiteKeyWidth,
  };
};

/** How tall that keyboard is drawn, keybed included. */
export const chartKeyboardHeight = (
  width: number,
  whiteKeyCount: number = STANDARD_WHITE_KEYS,
): number => {
  const layout = chartKeyboardLayout(width, whiteKeyCount);
  return (
    layout.leverHeight + layout.feltHeight + layout.keyHeight + KEYBED_OVERHANG
  );
};

/**
 * What a page on screen takes besides its plot and its keyboard: the header
 * bar, the title, the lede, the frame of the figure with its legend and
 * reading, the octave marks under it, the line of help at the foot and the
 * page's own bottom margin. A Design page carries its target above the
 * figure as well, which is most of the difference. The keyboard is counted
 * apart, because it grows with the width of the window.
 *
 * Measured off the laid-out pages rather than added up, which is why these
 * are two numbers, and taken from the tallest page of each kind so that none
 * is given room it does not have — a plot one pixel too tall costs a
 * scrollbar, where one too short costs a little white.
 */
const SCREEN_FURNITURE = {
  analyze: 921,
  design: 1221,
} as const;

/**
 * How much taller the plot may be drawn than its base, so that a figure takes
 * the screen it is given. A tall screen is kept from turning a keyboard into
 * a square: past this the room is left as white under the figure.
 */
const SCREEN_PLOT_GROWTH = 320;

/**
 * What stands beside a plot on screen: the sidebar, the scrollbar, the page's
 * own margins and the frame of the figure. Taken with the sidebar open, which
 * is the only state the rule below has anything to say about — a window too
 * narrow to hold the sidebar is too narrow to spend its height on anyway.
 */
const SCREEN_SIDE_FURNITURE = 371;

/** The widest a plot is ever drawn: the content container, less that frame. */
const WIDEST_PLOT = 1614;

/** The plot a window of this width draws, near enough to rule a height by. */
const screenPlotWidth = (windowWidth: number): number =>
  Math.min(windowWidth - SCREEN_SIDE_FURNITURE, WIDEST_PLOT);

/**
 * How much wider than tall a plot is kept once it starts growing.
 *
 * The design draws eighty-eight keys three times wider than high, because
 * that is how they are read. A window taller than it is wide was handing the
 * figure all the height it had and none of the width, which drew the whole
 * keyboard into a square.
 */
export const LANDSCAPE = 2.5;

/**
 * The height to draw a plot at, in a window of this size.
 *
 * A figure of eighty-eight keys is read across, so the width is what matters
 * most — but a plot drawn at the height of a laptop on a screen half as tall
 * again leaves a band of nothing under it, and the marks it does draw are
 * closer together than they need to be. The room a tall window offers is
 * therefore taken, but only as far as its width carries it: the design's own
 * height is the floor, never the reward for a narrow window.
 */
export const screenPlotHeight = (
  base: number,
  windowHeight: number,
  windowWidth: number,
  variant: keyof typeof SCREEN_FURNITURE,
): number =>
  base +
  Math.round(
    Math.max(
      0,
      Math.min(
        SCREEN_PLOT_GROWTH,
        windowHeight -
          SCREEN_FURNITURE[variant] -
          chartKeyboardHeight(
            screenPlotWidth(windowWidth) - PLOT_INSET.left - PLOT_INSET.right,
          ),
        screenPlotWidth(windowWidth) / LANDSCAPE - base,
      ),
    ),
  );

/** Narrower than this and the axis labels collide; the figure scrolls instead. */
export const MIN_PLOT_WIDTH = {
  analyze: 640,
  design: 600,
} as const;
