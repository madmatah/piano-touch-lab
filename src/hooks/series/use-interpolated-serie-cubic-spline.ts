import { useNamedInjection } from '@/hooks/use-named-injection';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useCallback } from 'react';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';

export const useInterpolatedSerieCubicSpline = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
): {
  generateCubicInterpolatedKeyboardSerie: (
    keypoints: Map<number, number>,
  ) => number[];
  interpolateStandardKeypointsToKeyboardSize: (
    keypoints: Map<number, number>,
  ) => Map<number, number>;
} => {
  const cubicSplineSmoother = useNamedInjection<
    CurveSmootherRequirements<undefined>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.CubicSpline);

  const interpolateStandardKeypointsToKeyboardSize = useCallback(
    (keypoints: Map<number, number>): Map<number, number> => {
      return new Map(
        keypoints.entries().map(([index, keypoint]) => {
          const interpolatedIndex =
            1 + Math.round(((index - 1) * (keyboard.size - 1)) / 87);
          return [interpolatedIndex, keypoint];
        }),
      );
    },
    [keyboard.size],
  );

  const generateCubicInterpolatedKeyboardSerie = useCallback(
    (keypoints: Map<number, number>): number[] => {
      const keyPointsInputData = keyboard.mapToArray((key) => {
        return keypoints.get(key.number);
      });

      const interpolatedSerie = cubicSplineSmoother.smoothCurve(
        keyPointsInputData,
        undefined,
      );

      return interpolatedSerie;
    },
    [keyboard, cubicSplineSmoother],
  );

  return {
    generateCubicInterpolatedKeyboardSerie,
    interpolateStandardKeypointsToKeyboardSize,
  };
};
