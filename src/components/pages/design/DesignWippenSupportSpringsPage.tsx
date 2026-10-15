import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { usePrintLandscape } from '@/hooks/use-print-page-size';
import { useTranslation } from '@/hooks/use-translation';
import { WippenSupportSpringsDesign } from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign';

export const DesignWippenSupportSpringsPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();
  usePrintLandscape();

  return (
    <MainLayout
      headerRight={
        <>
          <PianoIdentity />
          <PrintButton />
        </>
      }
    >
      <DesignStepsBar currentStepId="springs" />
      <PageHeading
        title={
          <Trans i18nKey="Wippen Support <1>Springs</1>">
            Wippen Support <em className="ptl-accent">Springs</em>
          </Trans>
        }
        lede={t(
          'If your wippens carry support springs, work them into your design to reduce the lead needed in the keys.',
        )}
      />
      <WippenSupportSpringsDesign analyzedKeyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
