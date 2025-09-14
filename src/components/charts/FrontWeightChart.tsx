import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';

import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useFrontWeightStandardSeries } from './hooks/use-front-weight-standard-series';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';

type KeyWithFrontWeight<T> = T & Pick<MeasuredKeyRequirements, 'frontWeight'>;

export interface FrontWeightChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithFrontWeight<T>>>;
  defaultFrontWeightLevelsToInclude?: FrontWeightLevel[];
  targetSerie?: TouchDesignSerie;
}

export const FrontWeightChart = <T,>(props: FrontWeightChartProps<T>) => {
  const { keyboard } = props;
  const { t } = useTranslation();
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.frontWeight,
        t('Front Weight'),
        TouchDesignSerieVariant.Measured,
        {
          sharpItemStyle: {
            color: '#333',
          },
        },
      ),
    [generateSerie, t],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(measuredSerie),
    [isSerieEmpty, measuredSerie],
  );

  const defaultSeriesToInclude = useMemo(
    () =>
      props.defaultFrontWeightLevelsToInclude ?? [
        FrontWeightLevel.Level5,
        FrontWeightLevel.Level6,
        FrontWeightLevel.Level7,
        FrontWeightLevel.Level8,
        FrontWeightLevel.Level9,
      ],
    [props.defaultFrontWeightLevelsToInclude],
  );

  const defaultSeries = useFrontWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  const series: TouchDesignSerie[] = useMemo(
    () =>
      [
        ...defaultSeries,
        ...(props.targetSerie ? [props.targetSerie] : []),
        ...(!isEmpty ? [measuredSerie] : []),
      ].filter((serie) => serie !== undefined),
    [defaultSeries, props.targetSerie, isEmpty, measuredSerie],
  );

  return (
    <TouchDesignChart
      title={t('Front Weight')}
      series={series}
      yAxisName={t('Front Weight')}
    />
  );
};
