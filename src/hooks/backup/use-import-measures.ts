import { useMeasuresStore } from '@/hooks/use-measure-store';
import {
  type MeasureBackupRequirements,
  parseMeasuresBackupText,
} from '@/lib/backup/measure-backup';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

export const useImportMeasures = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const clear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const measuresStore = useMeasuresStore();
  const [isImporting, setIsImporting] = useState(false);

  const importFromFile = useCallback(
    async (file: File) => {
      setIsImporting(true);
      try {
        const text = await file.text();
        const expectedLength = measuresStore.getState().keys.length;
        const parsed = parseMeasuresBackupText(text, expectedLength);
        if (!parsed.ok) {
          toast.error(parsed.error || 'Import failed. Invalid file format.');
          return false;
        }

        const nextKeys: MeasureBackupRequirements['keys'] =
          parsed.data.keys.map((k) => ({
            downWeight: k.downWeight ?? null,
            frontWeight: k.frontWeight ?? null,
            keyWeightRatio: k.keyWeightRatio ?? null,
            strikeWeight: k.strikeWeight ?? null,
            upWeight: k.upWeight ?? null,
            wippenRadiusWeight: k.wippenRadiusWeight ?? null,
          }));

        measuresStore.setState({
          keyWeightRatio: parsed.data.keyWeightRatio ?? null,
          keys: nextKeys,
          wippenRadiusWeight: parsed.data.wippenRadiusWeight ?? null,
        });
        toast.success('Import completed');
        return true;
      } catch {
        toast.error('Import failed. Invalid file format.');
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [measuresStore],
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
