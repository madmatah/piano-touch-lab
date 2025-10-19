import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightChart } from '@/components/charts/StrikeWeightChart';

export const AnalyzeStrikeWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Strike Weight')} pageIcon={<ChartLine />}>
      <StrikeWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
