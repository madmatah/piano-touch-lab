import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightRatioDesign } from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign';

export const DesignStrikeWeightRatioPage = () => {
  const requiredDataPercentage = 0.8;
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <DesignStepsBar currentStepId="ratio" />
      <PageHeading
        eyebrow={t('Design · parameter {{number}} of 4', { number: 4 })}
        title={
          <Trans i18nKey="Strike Weight <1>Ratio</1>">
            Strike Weight <em className="ptl-accent">Ratio</em>
          </Trans>
        }
        lede={t(
          'The leverage you are aiming for between hammer and key: kept as measured, brought back to the median or the mean of your measurements, or set to a constant.',
        )}
      />
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
