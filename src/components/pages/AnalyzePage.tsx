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
        <section className="print:break-inside-avoid print:page-break-after-always print:flex print:flex-col print:justify-center">
          <TouchWeightChart analyzedKeyboard={analyzedKeyboard} />
        </section>
        <section className="print:break-inside-avoid print:page-break-after-always print:flex print:flex-col print:justify-center">
          <FrontWeightChart />
        </section>
        <section className="print:break-inside-avoid print:page-break-after-always print:flex print:flex-col print:justify-center">
          <StrikeWeightChart />
        </section>
        <section className="print:break-inside-avoid print:page-break-after-always print:flex print:flex-col print:justify-center">
          <StrikeWeightRatioChart analyzedKeyboard={analyzedKeyboard} />
        </section>
      </div>
    </MainLayout>
  );
};
