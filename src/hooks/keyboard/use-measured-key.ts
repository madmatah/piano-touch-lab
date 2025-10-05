import type { KeyWith } from '@/lib/piano/keyboard';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';
import { useMeasuredKeyFromStore } from '../store/use-measure-store';
import { useKeyMeasurementsHelpers } from './use-key-measurements-helpers';
import { useKeyboard } from './use-keyboard';
import { useMemo } from 'react';

export const useMeasuredKey = (
  keyNumber: number,
  measureProfileName?: string,
): { measuredKey: KeyWith<MeasuredKeyRequirements> | undefined } => {
  const { computeKeyMeasurements } =
    useKeyMeasurementsHelpers(measureProfileName);
  const { keyboard } = useKeyboard();
  const keyIndex = keyNumber - 1;
  const key = keyboard.getKeyByNumber(keyNumber);
  const keyMeasures = useMeasuredKeyFromStore(keyIndex, measureProfileName);

  const measuredKey = useMemo(() => {
    if (key !== undefined && keyMeasures !== undefined) {
      return {
        ...key,
        payload: computeKeyMeasurements(keyMeasures),
      };
    }
  }, [key, keyMeasures, computeKeyMeasurements]);

  return { measuredKey };
};
