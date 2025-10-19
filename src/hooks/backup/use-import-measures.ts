import { useMeasuresStore } from '@/hooks/store/use-measure-store';
import { useDesignStore } from '@/hooks/store/use-design-store';
import { useMeasureOptionsStore } from '@/hooks/store/use-measure-options-store';
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
  const designStore = useDesignStore();
  const measureOptionsStore = useMeasureOptionsStore();
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

        if (parsed.isFullBackup) {
          const nextKeys: MeasureBackupRequirements['keys'] =
            parsed.data.measures.keys.map((k) => ({
              downWeightWithSpringSupport:
                k.downWeightWithSpringSupport ?? null,
              downWeightWithoutSpringSupport:
                k.downWeightWithoutSpringSupport ?? k.downWeight ?? null,
              frontWeight: k.frontWeight ?? null,
              keyWeightRatio: k.keyWeightRatio ?? null,
              measuredStrikeWeightRatio: k.measuredStrikeWeightRatio ?? null,
              strikeWeight: k.strikeWeight ?? null,
              upWeight: k.upWeight ?? null,
              wippenRadiusWeight: k.wippenRadiusWeight ?? null,
            }));

          measuresStore.getState().updateState({
            keyWeightRatio: parsed.data.measures.keyWeightRatio ?? null,
            keys: nextKeys,
            wippenRadiusWeight: parsed.data.measures.wippenRadiusWeight ?? null,
          });

          designStore
            .getState()
            .updateFrontWeightDesign(
              parsed.data.design.frontWeightDesignMode as never,
              parsed.data.design.frontWeightDesignTarget,
            );
          designStore
            .getState()
            .updateStrikeWeightDesign(
              parsed.data.design.strikeWeightDesignMode as never,
              parsed.data.design.strikeWeightDesignTarget as never,
            );
          designStore
            .getState()
            .updateStrikeWeightRatioDesign(
              parsed.data.design.strikeWeightRatioDesignMode as never,
              parsed.data.design.strikeWeightRatioDesignTarget,
            );
          designStore
            .getState()
            .updateWippenSupportSpringsDesign(
              parsed.data.design.wippenSupportSpringsDesignMode as never,
              parsed.data.design.wippenSupportSpringsDesignTarget as never,
            );

          measureOptionsStore.getState().updateState({
            useManualSWRMeasurements:
              parsed.data.measureOptions.useManualSWRMeasurements,
            useSupportSpringMeasurements:
              parsed.data.measureOptions.useSupportSpringMeasurements,
          });

          toast.success('Full backup imported successfully');
        } else {
          const nextKeys: MeasureBackupRequirements['keys'] =
            parsed.data.keys.map((k) => ({
              downWeightWithSpringSupport:
                k.downWeightWithSpringSupport ?? null,
              downWeightWithoutSpringSupport:
                k.downWeightWithoutSpringSupport ?? k.downWeight ?? null,
              frontWeight: k.frontWeight ?? null,
              keyWeightRatio: k.keyWeightRatio ?? null,
              measuredStrikeWeightRatio: k.measuredStrikeWeightRatio ?? null,
              strikeWeight: k.strikeWeight ?? null,
              upWeight: k.upWeight ?? null,
              wippenRadiusWeight: k.wippenRadiusWeight ?? null,
            }));

          measuresStore.getState().updateState({
            keyWeightRatio: parsed.data.keyWeightRatio ?? null,
            keys: nextKeys,
            wippenRadiusWeight: parsed.data.wippenRadiusWeight ?? null,
          });

          toast.success('Measures imported successfully');
        }
        return true;
      } catch {
        toast.error('Import failed. Invalid file format.');
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [measuresStore, designStore, measureOptionsStore],
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
