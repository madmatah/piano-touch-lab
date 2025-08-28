import type { TouchDesignSerieVariant } from '../TouchDesignChart';
import type { TouchDesignSerie } from '../interfaces';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import type { CurveSmootherLoessOptions } from '@/lib/geometry/curve-smoother/curve-smoother-loess';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';

export const useSmoothedSerieLoess = (
  serie: (number | undefined)[],
  name: string,
  variant: TouchDesignSerieVariant,
): TouchDesignSerie | undefined => {
  const loessSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLoessOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.LOESS);

  if (!serie.some((v) => v !== undefined)) {
    return undefined;
  }

  const smoothedData = loessSmoother.smoothCurve(serie, {
    bandwidthFraction: 1,
  });

  return {
    data: smoothedData,
    name,
    variant,
  };
};
