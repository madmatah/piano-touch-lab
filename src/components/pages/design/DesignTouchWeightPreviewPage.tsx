import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PianoIdentity } from '../../layout/PianoIdentity';
import { PrintButton } from '../../layout/PrintButton';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useDesignedKeyboard } from '../../../hooks/keyboard/use-designed-keyboard';
import { usePrintLandscape } from '@/hooks/use-print-page-size';
import { useTranslation } from '@/hooks/use-translation';
import { TouchWeightPreview } from '@/components/design/TouchWeightPreview';

export const DesignTouchWeightPreviewPage = () => {
  const designedKeyboard = useDesignedKeyboard();
  const { t } = useTranslation();
  usePrintLandscape();

  return (
    <MainLayout
      headerRight={
        <>
          <PianoIdentity />
          <PrintButton />
        </>
      }
    >
      <DesignStepsBar currentStepId="preview" />
      <PageHeading
        title={
          <Trans t={t} i18nKey="Touch Weight <1>Preview</1>">
            Touch Weight <em className="ptl-accent">Preview</em>
          </Trans>
        }
        lede={t(
          'The touch you get once your design is applied, next to the piano as it stands. Friction stays as you measured it.',
        )}
      />
      <TouchWeightPreview designedKeyboard={designedKeyboard} />
    </MainLayout>
  );
};
