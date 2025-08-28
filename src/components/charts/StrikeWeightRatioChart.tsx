import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';

export interface StrikeWeightRatioChartProps {
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
  chartHeight: number;
}

export const StrikeWeightRatioChart = (props: StrikeWeightRatioChartProps) => {
  const { analyzedKeyboard } = props;

  const strikeWeightRatio = analyzedKeyboard.mapToArray<number | undefined>(
    (key) => key.payload.strikeWeightRatio ?? undefined,
  );

  const series: TouchDesignSerie[] = [
    {
      data: strikeWeightRatio,
      name: 'Strike Weight Ratio',
      sharpItemStyle: {
        color: '#333',
      },
      variant: TouchDesignSerieVariant.Measured,
    },
  ];

  return (
    <TouchDesignChart
      title="Strike Weight Ratio"
      chartHeight={props.chartHeight}
      series={series}
      yAxisName="Strike Weight Ratio"
    />
  );
};
