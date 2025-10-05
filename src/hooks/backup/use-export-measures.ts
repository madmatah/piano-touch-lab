import { useMeasuresStore } from '@/hooks/store/use-measure-store';
import {
  buildMeasuresExportPayload,
  createMeasuresExportBlob,
} from '@/lib/backup/measure-backup';
import { useCallback, useState } from 'react';
import { useDownloadBlob } from './use-download-blob';
import { formatISO } from 'date-fns';
import { useShallow } from 'zustand/shallow';

export const useExportMeasures = (profile: string = 'default') => {
  const measureStoreState = useMeasuresStore(profile)(
    useShallow((state) => ({
      keyWeightRatio: state.keyWeightRatio,
      keys: state.keys,
      wippenRadiusWeight: state.wippenRadiusWeight,
    })),
  );

  const [isExporting, setIsExporting] = useState(false);
  const { downloadBlob } = useDownloadBlob();

  const exportMeasures = useCallback(() => {
    const currentDay = formatISO(new Date(), { representation: 'date' });
    const filename = `piano-touch-export-${currentDay}.json`;
    setIsExporting(true);
    try {
      const payload = buildMeasuresExportPayload(
        {
          keyWeightRatio: measureStoreState.keyWeightRatio,
          keys: measureStoreState.keys,
          wippenRadiusWeight: measureStoreState.wippenRadiusWeight,
        },
        profile,
      );
      const blob = createMeasuresExportBlob(payload);
      downloadBlob(blob, filename);
    } finally {
      setIsExporting(false);
    }
  }, [downloadBlob, measureStoreState, profile]);

  return { exportMeasures, isExporting };
};
