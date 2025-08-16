import type { OptionalNumber } from '@/lib/touch-design/measure-requirements';
import type { TouchWeightKeyData } from '@/lib/touch-design/touch-weight-data.requirements';
import { useMemo } from 'react';

export interface TouchWeightSeries {
  downWeight: [number, OptionalNumber][];
  balanceWeight: [number, OptionalNumber][];
  upWeight: [number, OptionalNumber][];
  frictionWeight: [number, OptionalNumber][];
  verticalLines: { coords: [number, OptionalNumber][] }[];
}

export const useTouchWeightSeries = (
  keysData: TouchWeightKeyData[],
): TouchWeightSeries => {
  return useMemo(() => {
    const downWeight = keysData.map<[number, OptionalNumber]>((key, idx) => [
      idx + 1,
      key.downWeight,
    ]);
    const balanceWeight = keysData.map<[number, OptionalNumber]>((key, idx) => [
      idx + 1,
      key.balanceWeight,
    ]);
    const upWeight = keysData.map<[number, OptionalNumber]>((key, idx) => [
      idx + 1,
      key.upWeight,
    ]);
    const frictionWeight = keysData.map<[number, OptionalNumber]>(
      (key, idx) => [idx + 1, key.frictionWeight],
    );
    const verticalLines = keysData.map<{ coords: [number, OptionalNumber][] }>(
      (key, idx) => ({
        coords: [
          [idx + 1, key.upWeight],
          [idx + 1, key.downWeight],
        ],
      }),
    );

    return {
      balanceWeight,
      downWeight,
      frictionWeight,
      upWeight,
      verticalLines,
    };
  }, [keysData]);
};
