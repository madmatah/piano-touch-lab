import { usePianoMeasures } from '@/hooks/use-measure-store';
import {
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from '../TouchDesignChart';
import type {
  KeyMeasureRequirements,
  OptionalNumber,
} from '@/lib/touch-design/measure-requirements';
import { useMemo } from 'react';

export interface UseMeasuredSerieResult {
  measuredSerie: TouchDesignSerie;
  shouldBeDisplayed: boolean;
}

export const useMeasuredSerie = (
  measureSelector: (key: KeyMeasureRequirements) => OptionalNumber,
  name: string,
  variant: TouchDesignSerieVariant = TouchDesignSerieVariant.Measured,
): UseMeasuredSerieResult => {
  const measures = usePianoMeasures();

  const data = useMemo(
    () => measures.keys?.map(measureSelector).map((v) => v ?? undefined) ?? [],
    [measures, measureSelector],
  );

  const result: UseMeasuredSerieResult = useMemo(
    () => ({
      measuredSerie: {
        data,
        name,
        variant,
      },
      shouldBeDisplayed: data.some((data) => data !== undefined),
    }),
    [data, name, variant],
  );

  return result;
};
