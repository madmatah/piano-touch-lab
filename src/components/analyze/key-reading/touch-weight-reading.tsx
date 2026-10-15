import {
  ChartLegendMark,
  type ChartLegendMarkKind,
} from '@/components/charts/figure/ChartLegendMark';
import {
  serieValueAt,
  type TouchDesignSerie,
} from '@/components/charts/interfaces';
import type { TouchWeightSeries } from '@/components/charts/touch-weight-chart/hooks/use-touch-weight-series';
import { formatGrams } from '@/lib/format/format-weight';

import type { KeyReadingRow } from './KeyReadingStrip';

/**
 * The reading card is ink-dark in both themes, so its glyphs take the colours
 * of that card rather than the series colours used over the plot.
 */
export const readingMark = (
  kind: ChartLegendMarkKind,
  colorClassName: string,
) => (
  <span className={colorClassName}>
    <ChartLegendMark kind={kind} />
  </span>
);

/**
 * The four weights of the static balance figure for one key, each with the
 * glyph it is drawn with: Analyze reads them off the piano, the preview off
 * the design.
 */
export const touchWeightReadingRows = (
  series: TouchWeightSeries,
  hoveredKey: number | null,
  locale: string,
): KeyReadingRow[] => {
  const readingOf = (serie: TouchDesignSerie) =>
    formatGrams(serieValueAt(serie, hoveredKey), locale);

  return [
    {
      label: series.down.name,
      mark: readingMark('triangle-down', 'text-ptl-reading-accent'),
      value: readingOf(series.down),
    },
    {
      label: series.up.name,
      mark: readingMark('triangle-up', 'text-ptl-current'),
      value: readingOf(series.up),
    },
    {
      isAccent: true,
      label: series.balance.name,
      mark: readingMark('diamond', 'text-ptl-reading-foreground'),
      value: readingOf(series.balance),
    },
    {
      label: series.friction.name,
      mark: readingMark('dot', 'text-ptl-reading-muted'),
      value: readingOf(series.friction),
    },
  ];
};
