import type { TouchWeightKeyData } from '@/lib/touch-design/touch-weight-data.requirements';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { useFrictionZonesSeries } from './hooks/use-friction-zones-series';
import { useTouchWeightSeries } from './hooks/use-touch-weight-series';
import type { SeriesOption } from 'echarts';

export interface TouchWeightChartProps {
  keysData: TouchWeightKeyData[];
}

const getFrictionChartOptions = (
  frictionZonesSeries: SeriesOption[],
): { series: SeriesOption[] } => ({ series: frictionZonesSeries });

export const TouchWeightChart = (props: TouchWeightChartProps) => {
  const shouldRender = props.keysData.some((key) => key.balanceWeight !== null);

  const frictionZonesSeries = useFrictionZonesSeries();
  const { downWeight, balanceWeight, upWeight, frictionWeight, verticalLines } =
    useTouchWeightSeries(props.keysData);

  const frictionChartOptions = useMemo(
    () => getFrictionChartOptions(frictionZonesSeries),
    [frictionZonesSeries],
  );

  const option = {
    legend: {
      bottom: 20,
      data: [
        'Down Weight',
        'Balance Weight',
        'Up Weight',
        'Friction Weight',
        'Zone',
      ],
    },
    series: [
      {
        data: downWeight,
        name: 'Down Weight',
        symbol: 'triangle',
        symbolRotate: 180,
        type: 'scatter',
      },
      {
        data: balanceWeight,
        name: 'Balance Weight',
        symbol: 'diamond',
        type: 'scatter',
      },
      {
        data: upWeight,
        name: 'Up Weight',
        symbol: 'triangle',
        type: 'scatter',
      },
      {
        data: frictionWeight,
        itemStyle: {
          color: 'rgba(165, 0, 186, 0.8)',
        },
        name: 'Friction Weight',
        showSymbol: false,
        type: 'scatter',
      },
      {
        coordinateSystem: 'cartesian2d',
        data: verticalLines,
        lineStyle: {
          color: '#ccc',
          width: 1,
        },
        name: 'Weight Range',
        silent: true,
        type: 'lines',
      },
      ...frictionChartOptions.series,
    ],
    title: {
      left: 'center',
      text: 'Touch Weight',
    },
    tooltip: {
      axisPointer: {
        label: {
          formatter: (params: { value: number }) =>
            `Key #${Math.round(params.value)}`,
        },
      },
      trigger: 'axis',
      valueFormatter: (value: number) =>
        value !== null ? `${Math.round(value * 10) / 10} g` : '-',
    },
    xAxis: {
      max: 88,
      min: 0,
      name: 'Note',
      type: 'value',
    },
    yAxis: [
      {
        min: 0,
        name: 'Weight in Grams',
        type: 'value',
      },
    ],
  };

  return shouldRender ? (
    <ReactECharts option={option} style={{ height: 800 }} lazyUpdate={true} />
  ) : null;
};
