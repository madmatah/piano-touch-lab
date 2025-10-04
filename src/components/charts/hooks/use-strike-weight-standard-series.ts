import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useDefaultSerie } from './use-default-serie';
import { useStrikeWeightCurve } from '@/hooks/standard-curves/use-strike-weight-curve';

export const useStrikeWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: StrikeWeightLevel[],
) => {
  const { getStrikeWeightCurve } = useStrikeWeightCurve(keyboard);

  const strikeWeightLevelSmoothedSeries = useMemo(() => {
    const entries = levels.map((level) => {
      return [level, getStrikeWeightCurve(level)];
    });
    return Object.fromEntries(entries) as Record<StrikeWeightLevel, number[]>;
  }, [levels, getStrikeWeightCurve]);

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
    strikeWeightLevelSmoothedSeries,
  );

  return defaultSeries;
};
