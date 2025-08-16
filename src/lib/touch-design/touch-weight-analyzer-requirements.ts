import type { MeasureRequirements } from './measure-requirements';
import type { TouchWeightDataRequirements } from './touch-weight-data.requirements';

export const touchWeightAnalyzerRequirementsSymbol = Symbol(
  'TouchWeightAnalyzerRequirements',
);

export interface TouchWeightAnalyzerRequirements {
  analyze(input: MeasureRequirements): TouchWeightDataRequirements;
}
