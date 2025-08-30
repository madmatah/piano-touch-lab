import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';
import { StrikeWeightRatioChart } from '../charts/StrikeWeightRatioChart';
import { useAnalyzedKeyboard } from '../charts/hooks/use-analyzed-keyboard';

export const AnalyzePage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();

  return (
    <MainLayout pageTitle="Analyze" pageIcon={<ChartLine />}>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 print:grid-cols-1 print:gap-0">
        <section>
          <TouchWeightChart analyzedKeyboard={analyzedKeyboard} />
        </section>
        <section>
          <FrontWeightChart />
        </section>
        <section>
          <StrikeWeightChart />
        </section>
        <section>
          <StrikeWeightRatioChart analyzedKeyboard={analyzedKeyboard} />
        </section>
      </div>
    </MainLayout>
  );
};
