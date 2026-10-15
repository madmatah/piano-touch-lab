import { useMemo } from 'react';

import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import { useTranslation } from '@/hooks/use-translation';
import { formatRatio } from '@/lib/format/format-weight';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { KeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { CHART_HEIGHTS, PLOT_BOX_MARGIN, PLOT_INSET } from './chart-geometry';
import { GRID_TOP, type AxisScale } from './echarts/build-base-option';
import { ChartEmptyFrame } from './figure/ChartEmptyFrame';
import { ChartFigure } from './figure/ChartFigure';
import { ChartKeyboardAxis } from './figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from './figure/ChartLegend';
import { useChartFigure } from './hooks/use-chart-figure';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { KeyboardChart, TouchDesignSerieVariant } from './KeyboardChart';
import {
  serieValueAt,
  type ChartReadingContext,
  type TouchDesignSerie,
} from './interfaces';
import { useLegendToggles } from './hooks/use-legend-toggles';

/** The scale of the mockups: 5.5 to 7.0, ruled every 0.5 and halved by a faint line. */
const RATIO_BAND = { interval: 0.5, max: 7, min: 5.5 } as const;

/** Rows of the overlay's own coordinate space; fine enough for any plot height. */
const PLOT_SPAN = 1000;

type KeyWithStrikeWeightRatio<T> = T &
  Pick<
    TouchWeightKeyAnalysis,
    | 'computedStrikeWeightRatio'
    | 'measuredStrikeWeightRatio'
    | 'strikeWeightRatio'
  >;

/**
 * The quantity this chart plots.
 *
 * The chart draws the median of it and the reading states that same median,
 * so both read the keyboard through this one selector.
 */
export const selectComputedStrikeWeightRatio = (
  key: KeyWith<Pick<TouchWeightKeyAnalysis, 'computedStrikeWeightRatio'>>,
): OptionalNumber => key.payload.computedStrikeWeightRatio;

/**
 * The ratio the rest of the application works from: what was measured where
 * it was measured, and what the analysis derives everywhere else.
 *
 * The data sheet prints it, the design smooths it and the preview computes
 * from it, so it is what a single plotted curve has to be — otherwise the
 * figure and the sheet state two different numbers for one quantity.
 */
export const selectStrikeWeightRatio = (
  key: KeyWith<Pick<TouchWeightKeyAnalysis, 'strikeWeightRatio'>>,
): OptionalNumber => key.payload.strikeWeightRatio;

/**
 * The mockup band, widened to whatever the instrument actually reads.
 *
 * 5.5–7.0 covers a well-regulated grand, but an unusual action reads outside
 * it and its keys must not drop off the plot: the band is a floor, never a
 * ceiling.
 */
const buildRatioScale = (series: readonly TouchDesignSerie[]): AxisScale => {
  const { interval } = RATIO_BAND;
  const values = series.flatMap((serie) =>
    serie.data
      .map((point) => point.payload)
      .filter(
        (value): value is number => value !== undefined && !Number.isNaN(value),
      ),
  );

  return {
    interval,
    max: Math.max(
      RATIO_BAND.max,
      ...values.map((value) => Math.ceil(value / interval) * interval),
    ),
    min: Math.min(
      RATIO_BAND.min,
      ...values.map((value) => Math.floor(value / interval) * interval),
    ),
    minorSplit: true,
  };
};

interface Stem {
  from: number;
  to: number;
  /** Horizontal position of the key, in white-key units. */
  x: number;
}

/**
 * The stems tying each point to what it is read against, and the brass rule
 * of the median.
 *
 * `KeyboardChart` draws one series per quantity and offers no slot for either
 * of these, so they are drawn here instead, over the plot rectangle the chart
 * lays out. It is pinned to the insets that rectangle keeps rather than given
 * a height of its own, so that it still covers the plot when the figure is
 * given the height of a sheet. Being SVG and HTML they also follow the theme
 * through CSS, as the hover band does.
 */
const ChartReferenceOverlay = ({
  geometry,
  median,
  medianLabel,
  scale,
  stems,
}: {
  geometry: KeyboardPlacement;
  median: number | null;
  medianLabel: string;
  scale: AxisScale;
  stems: readonly Stem[];
}) => {
  const row = (value: number) =>
    ((scale.max - value) / (scale.max - scale.min)) * PLOT_SPAN;

  if (geometry.width === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-0"
      style={{
        bottom: PLOT_BOX_MARGIN - GRID_TOP,
        left: PLOT_INSET.left,
        right: PLOT_INSET.right,
        top: GRID_TOP,
      }}
    >
      <svg
        className="block size-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${geometry.width} ${PLOT_SPAN}`}
      >
        {/* The viewBox is stretched to the plot, so strokes are held in pixels. */}
        <path
          className="stroke-ptl-series-standard-soft"
          d={stems
            .map((stem) => `M${stem.x} ${row(stem.from)}V${row(stem.to)}`)
            .join('')}
          fill="none"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {median === null ? null : (
          <path
            className="stroke-ptl-brass"
            d={`M0 ${row(median)}H${geometry.width}`}
            fill="none"
            strokeDasharray="6 4"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {median === null ? null : (
        <span
          className="absolute -translate-y-1/2 font-mono text-[11px] whitespace-nowrap text-ptl-brass"
          style={{ left: 'calc(100% + 6px)', top: `${row(median) / 10}%` }}
        >
          {medianLabel}
        </span>
      )}
    </div>
  );
};

export interface StrikeWeightRatioChartProps<T> {
  caption?: React.ReactNode;
  /** Said over the empty figure, until there is something to draw. */
  emptyState?: React.ReactNode;
  /** Draws the hand-measured ratio beside the computed one. */
  displayBothManualAndComputed: boolean;
  /** Legend entries contributed by the page, e.g. the design target. */
  extraLegendItems?: ChartLegendItem[];
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeightRatio<T>>>;
  /**
   * The reading strip at the head of the figure. It is a function so that the
   * strip reads the very series the chart draws, rather than computing them
   * again.
   */
  renderReading?: (context: ChartReadingContext) => React.ReactNode;
  targetSerie?: TouchDesignSerie;
  variant?: 'analyze' | 'design';
}

export const StrikeWeightRatioChart = <T,>({
  caption,
  emptyState,
  displayBothManualAndComputed,
  extraLegendItems,
  keyboard,
  renderReading,
  targetSerie,
  variant = 'analyze',
}: StrikeWeightRatioChartProps<T>) => {
  const { currentLanguage, t } = useTranslation();
  const { geometry, hover, keys } = useChartFigure(keyboard);
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const stats = useKeyboardStats(
    keyboard,
    displayBothManualAndComputed
      ? selectComputedStrikeWeightRatio
      : selectStrikeWeightRatio,
  );

  // Two curves when the reader measures ratios by hand and wants to see both,
  // one otherwise — and that one is the effective ratio, measured or derived.
  const computedSerieLabel = displayBothManualAndComputed
    ? t('Computed Strike Weight Ratio')
    : t('Strike Weight Ratio');

  const computedSerie = useMemo(
    () =>
      generateSerie(
        displayBothManualAndComputed
          ? selectComputedStrikeWeightRatio
          : selectStrikeWeightRatio,
        computedSerieLabel,
        TouchDesignSerieVariant.Measured,
      ),
    [computedSerieLabel, displayBothManualAndComputed, generateSerie],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(computedSerie),
    [isSerieEmpty, computedSerie],
  );

  const manualSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.measuredStrikeWeightRatio,
        t('Measured Strike Weight Ratio'),
        TouchDesignSerieVariant.Computed,
      ),
    [generateSerie, t],
  );
  const isManualEmpty = useMemo(
    () => isSerieEmpty(manualSerie),
    [isSerieEmpty, manualSerie],
  );
  const showsManual = displayBothManualAndComputed && !isManualEmpty;

  const series = useMemo(
    () =>
      [
        ...(targetSerie ? [targetSerie] : []),
        ...(isEmpty ? [] : [computedSerie]),
        ...(showsManual ? [manualSerie] : []),
      ].filter((serie): serie is TouchDesignSerie => serie !== undefined),
    [computedSerie, isEmpty, manualSerie, showsManual, targetSerie],
  );

  const scale = useMemo(() => buildRatioScale(series), [series]);

  const { isShown, withToggles } = useLegendToggles();
  const drawnSeries = useMemo(
    () =>
      series.filter((serie) =>
        isShown(
          serie === computedSerie
            ? 'computed'
            : serie === manualSerie
              ? 'manual'
              : 'target',
        ),
      ),
    [computedSerie, isShown, manualSerie, series],
  );

  // The brass rule stands for the median alone. Where the page sets a target,
  // that target is what the keys are read against, and the chart already draws
  // it as a line of its own.
  const medianRule = targetSerie ? null : stats.median;

  // The stems hang from the ratios to what they are read against, so they go
  // when the ratios do.
  const stems = useMemo(
    () =>
      (isShown('computed') ? computedSerie.data : []).flatMap<Stem>((point) => {
        const from = targetSerie
          ? serieValueAt(targetSerie, point.number)
          : stats.median;
        const x = geometry.keysByNumber.get(point.number)?.backCenter;
        if (from === null || point.payload === undefined || x === undefined) {
          return [];
        }
        return [{ from, to: point.payload, x }];
      }),
    [computedSerie, geometry, isShown, stats.median, targetSerie],
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      withToggles([
        ...(extraLegendItems ?? []),
        ...(isEmpty
          ? []
          : [
              {
                colorClassName: 'text-foreground',
                id: 'computed',
                label: computedSerieLabel,
                mark: 'dot' as const,
              },
            ]),
        ...(showsManual
          ? [
              {
                colorClassName: 'text-muted-foreground',
                id: 'manual',
                label: t('Measured Strike Weight Ratio'),
                mark: 'diamond' as const,
              },
            ]
          : []),
        ...(medianRule === null
          ? []
          : [
              {
                colorClassName: 'text-ptl-brass',
                id: 'median',
                label: t('Median'),
                mark: 'line-dashed' as const,
              },
            ]),
      ]),
    [
      computedSerieLabel,
      extraLegendItems,
      isEmpty,
      medianRule,
      showsManual,
      t,
      withToggles,
    ],
  );

  const plotHeight =
    variant === 'analyze' ? CHART_HEIGHTS.plot : CHART_HEIGHTS.plotCompact;

  if (isEmpty && emptyState) {
    return (
      <ChartEmptyFrame
        geometry={geometry}
        height={plotHeight}
        keys={keys}
        scale={buildRatioScale([])}
        variant={variant}
      >
        {emptyState}
      </ChartEmptyFrame>
    );
  }

  const figure = (
    <ChartFigure
      reading={renderReading?.({
        hoveredKey: hover.hoveredKey,
        measuredSerie: computedSerie,
        referenceSeries: showsManual ? [manualSerie] : [],
      })}
      variant={variant}
      geometry={geometry}
      highlightedKey={hover.hoveredKey}
      header={
        // Nothing is plotted before the first measurement: no legend, and no
        // empty bar above the plot either.
        legendItems.length === 0 ? undefined : (
          <ChartLegend items={legendItems} />
        )
      }
      caption={caption}
      keyboard={
        <ChartKeyboardAxis
          keys={keys}
          highlightedKey={hover.hoveredKey}
          onKeyHover={hover.setHoveredKey}
          description={t('Keyboard: hover a key to read its measurement')}
        />
      }
      {...hover.figureProps}
    >
      <div className="relative">
        <ChartReferenceOverlay
          geometry={geometry}
          median={isShown('median') ? medianRule : null}
          medianLabel={formatRatio(medianRule, currentLanguage)}
          scale={scale}
          stems={stems}
        />
        <div className="relative z-10">
          <KeyboardChart
            variant={variant}
            geometry={geometry}
            height={plotHeight}
            onChartReady={hover.bindChart}
            scale={scale}
            series={drawnSeries}
          />
        </div>
      </div>
    </ChartFigure>
  );

  return figure;
};
