import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightDesign } from '@/components/design/front-weight/FrontWeightDesign';

export const DesignFrontWeightPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <DesignStepsBar currentStepId="front-weight" />
      <PageHeading
        title={
          <Trans i18nKey="Front <1>Weight</1>">
            Front <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          'Compute the ideal weight of your keys from the balance weight you are aiming for, or follow a standard curve.',
        )}
      />
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
