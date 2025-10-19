import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';

export const AnalyzeFrontWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Front Weight')} pageIcon={<ChartLine />}>
      <FrontWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
