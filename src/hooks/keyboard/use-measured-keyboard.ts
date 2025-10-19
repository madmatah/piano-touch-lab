import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useKeyboard } from './use-keyboard';
import {
  useMeasuresStore,
  type MeasuresStore,
} from '../store/use-measure-store';
import { useKeyMeasurementsHelpers } from './use-key-measurements-helpers';

export const useMeasuredKeyboard = (): KeyboardLike<
  KeyWith<MeasuredKeyRequirements>
> => {
  const { computeKeyMeasurements } = useKeyMeasurementsHelpers();
  const pianoMeasureState = useMeasuresStore()(
    useShallow((state: MeasuresStore) => ({
      keys: state.keys,
    })),
  );

  const { keyboard } = useKeyboard();
  const measuredKeyboard = useMemo(
    () =>
      keyboard.map((key) => {
        const storeIndex = key.number - 1;
        const keyMeasure: MeasuredKeyRequirements = pianoMeasureState.keys[
          storeIndex
        ] ?? {
          downWeightWithSpringSupport: null,
          downWeightWithoutSpringSupport: null,
          frontWeight: null,
          keyWeightRatio: null,
          measuredStrikeWeightRatio: null,
          strikeWeight: null,
          upWeight: null,
          wippenRadiusWeight: null,
        };
        return computeKeyMeasurements(keyMeasure);
      }),
    [keyboard, pianoMeasureState, computeKeyMeasurements],
  );

  return measuredKeyboard;
};
