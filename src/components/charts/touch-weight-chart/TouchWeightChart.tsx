import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { useFrictionZonesSeries } from './hooks/use-friction-zones-series';
import { useTouchWeightSeries } from './hooks/use-touch-weight-series';
import type { SeriesOption } from 'echarts';
import { KeyColor } from '@/lib/piano/keyboard';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import { useTranslation } from '@/hooks/use-translation';

export interface TouchWeightChartProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
}

const getFrictionChartOptions = (
  frictionZonesSeries: SeriesOption[],
): { series: SeriesOption[] } => ({ series: frictionZonesSeries });

export const TouchWeightChart = (props: TouchWeightChartProps) => {
  const { analyzedKeyboard } = props;
  const { t } = useTranslation();
  const frictionZonesSeries = useFrictionZonesSeries();
  const { downWeight, balanceWeight, upWeight, frictionWeight, verticalLines } =
    useTouchWeightSeries(analyzedKeyboard);

  const maxDownWeight: number = useMemo(
    () => Math.max(...downWeight.map(([, dw]) => dw ?? 0), 60),
    [downWeight],
  );

  const frictionChartOptions = useMemo(
    () => getFrictionChartOptions(frictionZonesSeries),
    [frictionZonesSeries],
  );

  const toStyledDataItem = (value: [number, OptionalNumber]) => {
    const key = analyzedKeyboard.getKeyByNumber(value[0]);
    const itemStyle = key?.color === KeyColor.Black ? { color: '#333' } : {};

    return {
      itemStyle,
      value,
    };
  };

  const option = {
    grid: {
      left: 'left',
    },
    legend: {
      bottom: 20,
      data: [
        t('Down Weight'),
        t('Balance Weight'),
        t('Up Weight'),
        t('Friction Weight'),
        t('Zone'),
      ],
    },
    series: [
      {
        color: '#5470c6',
        data: downWeight.map(toStyledDataItem),
        name: t('Down Weight'),
        symbol: 'triangle',
        symbolRotate: 180,
        symbolSize: 10,
        type: 'scatter',
      },
      {
        color: '#5470c6',
        data: balanceWeight.map(toStyledDataItem),
        name: t('Balance Weight'),
        symbol: 'diamond',
        symbolSize: 12,
        type: 'scatter',
      },
      {
        color: '#5470c6',
        data: upWeight.map(toStyledDataItem),
        name: t('Up Weight'),

        symbol: 'triangle',
        symbolSize: 10,
        type: 'scatter',
      },
      {
        data: frictionWeight,
        itemStyle: {
          color: '#ea7ccc',
          opacity: 0.7,
        },
        name: t('Friction Weight'),
        symbolSize: 9,
        type: 'scatter',
      },
      {
        coordinateSystem: 'cartesian2d',
        data: verticalLines,
        lineStyle: {
          color: '#ccc',
          width: 1,
        },
        name: t('Weight Range'),
        silent: true,
        type: 'lines',
      },
      ...frictionChartOptions.series,
    ],
    title: {
      left: 'center',
      text: t('Static weight and Friction'),
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
      name: t('Note'),
      type: 'value',
    },
    yAxis: [
      {
        max: maxDownWeight,
        min: 0,
        name: t('Weight in Grams'),
        type: 'value',
      },
    ],
  };

  return (
    <div>
      <ReactECharts
        option={option}
        className="3xl:max-h-[85vh]"
        style={{
          aspectRatio: 1.5,
          height: 'auto',
          maxWidth: '100%',
        }}
        lazyUpdate={true}
      />
    </div>
  );
};
