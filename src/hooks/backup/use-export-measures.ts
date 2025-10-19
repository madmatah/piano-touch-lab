import { useMeasuresStore } from '@/hooks/store/use-measure-store';
import { useDesignStore } from '@/hooks/store/use-design-store';
import { useMeasureOptionsStore } from '@/hooks/store/use-measure-options-store';
import {
  buildFullBackupExportPayload,
  createMeasuresExportBlob,
} from '@/lib/backup/measure-backup';
import { useCallback, useState } from 'react';
import { useDownloadBlob } from './use-download-blob';
import { formatISO } from 'date-fns';
import { useShallow } from 'zustand/shallow';

export const useExportMeasures = (profile = 'default') => {
  const measureStoreState = useMeasuresStore(profile)(
    useShallow((state) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenRadiusWeight: state.wippenRadiusWeight,
    })),
  );

  const designStoreState = useDesignStore(profile)(
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

  const [isExporting, setIsExporting] = useState(false);
  const { downloadBlob } = useDownloadBlob();

  const exportMeasures = useCallback(() => {
    const currentDay = formatISO(new Date(), { representation: 'date' });
    const filename = `piano-touch-export-${currentDay}.json`;
    setIsExporting(true);
    try {
      const payload = buildFullBackupExportPayload(
        {
          design: designStoreState,
          measureOptions: measureOptionsState,
          measures: {
            keyWeightRatio: measureStoreState.keyWeightRatio,
            keys: measureStoreState.keys,
            wippenRadiusWeight: measureStoreState.wippenRadiusWeight,
          },
        },
        profile,
      );
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
    profile,
  ]);

  return { exportMeasures, isExporting };
};
