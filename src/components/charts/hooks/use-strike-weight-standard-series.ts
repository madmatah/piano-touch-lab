import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { strikeWeightData } from '@/lib/piano/touch-design/data/strike-weight';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useDefaultSerie } from './use-default-serie';

export const useStrikeWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: StrikeWeightLevel[],
) => {
  const strikeWeightSeriesMap = useMemo(() => strikeWeightData, []);
  const seriesWithBoldVariant = useMemo(
    () => [
      StrikeWeightLevel.Level1,
      StrikeWeightLevel.Level5,
      StrikeWeightLevel.Level9,
      StrikeWeightLevel.Level13,
    ],
    [],
  );
  const defaultSeries = useDefaultSerie(
    keyboard,
    levels,
    seriesWithBoldVariant,
    strikeWeightSeriesMap,
  );

  return defaultSeries;
};
