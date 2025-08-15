import { frontWeightData } from '@/lib/touch-design/data/front-weights';
import { FrontWeightLevel } from '@/lib/touch-design/front-weight-level';

import {
  TouchDesignChart,
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from './TouchDesignChart';
import { usePianoMeasures } from '@/hooks/use-measure-store';
import { useMemo } from 'react';

export interface FrontWeightChartProps {
  defaultFrontWeightLevelsToInclude?: FrontWeightLevel[];
}

export const FrontWeightChart = (props: FrontWeightChartProps) => {
  const measures = usePianoMeasures();
  const measuredSerie: TouchDesignSerie = useMemo(() => {
    return {
      data:
        measures.keys?.map((key) =>
          key.frontWeight ? Number(key.frontWeight) : undefined,
        ) ?? [],
      name: 'Measured',
      variant: TouchDesignSerieVariant.Measured,
    };
  }, [measures]);
  const shouldDisplayMeasuredSerie = useMemo(() => {
    return measuredSerie.data.some((data) => data !== undefined);
  }, [measuredSerie]);

  const seriesWithBoldVariant = [
    FrontWeightLevel.Level5,
    FrontWeightLevel.Level7,
    FrontWeightLevel.Level9,
  ];

  const defaultSeriesToInclude = props.defaultFrontWeightLevelsToInclude ?? [
    FrontWeightLevel.Level5,
    FrontWeightLevel.Level6,
    FrontWeightLevel.Level7,
    FrontWeightLevel.Level8,
    FrontWeightLevel.Level9,
  ];

  const series: TouchDesignSerie[] = [
    ...defaultSeriesToInclude.map(
      (fwLevel): TouchDesignSerie => ({
        data: frontWeightData[fwLevel],
        name: `${fwLevel}`,
        variant: seriesWithBoldVariant.includes(fwLevel)
          ? TouchDesignSerieVariant.DefaultBold
          : TouchDesignSerieVariant.Default,
      }),
    ),
    ...(shouldDisplayMeasuredSerie ? [measuredSerie] : []),
  ].filter((serie) => serie !== undefined);

  return <TouchDesignChart series={series} yAxisName="Front Weight" />;
};
