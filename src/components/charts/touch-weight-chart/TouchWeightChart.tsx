import ReactECharts from 'echarts-for-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { EChartsOption } from 'echarts';

import { useTranslation } from '@/hooks/use-translation';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { ChartEmptyFrame } from '../figure/ChartEmptyFrame';
import { ChartFigure } from '../figure/ChartFigure';
import { ChartKeyboardAxis } from '../figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from '../figure/ChartLegend';
import type { ChartLegendMarkKind } from '../figure/ChartLegendMark';
import { useChartFigure } from '../hooks/use-chart-figure';
import { usePrintableChart } from '../hooks/use-printable-chart';
import { useScreenPlotHeight } from '../hooks/use-screen-plot-height';
import { SVG_RENDERER } from '../renderer';
import { serieValueAt } from '../interfaces';
import {
  frictionZoneAt,
  useFrictionZonesSeries,
  type FrictionZoneLabels,
} from './hooks/use-friction-zones-series';
import {
  FRICTION_GRID,
  touchWeightPlotHeight,
  WEIGHT_SCALE,
  useTouchWeightOption,
} from './hooks/use-touch-weight-option';
import {
  TOUCH_WEIGHT_SERIE_IDS,
  useTouchWeightSeries,
  type TouchWeightSerieId,
  type TouchWeightSeries,
} from './hooks/use-touch-weight-series';

/**
 * What the chart hands to the reading strip at its head.
 *
 * `ChartReadingContext`, which the other figures use, carries one measured
 * series and its reference curves; this figure draws four series of equal
 * standing, so it describes its own reading instead.
 */
export interface TouchWeightReadingContext {
  /** The zone the friction of that key falls in, already localised. */
  frictionZoneLabel: string | null;
  hoveredKey: number | null;
  series: TouchWeightSeries;
}

/** The glyph and colour each series carries in the legend. */
const LEGEND_MARKS: Record<
  TouchWeightSerieId,
  { colorClassName: string; mark: ChartLegendMarkKind }
> = {
  balance: { colorClassName: 'text-ptl-series-balance', mark: 'diamond' },
  down: { colorClassName: 'text-ptl-series-down', mark: 'triangle-down' },
  friction: { colorClassName: 'text-ptl-series-friction', mark: 'dot' },
  up: { colorClassName: 'text-ptl-series-up', mark: 'triangle-up' },
};

const ALL_VISIBLE: Record<TouchWeightSerieId, boolean> = {
  balance: true,
  down: true,
  friction: true,
  up: true,
};

export interface TouchWeightChartProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  /** Said over the empty figure, until there is something to draw. */
  emptyState?: React.ReactNode;
  /**
   * The reading strip at the head of the figure. It is a function so that the
   * strip reads the very series the chart draws, rather than computing them
   * again.
   */
  renderReading?: (context: TouchWeightReadingContext) => React.ReactNode;
  useSupportSpringMeasurements: boolean;
  variant?: 'analyze' | 'design';
}

export const TouchWeightChart = ({
  analyzedKeyboard,
  emptyState,
  renderReading,
  useSupportSpringMeasurements,
  variant = 'analyze',
}: TouchWeightChartProps) => {
  const { currentLanguage, t } = useTranslation();
  // Two grids: the pointer has to be followed over the friction panel too.
  const { geometry, hover, keys } = useChartFigure(analyzedKeyboard, 2);
  const option = useRef<EChartsOption | null>(null);
  const screenPlotHeight = useScreenPlotHeight(
    touchWeightPlotHeight(),
    variant,
  );
  const { onChartReady, plotHeight, tokens } = usePrintableChart(
    variant,
    screenPlotHeight,
    option,
    hover.bindChart,
  );
  const extraWeightHeight = Math.max(0, plotHeight - touchWeightPlotHeight());
  const series = useTouchWeightSeries(
    analyzedKeyboard,
    useSupportSpringMeasurements,
  );

  const [visibleSeries, setVisibleSeries] = useState(ALL_VISIBLE);
  const toggleSerie = useCallback((id: TouchWeightSerieId) => {
    setVisibleSeries((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const zoneLabels = useMemo<FrictionZoneLabels>(
    () => ({ high: t('High'), low: t('Low'), medium: t('Medium') }),
    [t],
  );
  const frictionZones = useFrictionZonesSeries({
    axisIndex: FRICTION_GRID,
    geometry,
    keys,
    labels: zoneLabels,
    tokens,
  });

  const panelTitles = useMemo(
    () => ({ friction: t('FRICTION (g)'), weight: t('WEIGHT (g)') }),
    [t],
  );
  const nextOption = useTouchWeightOption({
    extraWeightHeight,
    frictionZones,
    geometry,
    locale: currentLanguage,
    panelTitles,
    series,
    tokens,
    visibleSeries,
  });

  // Kept for the print handler, which has to tell ECharts itself.
  useLayoutEffect(() => {
    option.current = nextOption;
  }, [nextOption]);

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      TOUCH_WEIGHT_SERIE_IDS.map((id) => ({
        colorClassName: LEGEND_MARKS[id].colorClassName,
        id,
        isVisible: visibleSeries[id],
        label: series[id].name,
        mark: LEGEND_MARKS[id].mark,
        onToggle: () => toggleSerie(id),
      })),
    [series, toggleSerie, visibleSeries],
  );

  const { hoveredKey } = hover;
  // The zone is named here rather than in the page: the reading must agree
  // with the bands the chart has drawn.
  const frictionZoneLabel = useMemo(() => {
    if (hoveredKey === null) {
      return null;
    }
    const zone = frictionZoneAt(
      serieValueAt(series.friction, hoveredKey),
      hoveredKey,
      analyzedKeyboard.size,
    );
    return zone ? zoneLabels[zone] : null;
  }, [analyzedKeyboard.size, hoveredKey, series.friction, zoneLabels]);

  const isEmpty = series.balance.data.every(
    (point) => point.payload === undefined,
  );
  if (isEmpty && emptyState) {
    return (
      <ChartEmptyFrame
        geometry={geometry}
        height={touchWeightPlotHeight()}
        keys={keys}
        scale={WEIGHT_SCALE}
        variant={variant}
      >
        {emptyState}
      </ChartEmptyFrame>
    );
  }

  const figure = (
    <ChartFigure
      reading={renderReading?.({ frictionZoneLabel, hoveredKey, series })}
      variant={variant}
      geometry={geometry}
      highlightedKey={hoveredKey}
      header={<ChartLegend items={legendItems} />}
      keyboard={
        <ChartKeyboardAxis
          keys={keys}
          highlightedKey={hoveredKey}
          onKeyHover={hover.setHoveredKey}
          description={t('Keyboard: hover a key to read its measurement')}
        />
      }
      {...hover.figureProps}
    >
      <ReactECharts
        option={nextOption}
        notMerge
        onChartReady={onChartReady}
        opts={SVG_RENDERER}
        style={{
          height: touchWeightPlotHeight(extraWeightHeight),
          width: '100%',
        }}
      />
    </ChartFigure>
  );

  return figure;
};
