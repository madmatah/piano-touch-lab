import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import {
  TouchDesignChart,
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from './TouchDesignChart';

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
