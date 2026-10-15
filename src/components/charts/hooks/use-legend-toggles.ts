import { useCallback, useState } from 'react';

import type { ChartLegendItem } from '../figure/ChartLegend';
import type { TouchDesignSerie } from '../interfaces';
import { TouchDesignSerieVariant } from '../KeyboardChart';

const LEGEND_IDS: Record<TouchDesignSerieVariant, string> = {
  [TouchDesignSerieVariant.Computed]: 'computed',
  [TouchDesignSerieVariant.Default]: 'standard-soft',
  [TouchDesignSerieVariant.DefaultBold]: 'standard-bold',
  [TouchDesignSerieVariant.Measured]: 'measured',
  [TouchDesignSerieVariant.Target]: 'target',
};

/** The legend entry a curve belongs to, named after the way it is drawn. */
export const legendIdOf = (serie: TouchDesignSerie): string =>
  LEGEND_IDS[serie.variant ?? TouchDesignSerieVariant.Measured];

/**
 * Which entries of a figure's legend the reader has switched off.
 *
 * ECharts' own legend hid a series on a click, and readers lean on it to see
 * the measurement without the standard curves crossing it, or the target
 * without the measurement. The figures draw their own legend now, so they
 * keep that here: every entry toggles, and `isShown` tells the figure what
 * to leave off the plot. The scale stays the one all the curves need, so
 * hiding a curve never moves the others.
 */
export const useLegendToggles = () => {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isShown = useCallback((id: string) => !hidden.has(id), [hidden]);

  const withToggles = useCallback(
    (items: ChartLegendItem[]): ChartLegendItem[] =>
      items.map((item) => ({
        ...item,
        isVisible: !hidden.has(item.id),
        onToggle: () => toggle(item.id),
      })),
    [hidden, toggle],
  );

  return { isShown, withToggles };
};
