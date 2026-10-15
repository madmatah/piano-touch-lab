import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import type { TouchDesignSerieVariant } from '../KeyboardChart';
import type { TouchDesignDataPoint, TouchDesignSerie } from '../interfaces';

export const useGenerateSerie = <T>(keyboard: KeyboardLike<KeyWith<T>>) => {
  const generateSerie = useCallback(
    (
      valueSelector: (key: KeyWith<T>) => OptionalNumber,
      name: string,
      variant: TouchDesignSerieVariant,
    ): TouchDesignSerie => {
      const data: readonly TouchDesignDataPoint[] = keyboard
        .map<number | undefined>((key) => valueSelector(key) ?? undefined)
        .getKeys();

      return { data, name, variant };
    },
    [keyboard],
  );

  const isSerieEmpty = useCallback((serie: TouchDesignSerie) => {
    return serie.data.every(
      (d) => d.payload === undefined || d.payload === null || isNaN(d.payload),
    );
  }, []);

  return { generateSerie, isSerieEmpty };
};
