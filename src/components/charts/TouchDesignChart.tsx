import { useKeyboard } from '@/hooks/use-keyboard';
import { KeyColor } from '@/lib/piano/keyboard';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { TouchDesignSerie } from './interfaces';
import { useTranslation } from '@/hooks/use-translation';

export enum TouchDesignSerieVariant {
  DefaultBold = 1,
  Default = 2,
  Target = 3,
  Measured = 4,
}

export interface TouchDesignChartProps {
  title: string;
  series: TouchDesignSerie[];
  yAxisName: string;
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

const generateSerieData = (serie: TouchDesignSerie) => {
  const sharpItemStyle = serie.sharpItemStyle ?? {};
  const flatItemStyle = serie.flatItemStyle ?? {};

  return serie.data.map((key) => {
    return {
      itemStyle: key?.color === KeyColor.Black ? sharpItemStyle : flatItemStyle,
      value: [key.number, key.payload],
    };
  });
};

export const TouchDesignChart = (props: TouchDesignChartProps) => {
  const { keyboard } = useKeyboard();
  const { t } = useTranslation();
  const series = props.series.map((serie) => ({
    data: generateSerieData(serie),
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
        label: {
          formatter: ({ value }: { value: number }) => {
            const key = keyboard.getKeyByNumber(parseInt(value.toString()));
            return `Key #${value} (${key?.name})`;
          },
        },
      },
      trigger: 'axis',
      valueFormatter: (value: number) =>
        value !== undefined ? `${Math.round(value * 10) / 10} g` : '-',
    },
    xAxis: {
      axisLabel: {
        customValues: [
          ...keyboard
            .mapToArray((key) => key.number)
            .filter((i) => i == 1 || i % 5 === 0 || i == keyboard.size),
        ],
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisTick: { alignWithLabel: true },
      data: [0, ...keyboard.mapToArray((key) => key.number)],
      max: keyboard.size,
      min: 1,
      name: t('Key Number'),
      type: 'category',
    },
    yAxis: { name: props.yAxisName, type: 'value' },
  };

  return (
    <ReactECharts
      option={option}
      style={{ aspectRatio: 1.5, height: 'auto' }}
      lazyUpdate={true}
    />
  );
};
