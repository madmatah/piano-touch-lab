import type { TouchWeightKeyData } from '@/lib/piano/touch-design/touch-weight-data.requirements';
import {
  TouchDesignChart,
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from './TouchDesignChart';

export interface StrikeWeightRatioChartProps {
  keysData: TouchWeightKeyData[];
  chartHeight: number;
}

export const StrikeWeightRatioChart = (props: StrikeWeightRatioChartProps) => {
  const strikeWeightRatio = props.keysData.map<number | undefined>(
    (key) => key.strikeWeightRatio ?? undefined,
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
