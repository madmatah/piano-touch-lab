import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { useMemo } from 'react';

export interface TouchWeightSeries {
  balanceWeight: [number, OptionalNumber][];
  downWeight: [number, OptionalNumber][];
  frictionWeight: [number, OptionalNumber][];
  upWeight: [number, OptionalNumber][];
  verticalLines: { coords: [number, OptionalNumber][] }[];
}

export const useTouchWeightSeries = (
  analyzedKeyboard: TouchWeightAnalyzedKeyboard,
): TouchWeightSeries => {
  return useMemo(() => {
    const downWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [key.number, key.payload.downWeightWithoutSpringSupport],
    );

    const balanceWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [key.number, key.payload.balanceWeight],
    );

    const upWeight = analyzedKeyboard.mapToArray<[number, OptionalNumber]>(
      (key) => [key.number, key.payload.upWeight],
    );

    const frictionWeight = analyzedKeyboard.mapToArray<
      [number, OptionalNumber]
    >((key) => [key.number, key.payload.frictionWeight]);

    const verticalLines = analyzedKeyboard.mapToArray<{
      coords: [number, OptionalNumber][];
    }>((key) => ({
      coords: [
        [key.number, key.payload.upWeight],
        [key.number, key.payload.downWeightWithoutSpringSupport],
      ],
    }));

    return {
      balanceWeight,
      downWeight,
      frictionWeight,
      upWeight,
      verticalLines,
    };
  }, [analyzedKeyboard]);
};
