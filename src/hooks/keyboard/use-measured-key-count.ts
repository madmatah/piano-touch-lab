import { useStore } from 'zustand';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  useMeasuresStore,
  type MeasuresStore,
} from '../store/use-measure-store';
import { useKeyboard } from './use-keyboard';

export interface MeasuredKeyCount {
  measured: number;
  total: number;
}

/**
 * How far the first pass of measurements has got: a key counts once it has
 * both a down weight and an up weight, the pair every later figure is built
 * from.
 *
 * Reads the raw store rather than the analysed keyboard: this sits in the
 * sidebar, so it runs on every page and on every keystroke of the measure
 * table.
 */
export const useMeasuredKeyCount = (): MeasuredKeyCount => {
  const { keyboard } = useKeyboard();
  const keys = useStore(
    useMeasuresStore(),
    useShallow((state: MeasuresStore) => state.keys),
  );

  return useMemo(
    () => ({
      measured: keys
        .slice(0, keyboard.size)
        .filter(
          (key) =>
            key.downWeightWithoutSpringSupport !== null &&
            key.upWeight !== null,
        ).length,
      total: keyboard.size,
    }),
    [keys, keyboard.size],
  );
};
