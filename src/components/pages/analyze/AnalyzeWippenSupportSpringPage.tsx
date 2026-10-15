import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';

export const AnalyzeWippenSupportSpringPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout
      headerRight={
        <>
          <PianoIdentity />
          <PrintButton />
        </>
      }
    >
      <PageHeading
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.5' })}
        title={
          <Trans i18nKey="Wippen Support <1>Springs</1>">
            Wippen Support <em className="ptl-accent">Springs</em>
          </Trans>
        }
        lede={t(
          'The weight each wippen support spring takes off the measuring point: the difference between the down weight without the spring and with it.',
        )}
      />
      <SupportSpringBalanceWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
