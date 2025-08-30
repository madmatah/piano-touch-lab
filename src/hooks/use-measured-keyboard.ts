import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useKeyboard } from './use-keyboard';
import {
  useMeasuresStore,
  type MeasuresStore,
  type MeasuresStoreState,
} from './use-measure-store';

export const useMeasuredKeyboard = (
  measureProfileName?: string,
): KeyboardLike<KeyWith<MeasuredKeyRequirements>> => {
  const pianoMeasureState = useMeasuresStore(measureProfileName)(
    useShallow<MeasuresStore, MeasuresStoreState>((state: MeasuresStore) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenRadiusWeight: state.wippenRadiusWeight,
    })),
  );

  const { keyboard } = useKeyboard();
  const measuredKeyboard = useMemo(
    () =>
      keyboard.map((key) => {
        const storeIndex = key.number - 1;
        const wippenRadiusWeight =
          pianoMeasureState.keys[storeIndex]?.wippenRadiusWeight ??
          pianoMeasureState.wippenRadiusWeight;
        const keyWeightRatio =
          pianoMeasureState.keys[storeIndex]?.keyWeightRatio ??
          pianoMeasureState.keyWeightRatio;

        const measuredKey: MeasuredKeyRequirements = pianoMeasureState.keys[
          storeIndex
        ] as MeasuredKeyRequirements;

        return {
          ...measuredKey,
          keyWeightRatio,
          wippenRadiusWeight,
        };
      }),
    [keyboard, pianoMeasureState],
  );

  return measuredKeyboard;
};
