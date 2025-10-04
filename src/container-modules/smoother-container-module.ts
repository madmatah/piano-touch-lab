import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from '../lib/geometry/curve-smoother/curve-smoother.requirements';
import type { CurveSmootherLoessOptions } from '../lib/geometry/curve-smoother/curve-smoother-loess';
import { CurveSmootherLoess } from '../lib/geometry/curve-smoother/curve-smoother-loess';
import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from '../lib/geometry/curve-smoother/data-points-extractor/data-points-extractor-requirements';
import { DataPointsExtractor } from '../lib/geometry/curve-smoother/data-points-extractor/data-points-extractor';
import {
  CurveSmootherLeastSquaresRegression,
  type CurveSmootherLeastSquaresRegressionOptions,
} from '../lib/geometry/curve-smoother/curve-smoother-least-squares-regression';
import { SmoothStrategy } from '../lib/geometry/curve-smoother/smooth-strategy.enum';
import { CurveSmootherMedian } from '../lib/geometry/curve-smoother/curve-smoother-median';
import { CurveSmootherMean } from '../lib/geometry/curve-smoother/curve-smoother-mean';
import { CurveSmootherCubicSpline } from '@/lib/geometry/curve-smoother/curve-smoother-cubic-spline';

export const smootherContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    const { bind } = options;
    bind<DataPointsExtractorRequirements>(
      dataPointsExtractorRequirementsSymbol,
    ).to(DataPointsExtractor);

    bind<CurveSmootherRequirements<CurveSmootherLoessOptions>>(
      curveSmootherRequirementsSymbol,
    )
      .to(CurveSmootherLoess)
      .whenNamed(SmoothStrategy.Loess);

    bind<CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>>(
      curveSmootherRequirementsSymbol,
    )
      .to(CurveSmootherLeastSquaresRegression)
      .whenNamed(SmoothStrategy.LeastSquaresRegression);

    bind<CurveSmootherRequirements<undefined>>(curveSmootherRequirementsSymbol)
      .to(CurveSmootherMedian)
      .whenNamed(SmoothStrategy.Median);

    bind<CurveSmootherRequirements<undefined>>(curveSmootherRequirementsSymbol)
      .to(CurveSmootherMean)
      .whenNamed(SmoothStrategy.Mean);

    bind<CurveSmootherRequirements<undefined>>(curveSmootherRequirementsSymbol)
      .to(CurveSmootherCubicSpline)
      .whenNamed(SmoothStrategy.CubicSpline);
  },
);
