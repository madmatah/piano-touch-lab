import { useKeyboard } from '@/hooks/use-keyboard';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

export enum TouchDesignSerieVariant {
  DefaultBold = 1,
  Default = 2,
  Target = 3,
  Measured = 4,
}

export interface TouchDesignSerie {
  name: string;
  data: Array<number | undefined>;
  variant?: TouchDesignSerieVariant;
  color?: string;
}

export interface TouchDesignChartProps {
  title: string;
  series: TouchDesignSerie[];
  yAxisName: string;
  chartHeight: number;
}

const getEchartSeriePropertiesByVariant = (
  variant: TouchDesignSerieVariant,
  color?: string,
): Partial<EChartsOption['series']> => {
  switch (variant) {
    case TouchDesignSerieVariant.DefaultBold:
      return {
        itemStyle: { color: color ?? 'rgba(255, 0, 0, 0.25)' },
      };
    case TouchDesignSerieVariant.Default:
      return {
        itemStyle: { color: color ?? 'rgba(0, 0, 0, 0.15)' },
      };
    case TouchDesignSerieVariant.Target:
      return {
        itemStyle: { color: color ?? 'rgba(0, 173, 87, 0.8)' },
        lineStyle: {
          width: 5,
        },
      };
    case TouchDesignSerieVariant.Measured:
      return {
        connectNulls: false,
        itemStyle: { color: color ?? 'rgba(0, 0, 255, 0.5)' },
        showSymbol: true,
        smooth: false,
        symbolSize: 6,
      };
    default:
      return {};
  }
};

export const TouchDesignChart = (props: TouchDesignChartProps) => {
  const { keyboard } = useKeyboard();

  const series = props.series.map((serie) => ({
    data: serie.data,
    name: serie.name,
    showSymbol: false,
    smooth: 0.3,
    type: 'line',
    ...getEchartSeriePropertiesByVariant(
      serie.variant ?? TouchDesignSerieVariant.Default,
      serie.color,
    ),
  }));

  const option = {
    animation: false,
    grid: {
      left: 'left',
    },
    legend: {
      data: props.series.map((serie) => serie.name),
    },
    series,
    title: {
      left: 'center',
      text: props.title,
    },
    tooltip: {
      axisPointer: {
        label: { formatter: 'Key {value}' },
      },
      trigger: 'axis',
      valueFormatter: (value: number) =>
        value !== undefined ? `${Math.round(value * 10) / 10} g` : '-',
    },
    xAxis: {
      axisLabel: {
        customValues: [
          ...Array(keyboard.size)
            .keys()
            .filter((i) => i == 0 || (i + 1) % 5 === 0 || i == 87),
        ],
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisTick: { alignWithLabel: true },
      data: [...keyboard.mapToArray((key) => `${key.number}`)],
      name: 'Key Number',
      type: 'category',
    },
    yAxis: { name: props.yAxisName, type: 'value' },
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: props.chartHeight }}
      lazyUpdate={true}
    />
  );
};
