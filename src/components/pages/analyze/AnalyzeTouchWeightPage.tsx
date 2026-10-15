import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisSidePanel } from '@/components/analyze/key-reading/AnalysisSidePanel';
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

/**
 * Averaged over the series the chart drew rather than over the stored
 * measurements: what the figure shows is already relieved of the load the
 * support springs carry, and the rail has to say the same thing.
 */
const summaryOf = (serie: TouchDesignSerie) => {
  const values = serie.data
    .map((point) => point.payload)
    .filter(
      (value): value is number => value !== undefined && !Number.isNaN(value),
    );

  return {
    count: values.length,
    mean:
      values.length === 0
        ? null
        : values.reduce((total, value) => total + value, 0) / values.length,
  };
};

export const AnalyzeTouchWeightPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  const renderSidePanel = useCallback(
    ({ frictionZoneLabel, hoveredKey, series }: TouchWeightReadingContext) => {
      const balance = summaryOf(series.balance);
      const friction = summaryOf(series.friction);
      const readingOf = (serie: TouchDesignSerie) =>
        formatGrams(serieValueAt(serie, hoveredKey), currentLanguage);

      return (
        <AnalysisSidePanel
          ariaLabel={t('Static balance reading')}
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
          summary={[
            {
              label: t('Average balance weight'),
              value: formatGrams(balance.mean, currentLanguage),
            },
            {
              label: t('Average friction'),
              value: formatGrams(friction.mean, currentLanguage),
            },
            {
              label: t('Measured keys'),
              value: `${balance.count}/${analyzedKeyboard.size}`,
            },
          ]}
          hint={t(
            'Hover or tap the chart to read a key; use ← → for the next one.',
          )}
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
        renderSidePanel={renderSidePanel}
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            <Trans
              i18nKey="Each measurement sits above the back of its key. Balance weight <1>BW = (D + U) / 2</1>; friction <3>F = (D − U) / 2</3>, with the reference zones."
              components={CAPTION_PARTS}
            />
          </FigureCaption>
        }
      />
    </MainLayout>
  );
};
