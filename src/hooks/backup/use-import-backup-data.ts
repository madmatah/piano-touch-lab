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
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import type { Note } from '@/lib/music/theory/spn';
import type z from 'zod';

const defaultKeySpec = {
  downWeightWithSpringSupport: null,
  downWeightWithoutSpringSupport: null,
  frontWeight: null,
  keyWeightRatio: null,
  measuredStrikeWeightRatio: null,
  strikeWeight: null,
  upWeight: null,
  wippenRadiusWeight: null,
};

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
  const { keyboard } = useKeyboard();

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

  const extendKeysToKeyboardSize = useCallback(
    (
      keys: MeasureBackupRequirements['keys'],
    ): MeasureBackupRequirements['keys'] => {
      if (keys.length >= keyboard.size) {
        return keys;
      }

      const extendedKeys = [...keys];
      for (let i = keys.length; i < keyboard.size; i++) {
        extendedKeys.push({ ...defaultKeySpec });
      }

      return extendedKeys;
    },
    [keyboard.size],
  );

  const importMeasuresOnly = useCallback(
    (data: MeasuresData): void => {
      const nextKeys = transformKeys(data.keys);
      const extendedKeys = extendKeysToKeyboardSize(nextKeys);

      updateMeasureState({
        keyWeightRatio: data.keyWeightRatio ?? null,
        keys: extendedKeys,
        wippenRadiusWeight: data.wippenRadiusWeight ?? null,
      });
    },
    [transformKeys, extendKeysToKeyboardSize, updateMeasureState],
  );

  const importFullBackup = useCallback(
    (data: FullBackupData): void => {
      const nextKeys = transformKeys(data.measures.keys);
      const extendedKeys = extendKeysToKeyboardSize(nextKeys);

      updateMeasureState({
        keyWeightRatio: data.measures.keyWeightRatio ?? null,
        keys: extendedKeys,
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
          brand: data.piano.brand ?? null,
          isDemoProfile: data.piano.isDemoProfile ?? false,
          keyCount: data.piano.keyCount ?? 88,
          model: data.piano.model ?? null,
          serialNumber: data.piano.serialNumber ?? null,
          startNote: (data.piano.startNote ?? {
            letter: 'A',
            octave: 0,
          }) as Note,
        });
      }
    },
    [
      transformKeys,
      extendKeysToKeyboardSize,
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
