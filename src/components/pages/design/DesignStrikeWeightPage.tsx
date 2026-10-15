import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightDesign } from '@/components/design/strike-weight/StrikeWeightDesign';

export const DesignStrikeWeightPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <DesignStepsBar currentStepId="strike-weight" />
      <PageHeading
        eyebrow={t('Design · parameter {{number}} of 4', { number: 3 })}
        title={
          <Trans i18nKey="Strike <1>Weight</1>">
            Strike <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          'Choose the weight of your hammers: as measured, computed for a balance weight, from a standard curve, or from a smoothed curve of your measurements.',
        )}
      />
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
