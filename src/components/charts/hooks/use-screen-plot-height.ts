import { useCallback, useSyncExternalStore } from 'react';

import { screenPlotHeight, type FIGURE_CHROME } from '../chart-geometry';

/** Every figure on the page asks the same question of the same window. */
const subscribe = (notify: () => void): (() => void) => {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
};

/**
 * The height to draw a plot at on this screen.
 *
 * `base` is the height the design gives it — what a laptop shows. A window
 * with room to spare gets a taller plot rather than a band of white under the
 * figure, as long as it is wide enough to keep the figure a figure.
 * Printing is not concerned: the sheet has its own measure, taken once the
 * page is laid out on it (see `usePrintableChart`).
 */
export const useScreenPlotHeight = (
  base: number,
  variant: keyof typeof FIGURE_CHROME,
): number => {
  const onScreen = useCallback(
    () =>
      screenPlotHeight(base, window.innerHeight, window.innerWidth, variant),
    [base, variant],
  );
  /** On a server there is no window, so the plot keeps the height it was given. */
  const onServer = useCallback(() => base, [base]);

  return useSyncExternalStore(subscribe, onScreen, onServer);
};
