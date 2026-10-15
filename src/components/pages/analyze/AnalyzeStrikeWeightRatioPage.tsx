import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import {
  selectComputedStrikeWeightRatio,
  selectStrikeWeightRatio,
  StrikeWeightRatioChart,
} from '@/components/charts/StrikeWeightRatioChart';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import {
  formatGrams,
  formatRatio,
  formatSignedRatio,
} from '@/lib/format/format-weight';
import { usePrintLandscape } from '@/hooks/use-print-page-size';

export const AnalyzeStrikeWeightRatioPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { useManualSWRMeasurements } = useMeasureOptions();
  const stats = useKeyboardStats(
    analyzedKeyboard,
    useManualSWRMeasurements
      ? selectComputedStrikeWeightRatio
      : selectStrikeWeightRatio,
  );

  const renderReading = useCallback(
    ({ hoveredKey, measuredSerie, referenceSeries }: ChartReadingContext) => {
      const ratio = serieValueAt(measuredSerie, hoveredKey);
      // With the option on, the chart hands over the ratios read with a
      // gauge too: the Measure page sends the reader here to compare them.
      const [manualSerie] = referenceSeries;
      const deviation =
        ratio === null || stats.median === null ? null : ratio - stats.median;

      return (
        <KeyReadingStrip
          reading={{
            // The ratio is a leverage, but it reads as a weight at the key:
            // the mockup spells that out under the figures.
            footnote:
              ratio === null
                ? undefined
                : t(
                    '1 g at the hammer weighs {{value}} at the key measuring point.',
                    { value: formatGrams(ratio, currentLanguage) },
                  ),
            keyNumber: hoveredKey,
            noteName:
              analyzedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
            rows: [
              {
                isAccent: true,
                label: t('Computed ratio'),
                value: formatRatio(ratio, currentLanguage),
              },
              ...(manualSerie
                ? [
                    {
                      label: t('Measured ratio'),
                      value: formatRatio(
                        serieValueAt(manualSerie, hoveredKey),
                        currentLanguage,
                      ),
                    },
                  ]
                : []),
              {
                label: t('Deviation from median'),
                value: formatSignedRatio(deviation, currentLanguage),
              },
            ],
          }}
        />
      );
    },
    [analyzedKeyboard, currentLanguage, stats, t],
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
          <Trans i18nKey="Strike Weight <1>Ratio</1>">
            Strike Weight <em className="ptl-accent">Ratio</em>
          </Trans>
        }
      />
      <StrikeWeightRatioChart
        keyboard={analyzedKeyboard}
        displayBothManualAndComputed={useManualSWRMeasurements}
        renderReading={renderReading}
      />
      <AnalysisFooter
        action={{
          label: t('Design the ratio'),
          to: '/design/strike-weight-ratio',
        }}
      />
    </MainLayout>
  );
};
