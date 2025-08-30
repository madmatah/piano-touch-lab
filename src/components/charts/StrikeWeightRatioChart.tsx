import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useKeyboardSerie } from './hooks/use-keyboard-serie';

type KeyWithStrikeWeightRatio<T> = T &
  Pick<TouchWeightKeyAnalysis, 'strikeWeightRatio'>;

export interface StrikeWeightRatioChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeightRatio<T>>>;
}

export const StrikeWeightRatioChart = <T,>(
  props: StrikeWeightRatioChartProps<T>,
) => {
  const { keyboard } = props;

  const { serie: measuredSerie, isEmpty } = useKeyboardSerie(
    keyboard,
    (key) => key.payload.strikeWeightRatio,
    'Strike Weight Ratio',
    {
      sharpItemStyle: {
        color: '#333',
      },
      variant: TouchDesignSerieVariant.Measured,
    },
  );

  return (
    <TouchDesignChart
      title="Strike Weight Ratio"
      series={!isEmpty ? [measuredSerie] : []}
      yAxisName="Strike Weight Ratio"
    />
  );
};
