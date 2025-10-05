import {
  FrontWeightLevel,
  frontWeightLevelToNumber,
} from '@/lib/piano/touch-design/front-weight-level';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useMemo } from 'react';
import { useDefaultSerie } from './use-default-serie';
import { useFrontWeightCurve } from '@/hooks/standard-curves/use-front-weight-curve';

export const useFrontWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: FrontWeightLevel[],
) => {
  const { getFrontWeightCurve } = useFrontWeightCurve(keyboard);

  const frontWeightLevelSmoothedSeries = useMemo(() => {
    const entries = levels.map((level) => {
      return [level, getFrontWeightCurve(frontWeightLevelToNumber(level))];
    });
    return Object.fromEntries(entries) as Record<FrontWeightLevel, number[]>;
  }, [levels, getFrontWeightCurve]);

  const seriesWithBoldVariant = useMemo(
    () => [
      FrontWeightLevel.Level5,
      FrontWeightLevel.Level7,
      FrontWeightLevel.Level9,
    ],
    [],
  );

  const defaultSeries = useDefaultSerie(
    keyboard,
    levels,
    seriesWithBoldVariant,
    frontWeightLevelSmoothedSeries,
  );

  return defaultSeries;
};
