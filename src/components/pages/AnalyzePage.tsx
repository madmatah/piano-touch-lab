import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { usePianoMeasures } from '@/hooks/use-measure-store';
import {
  touchWeightAnalyzerRequirementsSymbol,
  type TouchWeightAnalyzerRequirements,
} from '@/lib/touch-design/touch-weight-analyzer-requirements';
import { useInjection } from 'inversify-react';
import { useMemo } from 'react';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';

export const AnalyzePage = () => {
  const measures = usePianoMeasures();
  const touchWeightAnalyzer = useInjection<TouchWeightAnalyzerRequirements>(
    touchWeightAnalyzerRequirementsSymbol,
  );

  const touchWeightData = useMemo(
    () => touchWeightAnalyzer.analyze(measures),
    [measures, touchWeightAnalyzer],
  );

  return (
    <MainLayout>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2 mb-5">
        <ChartLine className="w-11 h-11 stroke-primary pr-2" /> Analyze
      </h1>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Touch Weight
        </h2>
        <TouchWeightChart keysData={touchWeightData.keys} />
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Front Weight
        </h2>
        <FrontWeightChart />
      </section>

      <section>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Strike Weight
        </h2>
        <StrikeWeightChart />
      </section>
    </MainLayout>
  );
};
