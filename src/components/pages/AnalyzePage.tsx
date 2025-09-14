import { FrontWeightChart } from '../charts/FrontWeightChart';
import { TouchWeightChart } from '../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../MainLayout';
import { ChartLine } from 'lucide-react';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '../app-ui/tabs';
import { StrikeWeightChart } from '../charts/StrikeWeightChart';
import { StrikeWeightRatioChart } from '../charts/StrikeWeightRatioChart';
import { useAnalyzedKeyboard } from '../../hooks/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';

export const AnalyzePage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Analyze')} pageIcon={<ChartLine />}>
      <Tabs defaultValue="touch-weight">
        <TabsList className="mb-5 print:hidden">
          <TabsTrigger value="touch-weight">
            {t('Static weight and Friction')}
          </TabsTrigger>
          <TabsTrigger value="front-weight">{t('Front Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight">{t('Strike Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight-ratio">
            {t('Strike Weight Ratio')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="touch-weight">
          <TouchWeightChart analyzedKeyboard={analyzedKeyboard} />
        </TabsContent>
        <TabsContent value="front-weight">
          <FrontWeightChart keyboard={analyzedKeyboard} />
        </TabsContent>
        <TabsContent value="strike-weight">
          <StrikeWeightChart keyboard={analyzedKeyboard} />
        </TabsContent>
        <TabsContent value="strike-weight-ratio">
          <StrikeWeightRatioChart keyboard={analyzedKeyboard} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
