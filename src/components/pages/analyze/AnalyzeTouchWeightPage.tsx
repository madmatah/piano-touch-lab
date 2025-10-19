import { TouchWeightChart } from '../../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';

export const AnalyzeTouchWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  return (
    <MainLayout pageTitle={t('Touch Weight')} pageIcon={<ChartLine />}>
      <TouchWeightChart
        analyzedKeyboard={analyzedKeyboard}
        useSupportSpringMeasurements={useSupportSpringMeasurements}
      />
    </MainLayout>
  );
};
