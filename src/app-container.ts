import { Container } from 'inversify';
import {
  type TouchWeightAnalyzerRequirements,
  touchWeightAnalyzerRequirementsSymbol,
} from './lib/touch-design/touch-weight-analyzer-requirements';
import { TouchWeightAnalyzer } from './lib/touch-design/touch-weight-analyzer';

export const container = new Container();

container
  .bind<TouchWeightAnalyzerRequirements>(touchWeightAnalyzerRequirementsSymbol)
  .to(TouchWeightAnalyzer);
