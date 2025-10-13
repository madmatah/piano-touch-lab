import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

type KeyWithSupportSpringBalanceWeight<T> = T &
  Pick<TouchWeightKeyAnalysis, 'supportSpringBalanceWeight'>;

export interface SupportSpringBalanceWeightChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithSupportSpringBalanceWeight<T>>>;
  targetSerie?: TouchDesignSerie;
}

export const SupportSpringBalanceWeightChart = <T,>(
  props: SupportSpringBalanceWeightChartProps<T>,
) => {
  const { keyboard } = props;
  const { t } = useTranslation();
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.supportSpringBalanceWeight,
        t('Support Spring Balance Weight'),
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

  const series: TouchDesignSerie[] = useMemo(
    () =>
      [
        ...(props.targetSerie ? [props.targetSerie] : []),
        ...(!isEmpty ? [measuredSerie] : []),
      ].filter((serie) => serie !== undefined),
    [props.targetSerie, isEmpty, measuredSerie],
  );

  return (
    <TouchDesignChart
      title={t('Support Spring Balance Weight')}
      series={series}
      yAxisName={t('Support Spring Balance Weight')}
    />
  );
};
