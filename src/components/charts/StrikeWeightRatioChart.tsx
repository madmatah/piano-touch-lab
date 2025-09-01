import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useGenerateSerie } from './hooks/use-generate-serie';

type KeyWithStrikeWeightRatio<T> = T &
  Pick<TouchWeightKeyAnalysis, 'strikeWeightRatio'>;

export interface StrikeWeightRatioChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeightRatio<T>>>;
}

export const StrikeWeightRatioChart = <T,>(
  props: StrikeWeightRatioChartProps<T>,
) => {
  const { keyboard } = props;

  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.strikeWeightRatio,
        'Strike Weight Ratio',
        TouchDesignSerieVariant.Measured,
        {
          sharpItemStyle: {
            color: '#333',
          },
        },
      ),
    [generateSerie],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(measuredSerie),
    [isSerieEmpty, measuredSerie],
  );

  return (
    <TouchDesignChart
      title="Strike Weight Ratio"
      series={!isEmpty ? [measuredSerie] : []}
      yAxisName="Strike Weight Ratio"
    />
  );
};
