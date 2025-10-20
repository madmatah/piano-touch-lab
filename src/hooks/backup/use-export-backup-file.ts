import { useMeasuresStore } from '@/hooks/store/use-measure-store';
import { useDesignStore } from '@/hooks/store/use-design-store';
import { useMeasureOptionsStore } from '@/hooks/store/use-measure-options-store';
import { usePianoProfileStore } from '@/hooks/store/use-piano-profile-store';
import {
  buildFullBackupExportPayload,
  createMeasuresExportBlob,
} from '@/lib/backup/measure-backup';
import { useCallback, useState } from 'react';
import { useDownloadBlob } from './use-download-blob';
import { formatISO } from 'date-fns';
import { useShallow } from 'zustand/shallow';

export const useExportBackupFile = () => {
  const measureStoreState = useMeasuresStore()(
    useShallow((state) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenRadiusWeight: state.wippenRadiusWeight,
    })),
  );

  const designStoreState = useDesignStore()(
    useShallow((state) => ({
      frontWeightDesignComputedBalanceWeightTarget:
        state.frontWeightDesignComputedBalanceWeightTarget,
      frontWeightDesignMode: state.frontWeightDesignMode,
      frontWeightDesignStandardTarget: state.frontWeightDesignStandardTarget,
      frontWeightDesignTarget: state.frontWeightDesignTarget,
      strikeWeightDesignComputedBalanceWeightTarget:
        state.strikeWeightDesignComputedBalanceWeightTarget,
      strikeWeightDesignLatestSmoothTarget:
        state.strikeWeightDesignLatestSmoothTarget,
      strikeWeightDesignLatestStandarTarget:
        state.strikeWeightDesignLatestStandarTarget,
      strikeWeightDesignMode: state.strikeWeightDesignMode,
      strikeWeightDesignTarget: state.strikeWeightDesignTarget,
      strikeWeightRatioDesignLatestFixedTarget:
        state.strikeWeightRatioDesignLatestFixedTarget,
      strikeWeightRatioDesignLatestSmoothTarget:
        state.strikeWeightRatioDesignLatestSmoothTarget,
      strikeWeightRatioDesignMode: state.strikeWeightRatioDesignMode,
      strikeWeightRatioDesignTarget: state.strikeWeightRatioDesignTarget,
      wippenSupportSpringsDesignLatestNumberOfSprings:
        state.wippenSupportSpringsDesignLatestNumberOfSprings,
      wippenSupportSpringsDesignLatestSpringBalanceWeight:
        state.wippenSupportSpringsDesignLatestSpringBalanceWeight,
      wippenSupportSpringsDesignLatestTensionDropIndex:
        state.wippenSupportSpringsDesignLatestTensionDropIndex,
      wippenSupportSpringsDesignMode: state.wippenSupportSpringsDesignMode,
      wippenSupportSpringsDesignTarget: state.wippenSupportSpringsDesignTarget,
    })),
  );

  const measureOptionsState = useMeasureOptionsStore()(
    useShallow((state) => ({
      useManualSWRMeasurements: state.useManualSWRMeasurements,
      useSupportSpringMeasurements: state.useSupportSpringMeasurements,
    })),
  );

  const pianoProfileState = usePianoProfileStore()(
    useShallow((state) => ({
      keyCount: state.keyCount,
      brand: state.brand,
      model: state.model,
      serialNumber: state.serialNumber,
    })),
  );

  const [isExporting, setIsExporting] = useState(false);
  const { downloadBlob } = useDownloadBlob();

  const exportBackupFile = useCallback(() => {
    const currentDay = formatISO(new Date(), { representation: 'date' });
    const filename = `piano-touch-export-${currentDay}.json`;
    setIsExporting(true);
    try {
      const payload = buildFullBackupExportPayload({
        design: designStoreState,
        measureOptions: measureOptionsState,
        measures: {
          keyWeightRatio: measureStoreState.keyWeightRatio,
          keys: measureStoreState.keys,
          wippenRadiusWeight: measureStoreState.wippenRadiusWeight,
        },
        piano: pianoProfileState,
      });
      const blob = createMeasuresExportBlob(payload);
      downloadBlob(blob, filename);
    } finally {
      setIsExporting(false);
    }
  }, [
    downloadBlob,
    measureStoreState,
    designStoreState,
    measureOptionsState,
    pianoProfileState,
  ]);

  return { exportBackupFile, isExporting };
};
