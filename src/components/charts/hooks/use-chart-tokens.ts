import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * The design tokens a chart needs in JavaScript.
 *
 * Everything else in the interface takes its colour from CSS, but ECharts
 * draws on a canvas and wants strings. Reading the custom properties back off
 * the document keeps one source of truth: the stylesheet.
 */
const CHART_TOKEN_VARIABLES = {
  axisStrong: '--input',
  grid: '--ptl-chart-grid',
  gridSoft: '--ptl-chart-grid-soft',
  ink: '--foreground',
  inkMuted: '--muted-foreground',
  inkSubtle: '--ptl-ink-3',
  range: '--ptl-chart-range',
  seriesBalance: '--ptl-series-balance',
  seriesDown: '--ptl-series-down',
  seriesFriction: '--ptl-series-friction',
  seriesGhost: '--ptl-series-ghost',
  seriesStandard: '--ptl-series-standard',
  seriesStandardSoft: '--ptl-series-standard-soft',
  seriesTarget: '--ptl-series-target',
  seriesTargetArea: '--ptl-series-target-area',
  seriesUp: '--ptl-series-up',
  surface: '--card',
  zoneHigh: '--ptl-zone-high',
  zoneLow: '--ptl-zone-low',
  zoneMedium: '--ptl-zone-medium',
} as const;

export type ChartTokens = Record<keyof typeof CHART_TOKEN_VARIABLES, string>;

/** Used where there is no layout engine to resolve the properties, as in tests. */
export const CHART_TOKEN_FALLBACKS: ChartTokens = {
  axisStrong: '#b3a994',
  grid: '#e6e0d4',
  gridSoft: '#efeae0',
  ink: '#1a1612',
  inkMuted: '#4f483f',
  inkSubtle: '#6b6357',
  range: '#cbc2b0',
  seriesBalance: '#1a1612',
  seriesDown: '#b07f25',
  seriesFriction: '#857c6e',
  seriesGhost: '#b9af9e',
  seriesStandard: '#b3a994',
  seriesStandardSoft: '#d3caba',
  seriesTarget: '#8c6a2c',
  seriesTargetArea: '#b07f2529',
  seriesUp: '#9e2f24',
  surface: '#fbf9f4',
  zoneHigh: '#9e2f241f',
  zoneLow: '#b07f2526',
  zoneMedium: '#1a16120d',
};

const readTokens = (): ChartTokens => {
  if (typeof window === 'undefined') {
    return CHART_TOKEN_FALLBACKS;
  }

  const style = window.getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(CHART_TOKEN_VARIABLES).map(([name, variable]) => [
      name,
      style.getPropertyValue(variable).trim() ||
        CHART_TOKEN_FALLBACKS[name as keyof ChartTokens],
    ]),
  ) as ChartTokens;
};

const isSameTokens = (left: ChartTokens, right: ChartTokens): boolean =>
  (Object.keys(left) as (keyof ChartTokens)[]).every(
    (name) => left[name] === right[name],
  );

/**
 * Follows the theme, and the printer.
 *
 * Both the class next-themes writes and the system preference are watched: the
 * second matters while the theme is still "system", when switching the
 * operating system to dark changes no class on the page.
 *
 * Printing is the third: the print stylesheet repaints the page but not a
 * canvas, so the tokens are read again, synchronously, the moment the print
 * media takes effect — otherwise a dark figure lands on a white sheet.
 */
export const useChartTokens = (): ChartTokens => {
  const [tokens, setTokens] = useState(readTokens);

  useEffect(() => {
    const refresh = () =>
      setTokens((current) => {
        const next = readTokens();
        return isSameTokens(current, next) ? current : next;
      });
    // The first render can happen before the theme class is applied.
    refresh();

    // The browser does not wait for React between the media change and the
    // printed rendering, hence the synchronous flush.
    const refreshNow = () => flushSync(refresh);

    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    });

    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', refresh);

    const print = window.matchMedia('print');
    print.addEventListener('change', refreshNow);
    window.addEventListener('beforeprint', refreshNow);
    window.addEventListener('afterprint', refreshNow);

    return () => {
      observer.disconnect();
      scheme.removeEventListener('change', refresh);
      print.removeEventListener('change', refreshNow);
      window.removeEventListener('beforeprint', refreshNow);
      window.removeEventListener('afterprint', refreshNow);
    };
  }, []);

  return tokens;
};
