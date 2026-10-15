import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

import {
  buildGrid,
  buildKeyAxis,
  buildValueAxis,
  MONO_FONT,
  type AxisScale,
} from './echarts/build-base-option';
import { useChartTokens, type ChartTokens } from './hooks/use-chart-tokens';
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
 * key number, so that a measurement sits above the key it was taken on — which
 * a linear axis over 88 numbers would miss by up to a third of a key.
 */
export const KeyboardChart = ({
  geometry,
  height,
  onChartReady,
  ruleAt,
  scale,
  series,
}: KeyboardChartProps) => {
  const tokens = useChartTokens();
  const { currentLanguage } = useTranslation();

  const option = useMemo<EChartsOption>(() => {
    const echartsSeries = series.map((serie) => ({
      data: serie.data.map((point) => [
        geometry.keysByNumber.get(point.number)?.center ?? 0,
        point.payload,
      ]),
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
      grid: buildGrid(height),
      legend: { show: false },
      series: echartsSeries,
      tooltip: { show: false },
      xAxis: buildKeyAxis(geometry),
      yAxis: buildValueAxis(tokens, scale, currentLanguage),
    } as EChartsOption;
  }, [currentLanguage, geometry, height, ruleAt, scale, series, tokens]);

  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      onChartReady={onChartReady}
      style={{ height: height + 20, width: '100%' }}
    />
  );
};
