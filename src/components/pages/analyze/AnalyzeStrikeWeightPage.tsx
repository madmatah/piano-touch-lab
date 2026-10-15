import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { StrikeWeightChart } from '@/components/charts/StrikeWeightChart';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { formatGrams } from '@/lib/format/format-weight';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { usePrintLandscape } from '@/hooks/use-print-page-size';
import { MeasureFirst } from '@/components/analyze/MeasureFirst';

/**
 * The three curves the mockups read out beside the measurement. They are
 * matched by name against the series the chart drew, hence plain strings.
 */
const REFERENCE_CURVES: readonly string[] = [
  StrikeWeightLevel.Level1,
  StrikeWeightLevel.Level5,
  StrikeWeightLevel.Level9,
];

export const AnalyzeStrikeWeightPage = () => {
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
              label: t('Measured strike weight'),
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
          <Trans t={t} i18nKey="Strike <1>Weight</1>">
            Strike <em className="ptl-accent">Weight</em>
          </Trans>
        }
      />
      <StrikeWeightChart
        emptyState={<MeasureFirst />}
        keyboard={analyzedKeyboard}
        renderReading={renderReading}
      />
      <AnalysisFooter
        action={{
          label: t('Design the strike weight'),
          to: '/design/strike-weight',
        }}
      />
    </MainLayout>
  );
};
