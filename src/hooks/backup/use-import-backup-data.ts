import { useCallback } from 'react';
import {
  type FullBackupData,
  type MeasuresData,
  type MeasureBackupRequirements,
  KeyMeasureSchema,
} from '@/lib/backup/measure-backup';
import { useMeasureActions } from '@/hooks/store/use-measure-store';
import { useDesignActions } from '@/hooks/store/use-design-store';
import { useMeasureOptionsActions } from '@/hooks/store/use-measure-options-store';
import { usePianoProfileActions } from '@/hooks/store/use-piano-profile-store';
import type z from 'zod';

export const useImportBackupData = () => {
  const { updateState: updateMeasureState } = useMeasureActions();
  const {
    updateFrontWeightDesign,
    updateStrikeWeightDesign,
    updateStrikeWeightRatioDesign,
    updateWippenSupportSpringsDesign,
  } = useDesignActions();
  const { updateState: updateMeasureOptionsState } = useMeasureOptionsActions();
  const { updateState: updatePianoState } = usePianoProfileActions();

  const transformKeys = useCallback(
    (
      keys: z.infer<typeof KeyMeasureSchema>[],
    ): MeasureBackupRequirements['keys'] => {
      return keys.map((k) => ({
        downWeightWithSpringSupport: k.downWeightWithSpringSupport ?? null,
        downWeightWithoutSpringSupport:
          k.downWeightWithoutSpringSupport ?? k.downWeight ?? null,
        frontWeight: k.frontWeight ?? null,
        keyWeightRatio: k.keyWeightRatio ?? null,
        measuredStrikeWeightRatio: k.measuredStrikeWeightRatio ?? null,
        strikeWeight: k.strikeWeight ?? null,
        upWeight: k.upWeight ?? null,
        wippenRadiusWeight: k.wippenRadiusWeight ?? null,
      }));
    },
    [],
  );

  const importMeasuresOnly = useCallback(
    (data: MeasuresData): void => {
      const nextKeys = transformKeys(data.keys);

      updateMeasureState({
        keyWeightRatio: data.keyWeightRatio ?? null,
        keys: nextKeys,
        wippenRadiusWeight: data.wippenRadiusWeight ?? null,
      });
    },
    [transformKeys, updateMeasureState],
  );

  const importFullBackup = useCallback(
    (data: FullBackupData): void => {
      const nextKeys = transformKeys(data.measures.keys);

      updateMeasureState({
        keyWeightRatio: data.measures.keyWeightRatio ?? null,
        keys: nextKeys,
        wippenRadiusWeight: data.measures.wippenRadiusWeight ?? null,
      });

      updateFrontWeightDesign(
        data.design.frontWeightDesignMode as never,
        data.design.frontWeightDesignTarget,
      );
      updateStrikeWeightDesign(
        data.design.strikeWeightDesignMode as never,
        data.design.strikeWeightDesignTarget as never,
      );
      updateStrikeWeightRatioDesign(
        data.design.strikeWeightRatioDesignMode as never,
        data.design.strikeWeightRatioDesignTarget,
      );
      updateWippenSupportSpringsDesign(
        data.design.wippenSupportSpringsDesignMode as never,
        data.design.wippenSupportSpringsDesignTarget as never,
      );

      updateMeasureOptionsState({
        useManualSWRMeasurements: data.measureOptions.useManualSWRMeasurements,
        useSupportSpringMeasurements:
          data.measureOptions.useSupportSpringMeasurements,
      });

      if (data.piano) {
        updatePianoState({
          isDemoProfile: data.piano.isDemoProfile ?? false,
          keyCount: data.piano.keyCount ?? 88,
          brand: data.piano.brand ?? null,
          model: data.piano.model ?? null,
          serialNumber: data.piano.serialNumber ?? null,
        });
      }
    },
    [
      transformKeys,
      updateMeasureState,
      updateFrontWeightDesign,
      updateStrikeWeightDesign,
      updateStrikeWeightRatioDesign,
      updateWippenSupportSpringsDesign,
      updateMeasureOptionsState,
      updatePianoState,
    ],
  );

  return { importFullBackup, importMeasuresOnly };
};
