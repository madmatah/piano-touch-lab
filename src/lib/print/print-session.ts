const MM_PER_INCH = 25.4;
const CSS_PX_PER_INCH = 96;

export interface PrintSheet {
  /** What `@page` is told: `A4 landscape`. */
  size: string;
  /** What `@page` is told: `12mm 14mm`. */
  margin: string;
  /** Width of the printable area, in millimetres. */
  contentWidth: number;
  /** Height of the printable area, in millimetres. */
  contentHeight: number;
}

/** The sheet a page prints on when it asks for nothing else. */
export const A4_PORTRAIT: PrintSheet = {
  contentHeight: 297 - 14 - 12,
  contentWidth: 210 - 15 * 2,
  margin: '14mm 15mm 12mm',
  size: 'A4 portrait',
};

/** Turned over, for a figure of eighty-eight keys. */
export const A4_LANDSCAPE: PrintSheet = {
  contentHeight: 210 - 12 * 2,
  contentWidth: 297 - 14 * 2,
  margin: '12mm 14mm',
  size: 'A4 landscape',
};

const toPixels = (mm: number): number =>
  Math.round((mm / MM_PER_INCH) * CSS_PX_PER_INCH);

/**
 * Where a printing page is.
 *
 * The browser says a page is about to print before it has laid anything out
 * for paper: at that point the page is still the one on the screen, and
 * nothing about the sheet can be measured. The print media takes effect once
 * the page has been laid out against the sheet, and from then on it can.
 */
export type PrintPhase = 'about-to-print' | 'on-paper' | 'on-screen';

type Step = (phase: PrintPhase) => void;

const steps = new Set<Step>();
let isWired = false;
let sheet: PrintSheet = A4_PORTRAIT;

const wire = (): void => {
  if (isWired || typeof window === 'undefined') {
    return;
  }
  isWired = true;
  const run = (phase: PrintPhase) => {
    for (const step of steps) {
      step(phase);
    }
  };
  // Both, because neither covers every way a page reaches a printer, and
  // neither alone says what a figure needs to know: the dialog fires the
  // events, the layout against the sheet comes with the media change.
  window.addEventListener('beforeprint', () => run('about-to-print'));
  window.addEventListener('afterprint', () => run('on-screen'));
  window
    .matchMedia('print')
    .addEventListener('change', (event) =>
      run(event.matches ? 'on-paper' : 'on-screen'),
    );
};

/**
 * Runs `step` at each turn of a print: when the page is about to be printed,
 * when it has been laid out on paper, and when it comes back to the screen.
 * Returns the unsubscribe.
 */
export const onPrintLayoutChange = (step: Step): (() => void) => {
  wire();
  steps.add(step);
  return () => {
    steps.delete(step);
  };
};

/** Declares the sheet the page on screen prints on. Returns the undo. */
export const setPrintSheet = (next: PrintSheet): (() => void) => {
  const previous = sheet;
  sheet = next;
  return () => {
    sheet = previous;
  };
};

/**
 * How wide the box really was, the last time a print on this sheet got far
 * enough to be measured.
 *
 * The sheet a page declares is a request. The margins, the paper and the
 * scale of the print dialog are the reader's, and a browser asked to fit a
 * sheet the page was not laid out for lays it out a second time, wider, with
 * no turn of script in between. A reader prints the same page on the same
 * sheet, though, so the box the last print had beats the one `@page` asked
 * for — and unlike the measurement, it is there at the one moment every
 * browser gives, before the printing starts.
 *
 * It is kept against the sheet it was measured on rather than thrown away
 * when another is declared: leaving one chart page for the next takes the
 * declaration back through the default on the way, and a reader goes along
 * those pages printing.
 *
 * Only the width is kept. The height grows into the sheet by measurement at
 * each pass, and a first height that is too generous costs a whole second
 * sheet, so it stays deliberately short of the mark.
 */
let measured: { sheet: PrintSheet; width: number } | null = null;

/** Keeps the box this print was laid out in, for the next one. */
export const rememberPrintedSheetWidth = (): void => {
  measured = { sheet, width: document.documentElement.clientWidth };
};

/**
 * How wide a figure's plot will be on paper, in CSS pixels.
 *
 * It is a first size, for the turn where there is nothing to measure: the
 * browser has not laid the page out against the sheet yet, so measuring would
 * return the screen. It is the box of the last print where there has been
 * one, and what the stylesheet asked for otherwise.
 *
 * A first size is all some prints get. The figure is measured against the
 * real box once it is on paper, but a browser fitting the page to a sheet it
 * was not laid out for lays it out again after that, and prints what it has.
 * Which is why the drawing also carries its own shape, and is stretched to
 * its box by the print stylesheet rather than sized to it.
 */
export const printablePlotWidth = (chrome: number): number =>
  (measured?.sheet === sheet ? measured.width : toPixels(sheet.contentWidth)) -
  chrome;

/**
 * How tall a figure's plot may be on paper, in CSS pixels, by the same
 * reckoning: a sheet carries one figure, so the figure may have what is left
 * of it once the page title and the frame have taken theirs.
 */
export const printablePlotHeight = (furniture: number): number =>
  toPixels(sheet.contentHeight) - furniture;

/**
 * What a measured rectangle has to be multiplied by to be in the pixels the
 * sheet is given in.
 *
 * A reader who has zoomed the page gets rectangles back at that zoom, while
 * the sheet is reported at none — and only while the page is laid out on
 * paper, where the two are compared. A figure that measured its own box
 * against the sheet without this would come out a tenth short for every
 * tenth of zoom: a band of plot across the top of a sheet it was meant to
 * fill, and a drawing that stops short of its own keyboard.
 */
const sheetPixel = (): number => {
  const root = document.documentElement;
  const drawn = root.getBoundingClientRect().width;
  return drawn > 0 ? root.clientWidth / drawn : 1;
};

/** The box `element` takes up, in the pixels the sheet is given in. */
export const sheetBoxOf = (
  element: Element,
): { height: number; width: number } => {
  const scale = sheetPixel();
  const box = element.getBoundingClientRect();
  return { height: box.height * scale, width: box.width * scale };
};

/**
 * How much of the sheet is left under `element`, in the pixels the sheet is
 * given in; negative when it runs over. Only means anything once the page is
 * laid out on paper.
 */
export const sheetRoomUnder = (element: Element): number =>
  document.documentElement.clientHeight -
  element.getBoundingClientRect().bottom * sheetPixel();

/** Below this a plot is no longer a plot, whatever the sheet is worth. */
const MIN_PRINTED_PLOT_HEIGHT = 160;

/** What the figure stops short of the edge of the sheet, in CSS pixels. */
const SHEET_GUARD = 2;

/**
 * A plot given the room measured under it.
 *
 * It is kept a hairline short of the edge: white under the figure costs
 * nothing, where half a pixel over costs a second sheet.
 */
export const filledPlotHeight = (current: number, room: number): number =>
  Math.max(MIN_PRINTED_PLOT_HEIGHT, current + Math.floor(room) - SHEET_GUARD);
