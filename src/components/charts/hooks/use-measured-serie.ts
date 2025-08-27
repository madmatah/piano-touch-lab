import { useMeasuredKeyboard } from '@/hooks/use-measure-store';
import {
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from '../TouchDesignChart';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';

export interface UseMeasuredSerieResult {
  measuredSerie: TouchDesignSerie;
  shouldBeDisplayed: boolean;
}

export const useMeasuredSerie = (
  measureSelector: (key: MeasuredKeyRequirements) => OptionalNumber,
  name: string,
  variant: TouchDesignSerieVariant = TouchDesignSerieVariant.Measured,
): UseMeasuredSerieResult => {
  const measuredKeyboard = useMeasuredKeyboard();

  const data = useMemo(
    () =>
      measuredKeyboard
        .mapToArray((key) => key.payload)
        .map(measureSelector)
        .map((v) => v ?? undefined),
    [measuredKeyboard, measureSelector],
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
