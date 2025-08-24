import { usePianoMeasures } from '@/hooks/use-measure-store';
import {
  buildMeasuresExportPayload,
  createMeasuresExportBlob,
} from '@/lib/backup/measure-backup';
import { useCallback, useState } from 'react';
import { useDownloadBlob } from './use-download-blob';
import { formatISO } from 'date-fns';

export const useExportMeasures = (profile: string = 'default') => {
  const measures = usePianoMeasures();
  const [isExporting, setIsExporting] = useState(false);
  const { downloadBlob } = useDownloadBlob();

  const exportMeasures = useCallback(() => {
    const currentDay = formatISO(new Date(), { representation: 'date' });
    const filename = `piano-touch-export-${currentDay}.json`;
    setIsExporting(true);
    try {
      const payload = buildMeasuresExportPayload(measures, profile);
      const blob = createMeasuresExportBlob(payload);
      downloadBlob(blob, filename);
    } finally {
      setIsExporting(false);
    }
  }, [downloadBlob, measures, profile]);

  return { exportMeasures, isExporting };
};
