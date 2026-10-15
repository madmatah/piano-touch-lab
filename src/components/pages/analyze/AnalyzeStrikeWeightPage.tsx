import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisSidePanel } from '@/components/analyze/key-reading/AnalysisSidePanel';
import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import { StrikeWeightChart } from '@/components/charts/StrikeWeightChart';
import { FigureCaption } from '@/components/charts/figure/FigureCaption';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { EMPTY_VALUE, formatGrams } from '@/lib/format/format-weight';
import { ANALYZE_FIGURE_NUMBERS } from '@/lib/piano/figure-numbers';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import type { TouchWeightAnalyzedKey } from '@/lib/piano/touch-design/touch-weight-key-analysis';

const FIGURE_NUMBER = ANALYZE_FIGURE_NUMBERS['/analyze/strike-weight']!;
/**
 * The three curves the mockups read out beside the measurement. They are
 * matched by name against the series the chart drew, hence plain strings.
 */
const REFERENCE_CURVES: readonly string[] = [
  StrikeWeightLevel.Level1,
  StrikeWeightLevel.Level5,
  StrikeWeightLevel.Level9,
];

const selectStrikeWeight = (key: TouchWeightAnalyzedKey) =>
  key.payload.strikeWeight;

export const AnalyzeStrikeWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const stats = useKeyboardStats(analyzedKeyboard, selectStrikeWeight);

  const renderSidePanel = useCallback(
    ({ hoveredKey, measuredSerie, referenceSeries }: ChartReadingContext) => (
      <AnalysisSidePanel
        ariaLabel={t('Strike weight reading')}
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
        summary={[
          {
            // The mockups name the key the extreme was read on, not just its
            // value: a heavy top octave does not read like a heavy bass.
            label: t('Heaviest ({{note}})', {
              note: stats.maxKeyName ?? EMPTY_VALUE,
            }),
            value: formatGrams(stats.max, currentLanguage),
          },
          {
            label: t('Lightest ({{note}})', {
              note: stats.minKeyName ?? EMPTY_VALUE,
            }),
            value: formatGrams(stats.min, currentLanguage),
          },
          { label: t('Mean'), value: formatGrams(stats.mean, currentLanguage) },
          {
            label: t('Measured keys'),
            value: `${stats.count}/${stats.size}`,
          },
        ]}
        action={{
          label: t('Design the strike weight'),
          to: '/design/strike-weight',
        }}
      />
    ),
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
          <Trans i18nKey="Strike <1>Weight</1>">
            Strike <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          'The weight of the hammer and its shank, pivoting without friction at its centre, shank horizontal, measured at the strike line radius. Compared against the 13 standard curves.',
        )}
      />
      <StrikeWeightChart
        keyboard={analyzedKeyboard}
        renderSidePanel={renderSidePanel}
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            {t(
              'The measured strike weight of each key. The SW#1 (lightest) to SW#13 (heaviest) curves are there as landmarks.',
            )}
          </FigureCaption>
        }
      />
    </MainLayout>
  );
};
