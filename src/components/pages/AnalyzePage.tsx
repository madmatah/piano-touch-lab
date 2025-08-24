import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { usePianoMeasures } from '@/hooks/use-measure-store';
import {
  touchWeightAnalyzerRequirementsSymbol,
  type TouchWeightAnalyzerRequirements,
} from '@/lib/piano/touch-design/touch-weight-analyzer-requirements';
import { useInjection } from 'inversify-react';
import { useMemo } from 'react';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';
import { useChartDimension } from '../charts/hooks/use-chart-dimension';

export const AnalyzePage = () => {
  const { chartHeight } = useChartDimension();
  const measures = usePianoMeasures();
  const touchWeightAnalyzer = useInjection<TouchWeightAnalyzerRequirements>(
    touchWeightAnalyzerRequirementsSymbol,
  );

  const touchWeightData = useMemo(
    () => touchWeightAnalyzer.analyze(measures),
    [measures, touchWeightAnalyzer],
  );

  return (
    <MainLayout pageTitle="Analyze" pageIcon={<ChartLine />}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section>
          <TouchWeightChart
            chartHeight={chartHeight}
            keysData={touchWeightData.keys}
          />
        </section>

        <section>
          <FrontWeightChart chartHeight={chartHeight} />
        </section>

        <section>
          <StrikeWeightChart chartHeight={chartHeight} />
        </section>
      </div>
    </MainLayout>
  );
};
