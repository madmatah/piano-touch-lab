import ReactECharts from 'echarts-for-react';
import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { ChartFigure } from '../figure/ChartFigure';
import { ChartKeyboardAxis } from '../figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from '../figure/ChartLegend';
import type { ChartLegendMarkKind } from '../figure/ChartLegendMark';
import { useChartFigure } from '../hooks/use-chart-figure';
import { useChartTokens } from '../hooks/use-chart-tokens';
import { serieValueAt, type TouchDesignSerie } from '../interfaces';
import {
  frictionZoneAt,
  useFrictionZonesSeries,
  type FrictionZoneLabels,
} from './hooks/use-friction-zones-series';
import {
  FRICTION_GRID,
  TOUCH_WEIGHT_PLOT_HEIGHT,
  useTouchWeightOption,
} from './hooks/use-touch-weight-option';
import {
  TOUCH_WEIGHT_SERIE_IDS,
  useTouchWeightSeries,
  type TouchWeightSerieId,
  type TouchWeightSeries,
} from './hooks/use-touch-weight-series';

/**
 * What the chart hands to the rail beside it.
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
  caption?: React.ReactNode;
  /**
   * The balance weight of the instrument as it stands, drawn hollow behind
   * the designed one so the two can be read against each other.
   */
  ghostSerie?: TouchDesignSerie;
  /**
   * The rail to the right of the figure. It is a function so that the panel
   * reads the very series the chart draws, rather than computing them again.
   */
  renderSidePanel?: (context: TouchWeightReadingContext) => React.ReactNode;
  useSupportSpringMeasurements: boolean;
  variant?: 'analyze' | 'design';
}

export const TouchWeightChart = ({
  analyzedKeyboard,
  caption,
  ghostSerie,
  renderSidePanel,
  useSupportSpringMeasurements,
  variant = 'analyze',
}: TouchWeightChartProps) => {
  const { currentLanguage, t } = useTranslation();
  const tokens = useChartTokens();
  // Two grids: the pointer has to be followed over the friction panel too.
  const { geometry, hover, keys } = useChartFigure(
    analyzedKeyboard,
    undefined,
    2,
  );
  const series = useTouchWeightSeries(
    analyzedKeyboard,
    useSupportSpringMeasurements,
  );

  const [visibleSeries, setVisibleSeries] = useState(ALL_VISIBLE);
  const [isGhostVisible, setIsGhostVisible] = useState(true);
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
  const option = useTouchWeightOption({
    frictionZones,
    geometry,
    ghostSerie: ghostSerie && isGhostVisible ? ghostSerie : null,
    locale: currentLanguage,
    panelTitles,
    series,
    tokens,
    visibleSeries,
  });

  const legendItems = useMemo<ChartLegendItem[]>(
    () => [
      ...TOUCH_WEIGHT_SERIE_IDS.map((id) => ({
        colorClassName: LEGEND_MARKS[id].colorClassName,
        id,
        isVisible: visibleSeries[id],
        label: series[id].name,
        mark: LEGEND_MARKS[id].mark,
        onToggle: () => toggleSerie(id),
      })),
      ...(ghostSerie
        ? [
            {
              colorClassName: 'text-ptl-series-ghost',
              id: 'ghost',
              isVisible: isGhostVisible,
              label: ghostSerie.name,
              mark: 'diamond-hollow' as const,
              onToggle: () => setIsGhostVisible((current) => !current),
            },
          ]
        : []),
    ],
    [ghostSerie, isGhostVisible, series, toggleSerie, visibleSeries],
  );

  const { hoveredKey } = hover;
  // The zone is named here rather than in the page: the rail must agree with
  // the bands the chart has drawn.
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

  const figure = (
    <ChartFigure
      variant={variant}
      geometry={geometry}
      highlightedKey={hoveredKey}
      header={<ChartLegend items={legendItems} />}
      caption={caption}
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
        option={option}
        notMerge
        onChartReady={hover.bindChart}
        style={{ height: TOUCH_WEIGHT_PLOT_HEIGHT, width: '100%' }}
      />
    </ChartFigure>
  );

  if (!renderSidePanel) {
    return figure;
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      {figure}
      {renderSidePanel({ frictionZoneLabel, hoveredKey, series })}
    </div>
  );
};
