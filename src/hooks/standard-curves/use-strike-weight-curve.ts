import { strikeWeightKeyPointsByLevel } from '@/lib/piano/touch-design/data/strike-weight';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { useCallback, useMemo } from 'react';
import { useInterpolatedSerieCubicSpline } from '../series/use-interpolated-serie-cubic-spline';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';

export const useStrikeWeightCurve = (
  keyboard: KeyboardLike<KeyWith<unknown>>,
): {
  getStrikeWeightCurve: (level: StrikeWeightLevel) => number[];
} => {
  const { generateCubicInterpolatedKeyboardSerie } =
    useInterpolatedSerieCubicSpline(keyboard);

  const smoothedStrikeWeightCurves: Map<StrikeWeightLevel, number[]> =
    useMemo(() => {
      return new Map(
        Object.values(StrikeWeightLevel).map((level) => {
          return [
            level,
            generateCubicInterpolatedKeyboardSerie(
              strikeWeightKeyPointsByLevel[level],
            ),
          ];
        }),
      );
    }, [generateCubicInterpolatedKeyboardSerie]);

  const getStrikeWeightCurve = useCallback(
    (level: StrikeWeightLevel) => {
      return smoothedStrikeWeightCurves.get(level)!;
    },
    [smoothedStrikeWeightCurves],
  );

  return { getStrikeWeightCurve };
};
