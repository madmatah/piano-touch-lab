import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { FigureCaption } from '@/components/charts/figure/FigureCaption';
import {
  ChartLegendMark,
  type ChartLegendMarkKind,
} from '@/components/charts/figure/ChartLegendMark';
import {
  serieValueAt,
  type TouchDesignSerie,
} from '@/components/charts/interfaces';
import {
  TouchWeightChart,
  type TouchWeightReadingContext,
} from '@/components/charts/touch-weight-chart/TouchWeightChart';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { EMPTY_VALUE, formatGrams } from '@/lib/format/format-weight';
import { ANALYZE_FIGURE_NUMBERS } from '@/lib/piano/figure-numbers';
import { usePrintLandscape } from '@/hooks/use-print-page-size';

const FIGURE_NUMBER = ANALYZE_FIGURE_NUMBERS['/analyze/touch-weight']!;

/** The two formulas of the caption, set in mono as the design writes them. */
const CAPTION_PARTS = [
  <span key="lead" />,
  <span key="balance" className="font-mono" />,
  <span key="between" />,
  <span key="friction" className="font-mono" />,
];

/**
 * The reading card is ink-dark in both themes, so its glyphs take the colours
 * of that card rather than the series colours used over the plot.
 */
const readingMark = (kind: ChartLegendMarkKind, colorClassName: string) => (
  <span className={colorClassName}>
    <ChartLegendMark kind={kind} />
  </span>
);

export const AnalyzeTouchWeightPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  const renderReading = useCallback(
    ({ frictionZoneLabel, hoveredKey, series }: TouchWeightReadingContext) => {
      const readingOf = (serie: TouchDesignSerie) =>
        formatGrams(serieValueAt(serie, hoveredKey), currentLanguage);

      return (
        <KeyReadingStrip
          reading={{
            keyNumber: hoveredKey,
            noteName:
              analyzedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
            rows: [
              {
                label: series.down.name,
                mark: readingMark('triangle-down', 'text-ptl-reading-accent'),
                value: readingOf(series.down),
              },
              {
                label: series.up.name,
                mark: readingMark('triangle-up', 'text-ptl-current'),
                value: readingOf(series.up),
              },
              {
                isAccent: true,
                label: series.balance.name,
                mark: readingMark('diamond', 'text-ptl-reading-foreground'),
                value: readingOf(series.balance),
              },
              {
                label: series.friction.name,
                mark: readingMark('dot', 'text-ptl-reading-muted'),
                value: readingOf(series.friction),
              },
              {
                isQualitative: true,
                label: t('Friction zone'),
                value: frictionZoneLabel ?? EMPTY_VALUE,
              },
            ],
          }}
        />
      );
    },
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
          <Trans i18nKey="Static <1>Balance</1> & Friction">
            Static <em className="ptl-accent">Balance</em> & Friction
          </Trans>
        }
        lede={t('Spot the irregularities in your action.')}
        ledeWidth="62ch"
      />
      <TouchWeightChart
        analyzedKeyboard={analyzedKeyboard}
        useSupportSpringMeasurements={useSupportSpringMeasurements}
        renderReading={renderReading}
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            <Trans
              i18nKey="Each measurement sits above the back of its key. Balance weight <1>BW = (D + U) / 2</1>; friction <3>F = (D − U) / 2</3>, with the reference zones."
              components={CAPTION_PARTS}
            />
          </FigureCaption>
        }
      />
      <AnalysisFooter
        hint={t(
          'Hover or tap the chart to read a key; use ← → for the next one.',
        )}
      />
    </MainLayout>
  );
};
