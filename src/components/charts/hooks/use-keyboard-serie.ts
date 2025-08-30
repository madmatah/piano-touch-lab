import { TouchDesignSerieVariant } from '../TouchDesignChart';
import { type TouchDesignSerie } from '../interfaces';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';
import type { EchartsDataItemStyle, TouchDesignDataPoint } from '../interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';

export interface UseKeyboardSerieResult {
  serie: TouchDesignSerie;
  isEmpty: boolean;
}

export const useKeyboardSerie = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  valueSelector: (key: KeyWith<T>) => OptionalNumber,
  name: string,
  options?: {
    variant?: TouchDesignSerieVariant;
    flatItemStyle?: EchartsDataItemStyle;
    sharpItemStyle?: EchartsDataItemStyle;
  },
): UseKeyboardSerieResult => {
  const variant = options?.variant ?? TouchDesignSerieVariant.Measured;
  const flatItemStyle = options?.flatItemStyle;
  const sharpItemStyle = options?.sharpItemStyle;

  const data: readonly TouchDesignDataPoint[] = useMemo(() => {
    const mappedKeyboard = keyboard.map<number | undefined>(
      (key) => valueSelector(key) ?? undefined,
    );
    return mappedKeyboard.getKeys();
  }, [keyboard, valueSelector]);

  const isEmpty = useMemo(() => {
    return data.every((d) => d.payload === undefined);
  }, [data]);

  const result: UseKeyboardSerieResult = useMemo(
    () => ({
      isEmpty,
      serie: {
        data,
        flatItemStyle,
        name,
        sharpItemStyle,
        variant,
      },
    }),
    [data, name, variant, sharpItemStyle, flatItemStyle, isEmpty],
  );

  return result;
};
