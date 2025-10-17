import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useCallback, useMemo } from 'react';

export interface TouchWeightSeries {
  balanceWeight: [number, OptionalNumber][];
  downWeight: [number, OptionalNumber][];
  frictionWeight: [number, OptionalNumber][];
  upWeight: [number, OptionalNumber][];
  verticalLines: { coords: [number, OptionalNumber][] }[];
}

export const useTouchWeightSeries = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
  useSupportSpringMeasurements = true,
): TouchWeightSeries => {
  const computeWeightReducedWithSpringSupport = useCallback(
    (weight: OptionalNumber, supportSpringBalanceWeight: OptionalNumber) => {
      const weightToReduce = useSupportSpringMeasurements
        ? (supportSpringBalanceWeight ?? 0)
        : 0;
      return weight ? weight - weightToReduce : null;
    },
    [useSupportSpringMeasurements],
  );

  return useMemo(() => {
    const downWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [
        key.number,
        computeWeightReducedWithSpringSupport(
          key.payload.downWeightWithoutSpringSupport,
          key.payload.supportSpringBalanceWeight,
        ),
      ],
    );

    const balanceWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [
        key.number,
        computeWeightReducedWithSpringSupport(
          key.payload.balanceWeight,
          key.payload.supportSpringBalanceWeight,
        ),
      ],
    );

    const upWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [
        key.number,
        computeWeightReducedWithSpringSupport(
          key.payload.upWeight,
          key.payload.supportSpringBalanceWeight,
        ),
      ],
    );

    const frictionWeight = analyzedKeyboard.mapToArray<
      [number, OptionalNumber]
    >((key) => [key.number, key.payload.frictionWeight]);

    const verticalLines = analyzedKeyboard.mapToArray<{
      coords: [number, OptionalNumber][];
    }>((key) => ({
      coords: [
        [
          key.number,
          computeWeightReducedWithSpringSupport(
            key.payload.upWeight,
            key.payload.supportSpringBalanceWeight,
          ),
        ],
        [
          key.number,
          computeWeightReducedWithSpringSupport(
            key.payload.downWeightWithoutSpringSupport,
            key.payload.supportSpringBalanceWeight,
          ),
        ],
      ],
    }));

    return {
      balanceWeight,
      downWeight,
      frictionWeight,
      upWeight,
      verticalLines,
    };
  }, [analyzedKeyboard, computeWeightReducedWithSpringSupport]);
};
