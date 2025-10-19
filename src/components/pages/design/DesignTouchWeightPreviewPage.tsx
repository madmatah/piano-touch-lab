import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '../../../hooks/keyboard/use-designed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { TouchWeightPreview } from '@/components/design/TouchWeightPreview';

export const DesignTouchWeightPreviewPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Touch Weight preview')} pageIcon={<Settings2 />}>
      <TouchWeightPreview designedKeyboard={designedKeyboard} />
    </MainLayout>
  );
};
