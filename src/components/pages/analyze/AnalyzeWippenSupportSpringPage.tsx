import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';

export const AnalyzeWippenSupportSpringPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout
      pageTitle={t('Wippen Support Springs')}
      pageIcon={<ChartLine />}
    >
      <SupportSpringBalanceWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
