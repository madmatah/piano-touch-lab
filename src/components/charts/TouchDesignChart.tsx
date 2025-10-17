import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
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
  Computed = 5,
}

export interface TouchDesignChartProps {
  title: string;
  series: TouchDesignSerie[];
  yAxisName: string;
}

const getEchartSeriePropertiesByVariant = (
  serie: TouchDesignSerie,
): Partial<EChartsOption['series']> => {
  const { variant, color, name } = serie;
  switch (variant) {
    case TouchDesignSerieVariant.DefaultBold:
      return {
        itemStyle: { color: color ?? 'rgba(255, 0, 0, 0.25)' },
        markLine: {
          data: [
            {
              xAxis: 'min',
              yAxis: serie.data[0]?.payload ?? 'max',
            },
          ],
          label: {
            color: color ?? 'rgba(255, 0, 0, 0.8)',
            fontSize: 11,
            formatter: name,
            offset: [0, 0],
            position: 'start',
            show: true,
          },
          lineStyle: {
            color: 'transparent',
            width: 0,
          },
          silent: true,
          symbol: 'none',
        },
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
        itemStyle: { color: color ?? 'rgba(0, 0, 255, 0.5)' },
        symbol: 'circle',
        symbolSize: 8,
        type: 'scatter',
      };
    case TouchDesignSerieVariant.Computed:
      return {
        itemStyle: {
          color: color ?? 'rgba(0, 0, 0, 0.15)',
        },
        symbol: 'diamond',
        symbolSize: 8,
        type: 'scatter',
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
    ...getEchartSeriePropertiesByVariant(serie),
  }));

  const option = {
    animation: false,
    grid: {
      left: 40,
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
        value !== undefined ? `${Math.round(value * 10) / 10}` : '-',
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
      className="3xl:max-h-[85vh]"
      style={{
        aspectRatio: 1.5,
        height: 'auto',
        maxWidth: '100%',
      }}
      lazyUpdate={true}
    />
  );
};
