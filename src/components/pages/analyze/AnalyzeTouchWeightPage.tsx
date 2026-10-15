import { Trans } from 'react-i18next';

import { TouchWeightChart } from '../../charts/touch-weight-chart/TouchWeightChart';
import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';

export const AnalyzeTouchWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

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
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.1' })}
        title={
          <Trans i18nKey="Static <1>Balance</1> & Friction">
            Static <em className="ptl-accent">Balance</em> & Friction
          </Trans>
        }
        lede={t(
          'Enter your measurements and explore the charts to spot irregularities in your action.',
        )}
        ledeWidth="62ch"
      />
      <TouchWeightChart
        analyzedKeyboard={analyzedKeyboard}
        useSupportSpringMeasurements={useSupportSpringMeasurements}
      />
    </MainLayout>
  );
};
