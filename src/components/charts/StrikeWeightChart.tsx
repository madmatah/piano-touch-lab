import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useKeyboardSerie } from './hooks/use-keyboard-serie';
import { useStrikeWeightStandardSeries } from './hooks/use-strike-weight-standard-series';

type KeyWithStrikeWeight<T> = T & Pick<MeasuredKeyRequirements, 'strikeWeight'>;

export interface StrikeWeightChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeight<T>>>;
  defaultHammerWeightLevelsToInclude?: StrikeWeightLevel[];
}

export const StrikeWeightChart = <T,>(props: StrikeWeightChartProps<T>) => {
  const { keyboard } = props;

  const { serie: measuredSerie, isEmpty } = useKeyboardSerie(
    keyboard,
    (key) => key.payload.strikeWeight,
    'Strike Weight',
    {
      sharpItemStyle: {
        color: '#333',
      },
      variant: TouchDesignSerieVariant.Measured,
    },
  );

  const defaultSeriesToInclude = props.defaultHammerWeightLevelsToInclude ?? [
    StrikeWeightLevel.Level1,
    StrikeWeightLevel.Level2,
    StrikeWeightLevel.Level3,
    StrikeWeightLevel.Level4,
    StrikeWeightLevel.Level5,
    StrikeWeightLevel.Level6,
    StrikeWeightLevel.Level7,
    StrikeWeightLevel.Level8,
    StrikeWeightLevel.Level9,
    StrikeWeightLevel.Level10,
    StrikeWeightLevel.Level11,
    StrikeWeightLevel.Level12,
    StrikeWeightLevel.Level13,
  ];

  const defaultSeries = useStrikeWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  const series: TouchDesignSerie[] = [
    ...defaultSeries,
    ...(!isEmpty ? [measuredSerie] : []),
  ];

  return (
    <TouchDesignChart
      title="Strike Weight"
      series={series}
      yAxisName="Strike Weight"
    />
  );
};
