import { Download, Plus, Upload } from 'lucide-react';

import { useNewProfileDialog } from '@/contexts/new-profile-dialog-context';
import { useExportBackupFile } from '@/hooks/backup/use-export-backup-file';
import { useImportBackupFile } from '@/hooks/backup/use-import-backup-file';
import { useTranslation } from '@/hooks/use-translation';

const itemClassName =
  'flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/** What can be done with the profile as a file: start one, save it, load one. */
export const SidebarFileGroup = () => {
  const { t } = useTranslation();
  const { exportBackupFile } = useExportBackupFile();
  const { inputRef, onInputFileChange, triggerImport } = useImportBackupFile();
  const { openNewProfileDialog } = useNewProfileDialog();

  const actions = [
    {
      icon: Plus,
      label: t('New Profile', { ns: 'navigation' }),
      onClick: openNewProfileDialog,
    },
    {
      icon: Download,
      label: t('Export', { ns: 'navigation' }),
      onClick: exportBackupFile,
    },
    {
      icon: Upload,
      label: t('Import', { ns: 'navigation' }),
      onClick: triggerImport,
    },
  ];

  return (
    <div className="flex flex-col gap-0.5">
      <span className="ptl-label px-2.5 pb-1.5">
        {t('File', { ns: 'navigation' })}
      </span>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={itemClassName}
          onClick={action.onClick}
        >
          <action.icon className="size-[17px]" />
          {action.label}
        </button>
      ))}
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onInputFileChange}
      />
    </div>
  );
};
