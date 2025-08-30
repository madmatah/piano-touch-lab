import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';

import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useKeyboardSerie } from './hooks/use-keyboard-serie';
import { useFrontWeightStandardSeries } from './hooks/use-front-weight-standard-series';

type KeyWithFrontWeight<T> = T & Pick<MeasuredKeyRequirements, 'frontWeight'>;

export interface FrontWeightChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithFrontWeight<T>>>;
  defaultFrontWeightLevelsToInclude?: FrontWeightLevel[];
}

export const FrontWeightChart = <T,>(props: FrontWeightChartProps<T>) => {
  const { keyboard } = props;
  const { serie: measuredSerie, isEmpty } = useKeyboardSerie(
    keyboard,
    (key) => key.payload.frontWeight,
    'Front Weight',
    {
      sharpItemStyle: {
        color: '#333',
      },
      variant: TouchDesignSerieVariant.Measured,
    },
  );

  const defaultSeriesToInclude = props.defaultFrontWeightLevelsToInclude ?? [
    FrontWeightLevel.Level5,
    FrontWeightLevel.Level6,
    FrontWeightLevel.Level7,
    FrontWeightLevel.Level8,
    FrontWeightLevel.Level9,
  ];

  const defaultSeries = useFrontWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  const series: TouchDesignSerie[] = [
    ...defaultSeries,
    ...(!isEmpty ? [measuredSerie] : []),
  ].filter((serie) => serie !== undefined);

  return (
    <TouchDesignChart
      title="Front Weight"
      series={series}
      yAxisName="Front Weight"
    />
  );
};
