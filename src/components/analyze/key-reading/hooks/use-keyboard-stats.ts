import { useMemo } from 'react';

import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';

export interface KeyboardStats {
  /** How many keys carry a value. */
  count: number;
  max: number | null;
  maxKeyName: string | null;
  mean: number | null;
  median: number | null;
  min: number | null;
  minKeyName: string | null;
  /** How many keys the instrument has. */
  size: number;
}

const EMPTY: Omit<KeyboardStats, 'size'> = {
  count: 0,
  max: null,
  maxKeyName: null,
  mean: null,
  median: null,
  min: null,
  minKeyName: null,
};

/**
 * The spread of one quantity across the keyboard.
 *
 * The median is computed here rather than in the chart, because the chart
 * draws it and the summary card states it: one number, one source.
 */
export const useKeyboardStats = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  selector: (key: KeyWith<T>) => OptionalNumber,
): KeyboardStats =>
  useMemo(() => {
    const measured = keyboard
      .getKeys()
      .map((key) => ({ name: key.name, value: selector(key) }))
      .filter(
        (entry): entry is { name: string; value: number } =>
          entry.value !== null && !Number.isNaN(entry.value),
      );

    if (measured.length === 0) {
      return { ...EMPTY, size: keyboard.size };
    }

    const sorted = [...measured].sort((a, b) => a.value - b.value);
    const lowest = sorted[0]!;
    const highest = sorted[sorted.length - 1]!;
    const middle = Math.floor(sorted.length / 2);

    return {
      count: measured.length,
      max: highest.value,
      maxKeyName: highest.name,
      mean:
        measured.reduce((total, entry) => total + entry.value, 0) /
        measured.length,
      median:
        sorted.length % 2 === 0
          ? (sorted[middle - 1]!.value + sorted[middle]!.value) / 2
          : sorted[middle]!.value,
      min: lowest.value,
      minKeyName: lowest.name,
      size: keyboard.size,
    };
  }, [keyboard, selector]);
