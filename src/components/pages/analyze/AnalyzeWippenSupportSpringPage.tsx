import { ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import { Trans } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { AnalysisFooter } from '@/components/analyze/key-reading/AnalysisFooter';
import { KeyReadingStrip } from '@/components/analyze/key-reading/KeyReadingStrip';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';
import { FigureCaption } from '@/components/charts/figure/FigureCaption';
import {
  serieValueAt,
  type ChartReadingContext,
} from '@/components/charts/interfaces';
import { Button } from '@/components/ui/button';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useMeasureOptionsActions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { formatGrams } from '@/lib/format/format-weight';
import { ANALYZE_FIGURE_NUMBERS } from '@/lib/piano/figure-numbers';
import { usePrintLandscape } from '@/hooks/use-print-page-size';

const FIGURE_NUMBER =
  ANALYZE_FIGURE_NUMBERS['/analyze/wippen-support-springs']!;
const DESIGN_PATH = '/design/wippen-support-springs';

export const AnalyzeWippenSupportSpringPage = () => {
  usePrintLandscape();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { currentLanguage, t } = useTranslation();
  const { updateOption } = useMeasureOptionsActions();
  const navigate = useNavigate();

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
          <PrintButton />
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
        caption={
          <FigureCaption number={FIGURE_NUMBER}>
            {t(
              'The weight each spring takes off the measuring point, placed above the back of its own key. Only the keys fitted with a spring carry a measurement.',
            )}
          </FigureCaption>
        }
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
      <AnalysisFooter
        action={{ label: t('Design the springs'), to: DESIGN_PATH }}
      />
    </MainLayout>
  );
};
