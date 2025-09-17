import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { useTranslation } from '@/hooks/use-translation';
import type { TouchDesignSerie } from './interfaces';

type KeyWithStrikeWeightRatio<T> = T &
  Pick<TouchWeightKeyAnalysis, 'strikeWeightRatio'>;

export interface StrikeWeightRatioChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeightRatio<T>>>;
  targetSerie?: TouchDesignSerie;
}

export const StrikeWeightRatioChart = <T,>(
  props: StrikeWeightRatioChartProps<T>,
) => {
  const { keyboard } = props;
  const { t } = useTranslation();
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.strikeWeightRatio,
        t('Strike Weight Ratio'),
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
    () => [
      ...(props.targetSerie ? [props.targetSerie] : []),
      ...(!isEmpty ? [measuredSerie] : []),
    ],
    [props.targetSerie, isEmpty, measuredSerie],
  );

  return (
    <TouchDesignChart
      title={t('Strike Weight Ratio')}
      series={series}
      yAxisName={t('Strike Weight Ratio')}
    />
  );
};
