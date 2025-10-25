import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { useTranslation } from '@/hooks/use-translation';
import type { TouchDesignSerie } from './interfaces';

type KeyWithStrikeWeightRatio<T> = T &
  Pick<
    TouchWeightKeyAnalysis,
    | 'strikeWeightRatio'
    | 'computedStrikeWeightRatio'
    | 'measuredStrikeWeightRatio'
  >;

export interface StrikeWeightRatioChartProps<T> {
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeightRatio<T>>>;
  targetSerie?: TouchDesignSerie;
  displayBothManualAndComputed: boolean;
}

export const StrikeWeightRatioChart = <T,>(
  props: StrikeWeightRatioChartProps<T>,
) => {
  const { keyboard } = props;
  const { t } = useTranslation();
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);

  const defaultSerieOptions = useMemo(() => {
    return {
      sharpItemStyle: {
        color: '#333',
      },
    };
  }, []);

  const analyzedSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.strikeWeightRatio,
        t('Computed Strike Weight Ratio'),
        TouchDesignSerieVariant.Measured,
        defaultSerieOptions,
      ),
    [generateSerie, t, defaultSerieOptions],
  );

  const manualMeasuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.measuredStrikeWeightRatio,
        t('Measured Strike Weight Ratio'),
        TouchDesignSerieVariant.Measured,
        defaultSerieOptions,
      ),
    [generateSerie, t, defaultSerieOptions],
  );

  const computedSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.computedStrikeWeightRatio,
        t('Computed Strike Weight Ratio'),
        TouchDesignSerieVariant.Computed,
        {
          sharpItemStyle: {
            color: '#666',
          },
        },
      ),
    [generateSerie, t],
  );

  const isEmpty = useMemo(
    () => isSerieEmpty(analyzedSerie),
    [isSerieEmpty, analyzedSerie],
  );

  const isManualEmpty = useMemo(
    () => isSerieEmpty(manualMeasuredSerie),
    [isSerieEmpty, manualMeasuredSerie],
  );

  const isComputedEmpty = useMemo(
    () => isSerieEmpty(computedSerie),
    [isSerieEmpty, computedSerie],
  );

  const series: TouchDesignSerie[] = useMemo(() => {
    const baseSeries = [...(props.targetSerie ? [props.targetSerie] : [])];

    if (props.displayBothManualAndComputed) {
      return [
        ...baseSeries,
        ...(!isManualEmpty ? [manualMeasuredSerie] : []),
        ...(!isComputedEmpty ? [computedSerie] : []),
      ];
    } else {
      return [...baseSeries, ...(!isEmpty ? [analyzedSerie] : [])];
    }
  }, [
    analyzedSerie,
    computedSerie,
    isComputedEmpty,
    isEmpty,
    isManualEmpty,
    manualMeasuredSerie,
    props.displayBothManualAndComputed,
    props.targetSerie,
  ]);

  return (
    <TouchDesignChart
      title={t('Strike Weight Ratio')}
      series={series}
      yAxisName={t('Strike Weight Ratio')}
    />
  );
};
