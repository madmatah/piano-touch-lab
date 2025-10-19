import { useCallback } from 'react';
import { gaveauModele1 } from '@/demo-data/gaveau-m1';
import { useImportBackupData } from '@/hooks/backup/use-import-backup-data';

export const useLoadDemoData = () => {
  const { importFullBackup } = useImportBackupData();

  const loadDemoData = useCallback((): void => {
    try {
      importFullBackup(gaveauModele1);
    } catch {
      throw new Error('Failed to load demo data');
    }
  }, [importFullBackup]);

  return { loadDemoData };
};
