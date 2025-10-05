import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useKeyboard } from './use-keyboard';
import {
  useMeasuresStore,
  type MeasuresStore,
  type MeasuresStoreState,
} from './store/use-measure-store';
import { useMeasureOptions } from './store/use-measure-options-store';

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
  const { useManualSWRMeasurements } = useMeasureOptions();

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
          measuredStrikeWeightRatio: useManualSWRMeasurements
            ? measuredKey.measuredStrikeWeightRatio
            : null,
          wippenRadiusWeight,
        };
      }),
    [keyboard, pianoMeasureState, useManualSWRMeasurements],
  );

  return measuredKeyboard;
};
