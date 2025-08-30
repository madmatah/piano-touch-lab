import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';
import { StrikeWeightRatioChart } from '../charts/StrikeWeightRatioChart';
import { useAnalyzedKeyboard } from '../charts/hooks/use-analyzed-keyboard';

const ChartSection = ({ children }: { children: React.ReactNode }) => (
  <section className="print:break-inside-avoid print:page-break-after-always print:flex print:flex-col print:justify-center">
    {children}
  </section>
);

export const AnalyzePage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();

  return (
    <MainLayout pageTitle="Analyze" pageIcon={<ChartLine />}>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 print:grid-cols-1 print:gap-0">
        <ChartSection>
          <TouchWeightChart analyzedKeyboard={analyzedKeyboard} />
        </ChartSection>
        <ChartSection>
          <FrontWeightChart />
        </ChartSection>
        <ChartSection>
          <StrikeWeightChart />
        </ChartSection>
        <ChartSection>
          <StrikeWeightRatioChart analyzedKeyboard={analyzedKeyboard} />
        </ChartSection>
      </div>
    </MainLayout>
  );
};
