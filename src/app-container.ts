import { Container } from 'inversify';
import {
  type TouchWeightAnalyzerRequirements,
  touchWeightAnalyzerRequirementsSymbol,
} from './lib/piano/touch-design/touch-weight-analyzer-requirements';
import { TouchWeightAnalyzer } from './lib/piano/touch-design/touch-weight-analyzer';
import {
  curveSmootherRequirementsSymbol,
  type CurveSmootherRequirements,
} from './lib/geometry/curve-smoother/curve-smoother.requirements';
import type { CurveSmootherLoessOptions } from './lib/geometry/curve-smoother/curve-smoother-loess';
import { CurveSmootherLoess } from './lib/geometry/curve-smoother/curve-smoother-loess';
import {
  dataPointsExtractorRequirementsSymbol,
  type DataPointsExtractorRequirements,
} from './lib/geometry/curve-smoother/data-points-extractor/data-points-extractor-requirements';
import { DataPointsExtractor } from './lib/geometry/curve-smoother/data-points-extractor/data-points-extractor';
import {
  CurveSmootherLeastSquaresRegression,
  type CurveSmootherLeastSquaresRegressionOptions,
} from './lib/geometry/curve-smoother/curve-smoother-least-squares-regression';
import { SmoothStrategy } from './lib/geometry/curve-smoother/smooth-strategy.enum';

export const container = new Container();

container
  .bind<TouchWeightAnalyzerRequirements>(touchWeightAnalyzerRequirementsSymbol)
  .to(TouchWeightAnalyzer);

container
  .bind<DataPointsExtractorRequirements>(dataPointsExtractorRequirementsSymbol)
  .to(DataPointsExtractor);

container
  .bind<
    CurveSmootherRequirements<CurveSmootherLoessOptions>
  >(curveSmootherRequirementsSymbol)
  .to(CurveSmootherLoess)
  .whenNamed(SmoothStrategy.LOESS);

container
  .bind<
    CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>
  >(curveSmootherRequirementsSymbol)
  .to(CurveSmootherLeastSquaresRegression)
  .whenNamed(SmoothStrategy.LEAST_SQUARES_REGRESSION);
