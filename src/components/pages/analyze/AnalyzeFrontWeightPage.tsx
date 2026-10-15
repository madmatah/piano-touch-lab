import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { formatGrams } from '@/lib/format/format-weight';
import { usePrintLandscape } from '@/hooks/use-print-page-size';
import { MeasureFirst } from '@/components/analyze/MeasureFirst';

/** The three curves the mockups read out beside the measurement. */
const REFERENCE_CURVES = ['FW#5', 'FW#7', 'FW#9'];

export const AnalyzeFrontWeightPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();

  const renderReading = useCallback(
    ({ hoveredKey, measuredSerie, referenceSeries }: ChartReadingContext) => (
      <KeyReadingStrip
        reading={{
          keyNumber: hoveredKey,
          noteName:
            analyzedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
          rows: [
            {
              isAccent: true,
              label: t('Measured front weight'),
              value: formatGrams(
                serieValueAt(measuredSerie, hoveredKey),
                currentLanguage,
              ),
            },
            ...REFERENCE_CURVES.map((name) => ({
              label: name,
              value: formatGrams(
                serieValueAt(
                  referenceSeries.find((serie) => serie.name === name),
                  hoveredKey,
                ),
                currentLanguage,
              ),
            })),
          ],
        }}
      />
    ),
    [analyzedKeyboard, currentLanguage, t],
  );

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
        title={
          <Trans t={t} i18nKey="Front <1>Weight</1>">
            Front <em className="ptl-accent">Weight</em>
          </Trans>
        }
      />
      <FrontWeightChart
        emptyState={<MeasureFirst />}
        keyboard={analyzedKeyboard}
        renderReading={renderReading}
      />
      <AnalysisFooter
        action={{
          label: t('Design the front weight'),
          to: '/design/front-weight',
        }}
      />
    </MainLayout>
  );
};
