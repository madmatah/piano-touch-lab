import type {
  TouchDesignSerie,
  TouchDesignSerieVariant,
} from '../TouchDesignChart';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '@/lib/geometry/curve-smoother/curve-smoother.requirements';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { useNamedInjection } from '@/hooks/use-named-injection';
import type { CurveSmootherLeastSquaresRegressionOptions } from '@/lib/geometry/curve-smoother/curve-smoother-least-squares-regression';
import { StrikeWeightLevel } from '@/lib/touch-design/hammer-weight-level';
import { strikeWeightData } from '@/lib/touch-design/data/strike-weight';

export const useSmoothedSerieLsr = (
  serie: (number | undefined)[],
  name: string,
  variant: TouchDesignSerieVariant,
): TouchDesignSerie | undefined => {
  const lsrSmoother = useNamedInjection<
    CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>
  >(curveSmootherRequirementsSymbol, SmoothStrategy.LEAST_SQUARES_REGRESSION);

  if (!serie.some((v) => v !== undefined)) {
    return undefined;
  }

  const smoothedData = lsrSmoother.smoothCurve(serie, {
    referenceCurve: strikeWeightData[StrikeWeightLevel.Level5],
  });

  return {
    data: smoothedData,
    name,
    variant,
  };
};
