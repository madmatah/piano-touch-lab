import { ArrowRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { Button } from '@/components/ui/button';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import {
  useMeasureOptions,
  useMeasureOptionsActions,
} from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { formatGrams } from '@/lib/format/format-weight';
import { usePrintLandscape } from '@/hooks/use-print-page-size';

const DESIGN_PATH = '/design/wippen-support-springs';

export const AnalyzeWippenSupportSpringPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { updateOption } = useMeasureOptionsActions();
  const { useSupportSpringMeasurements } = useMeasureOptions();
  const navigate = useNavigate();

  // With nothing measured, the chart gives way to a panel that explains the
  // option and links to the design: the page then has nothing to print, and
  // no need for a second link under it.
  const hasReadings = useMemo(
    () =>
      useSupportSpringMeasurements &&
      analyzedKeyboard
        .getKeys()
        .some((key) => key.payload.supportSpringBalanceWeight !== null),
    [analyzedKeyboard, useSupportSpringMeasurements],
  );

  // Switching the option on is only half the answer: the values are entered in
  // Measure, so take the reader there rather than leaving them on a page that
  // now shows an empty chart.
  const enableMeasurement = useCallback(() => {
    updateOption('useSupportSpringMeasurements', true);
    void navigate('/measure');
  }, [navigate, updateOption]);

  const renderReading = useCallback(
    ({ hoveredKey, measuredSerie }: ChartReadingContext) => (
      <KeyReadingStrip
        reading={{
          keyNumber: hoveredKey,
          noteName:
            analyzedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
          rows: [
            {
              isAccent: true,
              label: t('Measured spring-supported weight'),
              value: formatGrams(
                serieValueAt(measuredSerie, hoveredKey),
                currentLanguage,
              ),
            },
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
          {hasReadings ? <PrintButton /> : null}
        </>
      }
    >
      <PageHeading
        title={
          <Trans i18nKey="Wippen Support <1>Springs</1>">
            Wippen Support <em className="ptl-accent">Springs</em>
          </Trans>
        }
      />
      <SupportSpringBalanceWeightChart
        keyboard={analyzedKeyboard}
        renderReading={renderReading}
        emptyStateActions={
          <>
            <Button className="min-h-[46px]" onClick={enableMeasurement}>
              {t('Enable the option')}
            </Button>
            <Button asChild variant="outlineStrong" className="min-h-[46px]">
              <Link to={DESIGN_PATH}>
                {t('Design the springs')}
                <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
      {hasReadings ? (
        <AnalysisFooter
          action={{ label: t('Design the springs'), to: DESIGN_PATH }}
        />
      ) : null}
    </MainLayout>
  );
};
