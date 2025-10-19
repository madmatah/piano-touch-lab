import { MainLayout } from '../../MainLayout';
import { Settings2 } from 'lucide-react';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useTranslation } from '@/hooks/use-translation';
import { WippenSupportSpringsDesign } from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign';

export const DesignWippenSupportSpringsPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { t } = useTranslation();

  return (
    <MainLayout
      pageTitle={t('Wippen Support Springs')}
      pageIcon={<Settings2 />}
    >
      <WippenSupportSpringsDesign analyzedKeyboard={analyzedKeyboard} />
    </MainLayout>
  );
};
