import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { StrikeWeightRatioChart } from '@/components/charts/StrikeWeightRatioChart';

export const AnalyzeStrikeWeightRatioPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();
  const { useManualSWRMeasurements } = useMeasureOptions();

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
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.4' })}
        title={
          <Trans i18nKey="Strike Weight <1>Ratio</1>">
            Strike Weight <em className="ptl-accent">Ratio</em>
          </Trans>
        }
        lede={t(
          'The weight to place at the measuring point to balance 1 g of strike weight: the leverage of the shank, the wippen and the key. Computed from your measurements, R = (FW + BW − WBW) / SW.',
        )}
      />
      <StrikeWeightRatioChart
        keyboard={analyzedKeyboard}
        displayBothManualAndComputed={useManualSWRMeasurements}
      />
    </MainLayout>
  );
};
