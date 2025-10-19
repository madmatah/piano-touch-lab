import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { AnalyzeDataSheet } from '@/components/analyze/data-sheet/AnalyzeDataSheet';

export const AnalyzeDataSheetPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Touch Weight')} pageIcon={<ChartLine />}>
      <AnalyzeDataSheet analyzedKeyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
