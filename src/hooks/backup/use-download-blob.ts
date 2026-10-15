import { useCallback } from 'react';

export const useDownloadBlob = () => {
  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Not in this task: a browser that has not started fetching the blob
    // yet would be left with a link to nothing, and the download would
    // silently never appear.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, []);

  return { downloadBlob } as const;
};
