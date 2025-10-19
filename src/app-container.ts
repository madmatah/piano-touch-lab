import { Container } from 'inversify';

import { Logger } from 'tslog';
import {
  type TouchWeightAnalyzerRequirements,
  touchWeightAnalyzerRequirementsSymbol,
} from './lib/piano/touch-design/touch-weight-analyzer/touch-weight-analyzer-requirements';
import { TouchWeightAnalyzer } from './lib/piano/touch-design/touch-weight-analyzer/touch-weight-analyzer';
import { smootherContainerModule } from './container-modules/smoother-container-module';
import {
  touchWeightPreviewerRequirementsSymbol,
  type TouchWeightPreviewerRequirements,
} from './lib/piano/touch-design/touch-weight-previewer/touch-weight-previewer.requirements';
import { TouchWeightPreviewer } from './lib/piano/touch-design/touch-weight-previewer/touch-weight-previewer';
import { FrontWeightCalculator } from './lib/piano/touch-design/front-weight-calculator/front-weight-calculator';
import {
  frontWeightCalculatorRequirementsSymbol,
  type FrontWeightCalculatorRequirements,
} from './lib/piano/touch-design/front-weight-calculator/front-weight-calculator.requirements';
import { StrikeWeightCalculator } from './lib/piano/touch-design/strike-weight-calculator/strike-weight-calculator';
import {
  strikeWeightCalculatorRequirementsSymbol,
  type StrikeWeightCalculatorRequirements,
} from './lib/piano/touch-design/strike-weight-calculator/strike-weight-calculator.requirements';
import {
  loggerSymbol,
  type LoggerRequirements,
} from './lib/logger/logger.requirements';

export const container = new Container();

container
  .bind<TouchWeightAnalyzerRequirements>(touchWeightAnalyzerRequirementsSymbol)
  .to(TouchWeightAnalyzer);

container
  .bind<TouchWeightPreviewerRequirements>(
    touchWeightPreviewerRequirementsSymbol,
  )
  .to(TouchWeightPreviewer);

container
  .bind<FrontWeightCalculatorRequirements>(
    frontWeightCalculatorRequirementsSymbol,
  )
  .to(FrontWeightCalculator);

container
  .bind<StrikeWeightCalculatorRequirements>(
    strikeWeightCalculatorRequirementsSymbol,
  )
  .to(StrikeWeightCalculator);

container
  .bind<LoggerRequirements>(loggerSymbol)
  .toDynamicValue((): LoggerRequirements => {
    return new Logger();
  })
  .inSingletonScope();

await container.load(smootherContainerModule);
