import { keyboardLength } from '@/lib/constants';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

export enum TouchDesignSerieVariant {
  DefaultBold = 1,
  Default = 2,
  Target = 3,
}

export interface TouchDesignSerie {
  name: string;
  data: Array<number | undefined>;
  variant?: TouchDesignSerieVariant;
}

export interface TouchDesignChartProps {
  series: TouchDesignSerie[];
  yAxisName: string;
}

const getEchartSeriePropertiesByVariant = (
  variant: TouchDesignSerieVariant,
): Partial<EChartsOption['series']> => {
  switch (variant) {
    case TouchDesignSerieVariant.DefaultBold:
      return {
        itemStyle: { color: 'rgba(255, 0, 0, 0.5)' },
      };
    case TouchDesignSerieVariant.Default:
      return {
        itemStyle: { color: 'rgba(0, 0, 0, 0.2)' },
      };
    case TouchDesignSerieVariant.Target:
      return {
        itemStyle: { color: 'rgba(0, 255, 0, 0.5)' },
      };
    default:
      return {};
  }
};

export const TouchDesignChart = (props: TouchDesignChartProps) => {
  const series = props.series.map((serie) => ({
    data: serie.data,
    name: serie.name,
    showSymbol: false,
    smooth: 0.3,
    type: 'line',
    ...getEchartSeriePropertiesByVariant(
      serie.variant ?? TouchDesignSerieVariant.Default,
    ),
  }));

  const option = {
    animation: false,
    legend: {
      data: props.series.map((serie) => serie.name),
    },
    series,
    tooltip: {
      axisPointer: {
        label: { formatter: 'Key {value}' },
      },
      trigger: 'axis',
      valueFormatter: (value: number) => `${Math.round(value * 10) / 10} g`,
    },
    xAxis: {
      axisLabel: {
        customValues: [
          ...Array(keyboardLength)
            .keys()
            .filter((i) => i == 0 || (i + 1) % 5 === 0 || i == 87),
        ],
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisTick: { alignWithLabel: true },
      data: [
        ...Array(keyboardLength)
          .keys()
          .map((i) => `${i + 1}`),
      ],
      name: 'Key Number',
      type: 'category',
    },
    yAxis: { name: props.yAxisName, type: 'value' },
  };

  return (
    <ReactECharts option={option} style={{ height: 800 }} lazyUpdate={true} />
  );
};
