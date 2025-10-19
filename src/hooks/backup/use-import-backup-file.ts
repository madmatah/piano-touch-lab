import { parseMeasuresBackupText } from '@/lib/backup/measure-backup';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useImportBackupData } from './use-import-backup-data';
import { useTranslation } from '../use-translation';

export const useImportBackupFile = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const clear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const { keyboard } = useKeyboard();
  const { importMeasuresOnly, importFullBackup } = useImportBackupData();
  const [isImporting, setIsImporting] = useState(false);

  const successMessage = t('File imported successfully');
  const errorMessage = t('Import failed: invalid file format.');

  const importFromFile = useCallback(
    async (file: File) => {
      setIsImporting(true);
      try {
        const text = await file.text();
        const expectedLength = keyboard.size;
        const parsed = parseMeasuresBackupText(text, expectedLength);
        if (!parsed.ok) {
          toast.error(errorMessage);
          return false;
        }

        if (parsed.isFullBackup) {
          importFullBackup(parsed.data);
          toast.success(successMessage);
        } else {
          importMeasuresOnly(parsed.data);
          toast.success(successMessage);
        }
        return true;
      } catch {
        toast.error(errorMessage);
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [
      keyboard.size,
      importFullBackup,
      successMessage,
      importMeasuresOnly,
      errorMessage,
    ],
  );

  const onInputFileChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const file = event.target.files?.[0] ?? null;
      if (!file) return;
      void (async () => {
        await importFromFile(file);
        clear();
      })();
    },
    [clear, importFromFile],
  );

  return {
    importFromFile,
    inputRef,
    isImporting,
    onInputFileChange,
    triggerImport: open,
  } as const;
};
