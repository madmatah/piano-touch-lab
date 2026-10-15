import type { EChartsOption, EChartsType } from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import {
  filledPlotHeight,
  onPrintLayoutChange,
  printablePlotHeight,
  printablePlotWidth,
  rememberPrintedSheetWidth,
  sheetBoxOf,
  sheetRoomUnder,
} from '@/lib/print/print-session';

import { FIGURE_CHROME, PRINT_FURNITURE } from '../chart-geometry';
import { fitDrawingToBox } from '../echarts/fit-drawing';
import { isSameTokens, readTokens, type ChartTokens } from '../chart-tokens';

interface PrintableChart {
  onChartReady: (chart: EChartsType) => void;
  /** The height the plot may have, in the state the page is in. */
  plotHeight: number;
  tokens: ChartTokens;
}

/** Turns of the measure-and-move the figure is settled on paper in. */
const SHEET_PASSES = 4;

/**
 * The foot of the figure this plot is drawn in — the foot of its last part
 * rather than of its frame. The frame is a flex item stretched to the row it
 * sits in, whether what it holds fills it or not; growing the plot moves what
 * it holds, and only then the frame. See `ChartFigure`.
 */
const figureFoot = (dom: HTMLElement): Element => {
  const figure = dom.closest('[data-slot="chart-figure"]') ?? dom;
  return figure.lastElementChild ?? figure;
};

/**
 * A chart that follows the theme, and survives being printed.
 *
 * Both the class next-themes writes and the system preference are watched: the
 * second matters while the theme is still "system", when switching the
 * operating system to dark changes no class on the page.
 *
 * Printing is the hard one. Everything else on the page is laid out again for
 * the sheet, but a figure holds its own size: it keeps the colours of the
 * screen, the width of the screen and the height it was given there. So it is
 * sized twice, once at each turn of a print.
 *
 * First when the browser announces the print, from the box the last print
 * was laid out in, or from the sheet the stylesheet asked for where there has
 * been no print — nothing is laid out for paper yet, so there is nothing to
 * measure. Then when the page is on paper, from the box the browser really
 * laid out: the margins and the paper of the print dialog are the reader's,
 * not the stylesheet's, and a figure sized for the wrong sheet leaves a band
 * of white beside it — or runs off the edge.
 *
 * Each turn is one synchronous flush, because the browser does not wait
 * between it and the printed rendering, and a second turn would never come.
 * Some browsers do not even leave the second turn: asked to fit a sheet the
 * page was not laid out for, they lay it out again, wider, after the last
 * turn of script. So the drawing is also handed its own shape, which lets the
 * print stylesheet stretch it to whatever box it ends up in, measured or not
 * — see `fitDrawingToBox`.
 */
export const usePrintableChart = (
  variant: keyof typeof FIGURE_CHROME,
  screenPlotHeight: number,
  /**
   * The option as the last render left it, kept in a layout effect so that it
   * is the taller one by the time the flush below returns. ECharts is told
   * directly rather than through the wrapper, which applies an option in a
   * passive effect — too late for a page already on its way to the printer.
   */
  option: React.RefObject<EChartsOption | null>,
  onReady?: (chart: EChartsType) => void,
): PrintableChart => {
  const chart = useRef<EChartsType | null>(null);
  const boxWatch = useRef<ResizeObserver | null>(null);
  const isOnPaper = useRef(false);
  const [state, setState] = useState(() => ({
    isPrinting: false,
    printedPlotHeight: printablePlotHeight(PRINT_FURNITURE[variant]),
    tokens: readTokens(),
  }));

  useEffect(() => {
    const followTheme = () =>
      setState((current) => {
        const tokens = readTokens();
        return isSameTokens(current.tokens, tokens)
          ? current
          : { ...current, tokens };
      });
    // The first render can happen before the theme class is applied.
    followTheme();

    const observer = new MutationObserver(followTheme);
    observer.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    });

    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', followTheme);

    /** Settles the figure at a size, in the one turn the printer leaves. */
    const settle = (
      isPrinting: boolean,
      width: number | 'auto',
      printedPlotHeight?: number,
    ) => {
      isOnPaper.current = isPrinting;
      flushSync(() =>
        setState((current) => ({
          isPrinting,
          printedPlotHeight: printedPlotHeight ?? current.printedPlotHeight,
          tokens: readTokens(),
        })),
      );
      if (option.current) {
        chart.current?.setOption(option.current, true);
      }
      // `auto` and not a bare `resize()`: ECharts keeps the width it was
      // given until it is told to measure its box again, so a figure that had
      // been sized for a sheet would stay that width on the screen.
      chart.current?.resize({ width });
      // And draws it on the next animation frame, which is a frame too late
      // for a page already on its way to the printer: the sheet would carry
      // the drawing from before the resize, in a box of the size after it.
      chart.current?.getZr().flush();
      const drawn = chart.current?.getDom();
      if (drawn) {
        fitDrawingToBox(drawn, isPrinting);
      }
    };

    const stopWatchingPrint = onPrintLayoutChange((phase) => {
      const dom = chart.current?.getDom();

      if (phase === 'on-screen') {
        settle(false, 'auto');
        return;
      }

      // Nothing is laid out for paper yet, so there is nothing to measure:
      // the sheet the stylesheet asked for is all there is to go on.
      if (phase === 'about-to-print' || !dom) {
        settle(
          true,
          printablePlotWidth(FIGURE_CHROME[variant]),
          printablePlotHeight(PRINT_FURNITURE[variant]),
        );
        return;
      }

      // Whatever comes of this print, the sheet it was laid out against is
      // the one to start the next from.
      rememberPrintedSheetWidth();

      // The figure takes the box the sheet gave it, and the room left under
      // it. That room is measured again after each move: a figure that ran
      // over has been broken across two sheets, and what is measured then is
      // the break rather than the overflow it came from. Two moves settle
      // that — off the break, then into the sheet — and a turn to find
      // nothing left to do.
      for (let pass = 0; pass < SHEET_PASSES; pass += 1) {
        const box = sheetBoxOf(dom);
        const height = filledPlotHeight(
          box.height,
          sheetRoomUnder(figureFoot(dom)),
        );
        if (pass > 0 && Math.abs(height - box.height) < 1) {
          return;
        }
        settle(true, box.width, height);
      }
    });

    return () => {
      observer.disconnect();
      scheme.removeEventListener('change', followTheme);
      stopWatchingPrint();
    };
  }, [option, variant]);

  useEffect(
    () => () => {
      boxWatch.current?.disconnect();
    },
    [],
  );

  const onChartReady = useCallback(
    (instance: EChartsType) => {
      chart.current = instance;
      // The wrapper drops the first size its sensor reports, to spare the
      // opening animation. When the box has already changed by then — a
      // scrollbar coming in with the keyboard under the plot — the drawing
      // keeps the width it was first given, and overruns its box for good.
      // Paper is left out: the sheet sets its own widths, see `settle`.
      const box = instance.getDom();
      boxWatch.current?.disconnect();
      boxWatch.current = new ResizeObserver(() => {
        if (
          !isOnPaper.current &&
          !instance.isDisposed() &&
          Math.abs(instance.getWidth() - box.clientWidth) >= 1
        ) {
          instance.resize();
        }
      });
      boxWatch.current.observe(box);
      onReady?.(instance);
    },
    [onReady],
  );

  return {
    onChartReady,
    // A sheet carries one figure, so on paper the plot takes what is left of it.
    plotHeight: state.isPrinting ? state.printedPlotHeight : screenPlotHeight,
    tokens: state.tokens,
  };
};
