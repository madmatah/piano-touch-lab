import { Container } from 'inversify';
import {
  type TouchWeightAnalyzerRequirements,
  touchWeightAnalyzerRequirementsSymbol,
} from './lib/piano/touch-design/touch-weight-analyzer-requirements';
import { TouchWeightAnalyzer } from './lib/piano/touch-design/touch-weight-analyzer';
import { smootherContainerModule } from './container-modules/smoother-container-module';
import {
  touchWeightPreviewerRequirementsSymbol,
  type TouchWeightPreviewerRequirements,
} from './lib/piano/touch-design/touch-weight-previewer.requirements';
import { TouchWeightPreviewer } from './lib/piano/touch-design/touch-weight-previewer';

export const container = new Container();

container
  .bind<TouchWeightAnalyzerRequirements>(touchWeightAnalyzerRequirementsSymbol)
  .to(TouchWeightAnalyzer);

container
  .bind<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  )
  .to(TouchWeightPreviewer);

await container.load(smootherContainerModule);
