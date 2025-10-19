import { MainLayout } from '../../MainLayout';
import { ChartLine } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { StrikeWeightRatioChart } from '@/components/charts/StrikeWeightRatioChart';

export const AnalyzeStrikeWeightRatioPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();
  const { useManualSWRMeasurements } = useMeasureOptions();

  return (
    <MainLayout pageTitle={t('Strike Weight Ratio')} pageIcon={<ChartLine />}>
      <StrikeWeightRatioChart
        keyboard={analyzedKeyboard}
        displayBothManualAndComputed={useManualSWRMeasurements}
      />
    </MainLayout>
  );
};
