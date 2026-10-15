import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { DesignStepsBar } from '@/components/design/steps/DesignStepsBar';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '../../../hooks/keyboard/use-designed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { TouchWeightPreview } from '@/components/design/TouchWeightPreview';

export const DesignTouchWeightPreviewPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const { t } = useTranslation();

  return (
    <MainLayout>
      <DesignStepsBar currentStepId="preview" />
      <PageHeading
        title={
          <Trans i18nKey="Touch Weight <1>Preview</1>">
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
