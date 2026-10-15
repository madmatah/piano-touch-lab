import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { StrikeWeightChart } from '@/components/charts/StrikeWeightChart';

export const AnalyzeStrikeWeightPage = () => {
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
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.3' })}
        title={
          <Trans i18nKey="Strike <1>Weight</1>">
            Strike <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          'The weight of the hammer and its shank, pivoting without friction at its centre, shank horizontal, measured at the strike line radius. Compared against the 13 standard curves.',
        )}
      />
      <StrikeWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
