import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';

export const AnalyzeFrontWeightPage = () => {
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
        eyebrow={t('Fig. {{number}} — Analyze', { number: '02.2' })}
        title={
          <Trans i18nKey="Front <1>Weight</1>">
            Front <em className="ptl-accent">Weight</em>
          </Trans>
        }
        lede={t(
          "The static weight the level key exerts at the measuring point, tipped on its balance pin. Compared here against David C. Stanwood's standard curves.",
        )}
      />
      <FrontWeightChart keyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
