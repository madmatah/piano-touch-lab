import { Download } from 'lucide-react';
import { Trans } from 'react-i18next';

import { MainLayout } from '../../MainLayout';
import { PageHeading } from '../../layout/PageHeading';
import { PrintButton } from '../../layout/PrintButton';
import { useAnalyzedKeyboard } from '../../../hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '../../../hooks/keyboard/use-designed-keyboard';
import { useExportBackupFile } from '@/hooks/backup/use-export-backup-file';
import { useTranslation } from '@/hooks/use-translation';
import { AdjustmentSheet } from '@/components/design/adjustment-sheet/AdjustmentSheet';
import { Button } from '@/components/ui/button';

export const DesignAdjustmentSheetPage = () => {
  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);
  const { exportBackupFile } = useExportBackupFile();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <PageHeading
        eyebrow={t('Design · result')}
        title={
          <Trans i18nKey="Adjustment <1>Sheet</1>">
            Adjustment <em className="ptl-accent">Sheet</em>
          </Trans>
        }
        lede={t('Every adjustment at hand in your workshop, key by key.')}
        ledeWidth="60ch"
        actions={
          <>
            <Button variant="outlineStrong" onClick={exportBackupFile}>
              <Download className="size-4" />
              {t('Export', { ns: 'navigation' })}
            </Button>
            <PrintButton
              label={t('Print the sheet')}
              size="default"
              variant="default"
            />
          </>
        }
      />
      <AdjustmentSheet
        analyzedKeyboard={analyzedKeyboard}
        designedKeyboard={designedKeyboard}
      />
    </MainLayout>
  );
};
