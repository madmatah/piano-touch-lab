import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { AnalyzeDataSheet } from '@/components/analyze/data-sheet/AnalyzeDataSheet';

export const AnalyzeDataSheetPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

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
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.6' })}
        title={
          <Trans i18nKey="Data <1>Sheet</1>">
            Data <em className="ptl-accent">Sheet</em>
          </Trans>
        }
        lede={t('Every measured and computed value, key by key, in grams.')}
      />
      <AnalyzeDataSheet analyzedKeyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
