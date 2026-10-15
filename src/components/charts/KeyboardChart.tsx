import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

import {
  buildGrid,
  buildKeyAxis,
  buildValueAxis,
  MONO_FONT,
  type AxisScale,
} from './echarts/build-base-option';
import type { ChartTokens } from './hooks/use-chart-tokens';
import { usePrintableChart } from './hooks/use-printable-chart';
import { useScreenPlotHeight } from './hooks/use-screen-plot-height';
import { PLOT_BOX_MARGIN } from './chart-geometry';
import { SVG_RENDERER } from './renderer';
import type { TouchDesignSerie } from './interfaces';

export enum TouchDesignSerieVariant {
  DefaultBold = 1,
  Default = 2,
  Target = 3,
  Measured = 4,
  Computed = 5,
}

export interface KeyboardChartProps {
  geometry: KeyboardGeometry;
  /** Plot height in pixels, excluding the keyboard underneath. */
  height: number;
  /** Called with the chart instance, to follow the pointer. */
  onChartReady?: (chart: unknown) => void;
  /** Which frame it sits in, which sets how much of a sheet is left for it. */
  variant?: 'analyze' | 'design';
  scale: AxisScale;
  series: TouchDesignSerie[];
  /** A flat rule drawn across the plot, e.g. zero on the front weight chart. */
  ruleAt?: number;
}

const serieStyleByVariant = (
  serie: TouchDesignSerie,
  tokens: ChartTokens,
): Record<string, unknown> => {
  switch (serie.variant) {
    case TouchDesignSerieVariant.DefaultBold:
      return {
        endLabel: {
          color: tokens.inkMuted,
          fontFamily: MONO_FONT,
          fontSize: 11,
          formatter: serie.name,
          offset: [6, 0],
          show: true,
        },
        lineStyle: { color: serie.color ?? tokens.seriesStandard, width: 1.5 },
        type: 'line',
      };
    case TouchDesignSerieVariant.Default:
      return {
        lineStyle: {
          color: serie.color ?? tokens.seriesStandardSoft,
          width: 1,
        },
        type: 'line',
      };
    case TouchDesignSerieVariant.Target:
      return {
        lineStyle: {
          cap: 'round',
          color: serie.color ?? tokens.seriesTarget,
          width: 4,
        },
        type: 'line',
        z: 5,
      };
    case TouchDesignSerieVariant.Measured:
      return {
        itemStyle: { color: serie.color ?? tokens.ink },
        symbol: 'circle',
        symbolSize: 5,
        type: 'scatter',
        z: 6,
      };
    case TouchDesignSerieVariant.Computed:
      return {
        itemStyle: { color: serie.color ?? tokens.inkMuted },
        symbol: 'diamond',
        symbolSize: 6,
        type: 'scatter',
        z: 6,
      };
    default:
      return { type: 'line' };
  }
};

/**
 * A chart whose horizontal axis is the keyboard itself.
 *
 * Points are placed at the physical centre of their key rather than at their
 * key number, so that a measurement sits above the back of the key it was
 * taken on — which
 * a linear axis over 88 numbers would miss by up to a third of a key.
 */
export const KeyboardChart = ({
  geometry,
  height,
  onChartReady,
  ruleAt,
  scale,
  series,
  variant = 'analyze',
}: KeyboardChartProps) => {
  const option = useRef<EChartsOption | null>(null);
  const {
    onChartReady: bindChart,
    plotHeight: boxHeight,
    tokens,
  } = usePrintableChart(
    variant,
    useScreenPlotHeight(height + PLOT_BOX_MARGIN, variant),
    option,
    onChartReady,
  );
  const plotHeight = boxHeight - PLOT_BOX_MARGIN;
  const { currentLanguage } = useTranslation();

  const nextOption = useMemo<EChartsOption>(() => {
    const echartsSeries = series.map((serie) => ({
      // Plotted over the balance rail, where the keys are evenly spaced: a
      // curve computed key by key is then drawn with an even stride, instead
      // of losing half its slope at every E–F and B–C.
      //
      // A point whose key is not on this keyboard has nowhere to stand; it is
      // left out rather than piled up against the first key.
      data: serie.data.flatMap((point) => {
        const place = geometry.keysByNumber.get(point.number)?.backCenter;
        return place === undefined ? [] : [[place, point.payload]];
      }),
      name: serie.name,
      showSymbol: false,
      silent: true,
      smooth: 0.3,
      ...serieStyleByVariant(serie, tokens),
    }));

    if (ruleAt !== undefined) {
      echartsSeries.push({
        data: [],
        markLine: {
          data: [{ yAxis: ruleAt }],
          label: { show: false },
          lineStyle: { color: tokens.axisStrong, type: 'solid', width: 1.2 },
          silent: true,
          symbol: 'none',
        },
        name: '',
        showSymbol: false,
        silent: true,
        smooth: 0,
        type: 'line',
      } as unknown as (typeof echartsSeries)[number]);
    }

    return {
      animation: false,
      grid: buildGrid(plotHeight),
      legend: { show: false },
      series: echartsSeries,
      tooltip: { show: false },
      xAxis: buildKeyAxis(geometry),
      yAxis: buildValueAxis(tokens, scale, currentLanguage),
    } as EChartsOption;
  }, [currentLanguage, geometry, plotHeight, ruleAt, scale, series, tokens]);

  // Kept for the print handler, which has to tell ECharts itself.
  useLayoutEffect(() => {
    option.current = nextOption;
  }, [nextOption]);

  return (
    <ReactECharts
      option={nextOption}
      notMerge
      onChartReady={bindChart}
      opts={SVG_RENDERER}
      style={{ height: boxHeight, width: '100%' }}
    />
  );
};
