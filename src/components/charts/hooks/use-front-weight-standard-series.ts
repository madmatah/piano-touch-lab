import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';
import { frontWeightData } from '@/lib/piano/touch-design/data/front-weights';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useDefaultSerie } from './use-default-serie';

export const useFrontWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: FrontWeightLevel[],
) => {
  const seriesWithBoldVariant = useMemo(
    () => [
      FrontWeightLevel.Level5,
      FrontWeightLevel.Level7,
      FrontWeightLevel.Level9,
    ],
    [],
  );
  const frontWeightSeriesMap = useMemo(() => frontWeightData, []);

  const defaultSeries = useDefaultSerie(
    keyboard,
    levels,
    seriesWithBoldVariant,
    frontWeightSeriesMap,
  );

  return defaultSeries;
};
