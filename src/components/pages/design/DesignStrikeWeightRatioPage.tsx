import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightRatioDesign } from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign';

export const DesignStrikeWeightRatioPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Strike Weight Ratio')} pageIcon={<Settings2 />}>
      <StrikeWeightRatioDesign
        analyzedKeyboard={analyzedKeyboard}
        notEnoughDataErrorTitle={t('Not enough data')}
        notEnoughDataErrorDescription={t(
          'Not enough data to generate a strike weight ratio design.',
        )}
        requiredDataPercentage={requiredDataPercentage}
      />
    </MainLayout>
  );
};
