import { Container } from 'inversify';
import {
  type TouchWeightAnalyzerRequirements,
  touchWeightAnalyzerRequirementsSymbol,
} from './lib/piano/touch-design/touch-weight-analyzer-requirements';
import { TouchWeightAnalyzer } from './lib/piano/touch-design/touch-weight-analyzer';
import { smootherContainerModule } from './container-modules/smoother-container-module';

export const container = new Container();

container
  .bind<TouchWeightAnalyzerRequirements>(touchWeightAnalyzerRequirementsSymbol)
  .to(TouchWeightAnalyzer);

await container.load(smootherContainerModule);
