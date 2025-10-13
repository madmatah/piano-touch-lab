import { useCallback } from 'react';

export const useValueFormatter: () => {
  formatDiff: (weight: number, unit?: string) => string;
  formatWeight: (weight: number, unit?: string) => string;
} = () => {
  const formatWeight = useCallback((weight: number, unit?: string) => {
    return weight.toFixed(1) + (unit ?? '');
  }, []);

  const formatDiff = useCallback((weight: number, unit?: string) => {
    const sign = weight >= 0 ? '+' : '-';
    const absoluteValue = Math.abs(weight);
    const formatted = absoluteValue.toFixed(1);
    const result = `${sign} ${formatted}` + (unit ?? '');
    return result;
  }, []);

  return {
    formatDiff,
    formatWeight,
  };
};
