import { useMeasuredKeyboard } from '@/hooks/use-measure-store';
import { TouchDesignSerieVariant } from '../TouchDesignChart';
import { type TouchDesignSerie } from '../interfaces';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { useMemo } from 'react';
import type { EchartsDataItemStyle } from '../interfaces';

export interface UseMeasuredSerieResult {
  measuredSerie: TouchDesignSerie;
  shouldBeDisplayed: boolean;
}

export const useMeasuredSerie = (
  measureSelector: (key: MeasuredKeyRequirements) => OptionalNumber,
  name: string,
  options?: {
    variant?: TouchDesignSerieVariant;
    flatItemStyle?: EchartsDataItemStyle;
    sharpItemStyle?: EchartsDataItemStyle;
  },
): UseMeasuredSerieResult => {
  const measuredKeyboard = useMeasuredKeyboard();
  const variant = options?.variant ?? TouchDesignSerieVariant.Measured;
  const flatItemStyle = options?.flatItemStyle;
  const sharpItemStyle = options?.sharpItemStyle;

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
        flatItemStyle,
        name,
        sharpItemStyle,
        variant,
      },
      shouldBeDisplayed: data.some((data) => data !== undefined),
    }),
    [data, name, variant, sharpItemStyle, flatItemStyle],
  );

  return result;
};
