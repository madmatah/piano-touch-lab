import { useCallback, useMemo } from 'react';
import { useInterpolatedSerieCubicSpline } from '../series/use-interpolated-serie-cubic-spline';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { generateCustomFrontWeightKeypoints } from '@/lib/piano/touch-design/generate-custom-front-weight-keypoints';

export const useFrontWeightCurve = (
  keyboard: KeyboardLike<KeyWith<unknown>>,
): {
  getFrontWeightCurve: (level: number) => number[];
} => {
  const { generateCubicInterpolatedKeyboardSerie } =
    useInterpolatedSerieCubicSpline(keyboard);

  const smoothedFrontWeightCurves: Map<number, number[]> = useMemo(() => {
    return new Map(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((level) => {
        return [
          level,
          generateCubicInterpolatedKeyboardSerie(
            generateCustomFrontWeightKeypoints(Number(level)),
          ),
        ];
      }),
    );
  }, [generateCubicInterpolatedKeyboardSerie]);

  const getFrontWeightCurve = useCallback(
    (level: number) => {
      return smoothedFrontWeightCurves.get(level)!;
    },
    [smoothedFrontWeightCurves],
  );

  return { getFrontWeightCurve };
};
