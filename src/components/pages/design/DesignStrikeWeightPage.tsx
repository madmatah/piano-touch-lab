import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightDesign } from '@/components/design/strike-weight/StrikeWeightDesign';

export const DesignStrikeWeightPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Strike Weight')} pageIcon={<Settings2 />}>
      <StrikeWeightDesign
        analyzedKeyboard={analyzedKeyboard}
        notEnoughDataErrorTitle={t('Not enough data')}
        notEnoughDataErrorDescription={t(
          'Not enough data to generate a strike weight design.',
        )}
        requiredDataPercentage={requiredDataPercentage}
      />
    </MainLayout>
  );
};
