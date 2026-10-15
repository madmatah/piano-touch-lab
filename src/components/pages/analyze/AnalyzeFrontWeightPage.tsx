import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisSidePanel } from '@/components/analyze/key-reading/AnalysisSidePanel';
import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';
import { FigureCaption } from '@/components/charts/figure/FigureCaption';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { formatGrams } from '@/lib/format/format-weight';
import { ANALYZE_FIGURE_NUMBERS } from '@/lib/piano/figure-numbers';
import type { TouchWeightAnalyzedKey } from '@/lib/piano/touch-design/touch-weight-key-analysis';

const FIGURE_NUMBER = ANALYZE_FIGURE_NUMBERS['/analyze/front-weight']!;
/** The three curves the mockups read out beside the measurement. */
const REFERENCE_CURVES = ['FW#5', 'FW#7', 'FW#9'];

const selectFrontWeight = (key: TouchWeightAnalyzedKey) =>
  key.payload.frontWeight;

export const AnalyzeFrontWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const stats = useKeyboardStats(analyzedKeyboard, selectFrontWeight);

  const renderSidePanel = useCallback(
    ({ hoveredKey, measuredSerie, referenceSeries }: ChartReadingContext) => (
      <AnalysisSidePanel
        ariaLabel={t('Front weight reading')}
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
        summary={[
          {
            label: t('Minimum'),
            value: formatGrams(stats.min, currentLanguage),
          },
          {
            label: t('Maximum'),
            value: formatGrams(stats.max, currentLanguage),
          },
          { label: t('Mean'), value: formatGrams(stats.mean, currentLanguage) },
          {
            label: t('Measured keys'),
            value: `${stats.count}/${stats.size}`,
          },
        ]}
        action={{
          label: t('Design the front weight'),
          to: '/design/front-weight',
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
          <Trans i18nKey="Front <1>Weight</1>">
            Front <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          "The static weight the level key exerts at the measuring point, tipped on its balance pin. Compared here against David C. Stanwood's standard curves.",
        )}
      />
      <FrontWeightChart
        keyboard={analyzedKeyboard}
        renderSidePanel={renderSidePanel}
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            {t(
              'The measured front weight of each key, placed above the back of its own key. The FW#5 to FW#9 curves are there as landmarks.',
            )}
          </FigureCaption>
        }
      />
    </MainLayout>
  );
};
