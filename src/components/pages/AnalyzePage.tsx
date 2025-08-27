import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';
import { useChartDimension } from '../charts/hooks/use-chart-dimension';
import { StrikeWeightRatioChart } from '../charts/StrikeWeightRatioChart';
import { useAnalyzedKeyboard } from '../charts/hooks/use-analyzed-keyboard';

export const AnalyzePage = () => {
  const { chartHeight } = useChartDimension();

  const analyzedKeyboard = useAnalyzedKeyboard();

  return (
    <MainLayout pageTitle="Analyze" pageIcon={<ChartLine />}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section>
          <TouchWeightChart
            chartHeight={chartHeight}
            analyzedKeyboard={analyzedKeyboard}
          />
        </section>

        <section>
          <FrontWeightChart chartHeight={chartHeight} />
        </section>

        <section>
          <StrikeWeightChart chartHeight={chartHeight} />
        </section>

        <section>
          <StrikeWeightRatioChart
            chartHeight={chartHeight}
            analyzedKeyboard={analyzedKeyboard}
          />
        </section>
      </div>
    </MainLayout>
  );
};
