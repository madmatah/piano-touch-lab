import { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const useChartDimension = (): { chartHeight: number } => {
  const isLargeScreen = useMediaQuery('(min-width: 1280px)');
  const isVeryLargeScreen = useMediaQuery('(min-width: 1700px)');

  const chartHeight = useMemo(() => {
    if (isVeryLargeScreen) {
      return 600;
    }
    if (isLargeScreen) {
      return 500;
    }
    return 400;
  }, [isLargeScreen, isVeryLargeScreen]);

  return {
    chartHeight,
  };
};
