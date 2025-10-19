import { useCallback } from 'react';
import { gaveauModele1 } from '@/demo-data/gaveau-m1';
import {
  type FullBackupData,
  type MeasureBackupRequirements,
} from '@/lib/backup/measure-backup';
import { useMeasureActions } from '@/hooks/store/use-measure-store';
import { useDesignActions } from '@/hooks/store/use-design-store';
import { useMeasureOptionsActions } from '@/hooks/store/use-measure-options-store';

export const useLoadDemoData = () => {
  const { updateState: updateMeasureState } = useMeasureActions();
  const {
    updateFrontWeightDesign,
    updateStrikeWeightDesign,
    updateStrikeWeightRatioDesign,
    updateWippenSupportSpringsDesign,
  } = useDesignActions();
  const { updateState: updateMeasureOptionsState } = useMeasureOptionsActions();

  const loadDemoData = useCallback((): void => {
    try {
      const demoData = gaveauModele1.data as FullBackupData;

      const nextKeys: MeasureBackupRequirements['keys'] =
        demoData.measures.keys.map((k) => ({
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

      updateMeasureState({
        keyWeightRatio: demoData.measures.keyWeightRatio ?? null,
        keys: nextKeys,
        wippenRadiusWeight: demoData.measures.wippenRadiusWeight ?? null,
      });

      updateFrontWeightDesign(
        demoData.design.frontWeightDesignMode as never,
        demoData.design.frontWeightDesignTarget,
      );
      updateStrikeWeightDesign(
        demoData.design.strikeWeightDesignMode as never,
        demoData.design.strikeWeightDesignTarget as never,
      );
      updateStrikeWeightRatioDesign(
        demoData.design.strikeWeightRatioDesignMode as never,
        demoData.design.strikeWeightRatioDesignTarget,
      );
      updateWippenSupportSpringsDesign(
        demoData.design.wippenSupportSpringsDesignMode as never,
        demoData.design.wippenSupportSpringsDesignTarget as never,
      );

      updateMeasureOptionsState({
        useManualSWRMeasurements:
          demoData.measureOptions.useManualSWRMeasurements,
        useSupportSpringMeasurements:
          demoData.measureOptions.useSupportSpringMeasurements,
      });
    } catch {
      throw new Error('Failed to load demo data');
    }
  }, [
    updateMeasureState,
    updateFrontWeightDesign,
    updateStrikeWeightDesign,
    updateStrikeWeightRatioDesign,
    updateWippenSupportSpringsDesign,
    updateMeasureOptionsState,
  ]);

  return { loadDemoData };
};
