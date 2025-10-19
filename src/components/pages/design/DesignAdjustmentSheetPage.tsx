import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '../../../hooks/keyboard/use-designed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { AdjustmentSheet } from '@/components/design/adjustment-sheet/AdjustmentSheet';

export const DesignAdjustmentSheetPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Adjustment Sheet')} pageIcon={<Settings2 />}>
      <AdjustmentSheet
        analyzedKeyboard={analyzedKeyboard}
        designedKeyboard={designedKeyboard}
      />
    </MainLayout>
  );
};
