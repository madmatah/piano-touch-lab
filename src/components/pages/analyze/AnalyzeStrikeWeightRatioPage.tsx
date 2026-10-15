import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisSidePanel } from '@/components/analyze/key-reading/AnalysisSidePanel';
import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import { FigureCaption } from '@/components/charts/figure/FigureCaption';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import {
  selectComputedStrikeWeightRatio,
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
import { ANALYZE_FIGURE_NUMBERS } from '@/lib/piano/figure-numbers';

const FIGURE_NUMBER = ANALYZE_FIGURE_NUMBERS['/analyze/strike-weight-ratio']!;

export const AnalyzeStrikeWeightRatioPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { useManualSWRMeasurements } = useMeasureOptions();
  const stats = useKeyboardStats(
    analyzedKeyboard,
    selectComputedStrikeWeightRatio,
  );

  const renderSidePanel = useCallback(
    ({ hoveredKey, measuredSerie }: ChartReadingContext) => {
      const ratio = serieValueAt(measuredSerie, hoveredKey);
      const deviation =
        ratio === null || stats.median === null ? null : ratio - stats.median;

      return (
        <AnalysisSidePanel
          ariaLabel={t('Strike weight ratio reading')}
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
              {
                label: t('Deviation from median'),
                value: formatSignedRatio(deviation, currentLanguage),
              },
            ],
          }}
          summary={[
            {
              label: t('Median'),
              value: formatRatio(stats.median, currentLanguage),
            },
            {
              label: t('Mean'),
              value: formatRatio(stats.mean, currentLanguage),
            },
            {
              label: stats.minKeyName
                ? t('Minimum · {{note}}', { note: stats.minKeyName })
                : t('Minimum'),
              value: formatRatio(stats.min, currentLanguage),
            },
            {
              label: stats.maxKeyName
                ? t('Maximum · {{note}}', { note: stats.maxKeyName })
                : t('Maximum'),
              value: formatRatio(stats.max, currentLanguage),
            },
          ]}
          action={{
            label: t('Design the ratio'),
            to: '/design/strike-weight-ratio',
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
        eyebrow={t('Fig. {{number}} — Analyze', { number: FIGURE_NUMBER })}
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
        renderSidePanel={renderSidePanel}
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            {t(
              'The ratio computed for each key; the vertical line ties each point to the median. Turn on the manual measurement option to compare measured against computed.',
            )}
          </FigureCaption>
        }
      />
    </MainLayout>
  );
};
