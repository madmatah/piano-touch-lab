import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useStrikeWeightStandardSeries } from './hooks/use-strike-weight-standard-series';
import { useMemo } from 'react';
import { useGenerateSerie } from './hooks/use-generate-serie';

type KeyWithStrikeWeight<T> = T & Pick<MeasuredKeyRequirements, 'strikeWeight'>;

export interface StrikeWeightChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeight<T>>>;
  defaultHammerWeightLevelsToInclude?: StrikeWeightLevel[];
  targetSerie?: TouchDesignSerie;
}

export const StrikeWeightChart = <T,>(props: StrikeWeightChartProps<T>) => {
  const { keyboard } = props;

  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.strikeWeight,
        'Strike Weight',
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

  const defaultSeries: TouchDesignSerie[] = useStrikeWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  const series: TouchDesignSerie[] = useMemo(
    () => [
      ...defaultSeries,
      ...(props.targetSerie ? [props.targetSerie] : []),
      ...(!isEmpty ? [measuredSerie] : []),
    ],
    [defaultSeries, props.targetSerie, isEmpty, measuredSerie],
  );

  return (
    <TouchDesignChart
      title="Strike Weight"
      series={series}
      yAxisName="Strike Weight"
    />
  );
};
