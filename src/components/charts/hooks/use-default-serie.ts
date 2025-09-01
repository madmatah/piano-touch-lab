import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { useGenerateSerie } from './use-generate-serie';
import { useMemo } from 'react';
import type { TouchDesignSerie } from '../interfaces';
import { TouchDesignSerieVariant } from '../TouchDesignChart';

export const useDefaultSerie = <T, Name extends string>(
  keyboard: KeyboardLike<KeyWith<T>>,
  seriesNames: Name[],
  seriesWithBoldVariant: Name[],
  seriesMap: Record<Name, number[]>,
) => {
  const { generateSerie } = useGenerateSerie(keyboard);

  const defaultSeries = useMemo(
    () =>
      seriesNames.map((serieName): TouchDesignSerie => {
        const variant = seriesWithBoldVariant.includes(serieName)
          ? TouchDesignSerieVariant.DefaultBold
          : TouchDesignSerieVariant.Default;

        return generateSerie(
          (key) => seriesMap[serieName]?.[key.number - 1] ?? null,
          `${serieName}`,
          variant,
        );
      }),
    [generateSerie, seriesNames, seriesWithBoldVariant, seriesMap],
  );

  return defaultSeries;
};
