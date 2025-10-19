import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightDesign } from '@/components/design/front-weight/FrontWeightDesign';

export const DesignFrontWeightPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Front Weight')} pageIcon={<Settings2 />}>
      <FrontWeightDesign
        analyzedKeyboard={analyzedKeyboard}
        requiredDataPercentage={requiredDataPercentage}
        notEnoughDataErrorTitle={t('Not enough data')}
        notEnoughDataErrorDescription={t(
          'Not enough data to generate a front weight design.',
        )}
      />
    </MainLayout>
  );
};
