import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { touchWeightReadingRows } from '@/components/analyze/key-reading/touch-weight-reading';
import {
  TouchWeightChart,
  type TouchWeightReadingContext,
} from '@/components/charts/touch-weight-chart/TouchWeightChart';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { EMPTY_VALUE } from '@/lib/format/format-weight';
import { usePrintLandscape } from '@/hooks/use-print-page-size';
import { MeasureFirst } from '@/components/analyze/MeasureFirst';

export const AnalyzeTouchWeightPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  const renderReading = useCallback(
    ({ frictionZoneLabel, hoveredKey, series }: TouchWeightReadingContext) => {
      return (
        <KeyReadingStrip
          reading={{
            keyNumber: hoveredKey,
            noteName:
              analyzedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
            rows: [
              ...touchWeightReadingRows(series, hoveredKey, currentLanguage),
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
        emptyState={<MeasureFirst />}
        analyzedKeyboard={analyzedKeyboard}
        useSupportSpringMeasurements={useSupportSpringMeasurements}
        renderReading={renderReading}
      />
      <AnalysisFooter
        hint={t(
          'Hover or tap the chart to read a key; use ← → for the next one.',
        )}
      />
    </MainLayout>
  );
};
