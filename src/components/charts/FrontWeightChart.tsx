import { frontWeightData } from '@/lib/touch-design/data/front-weights';
import { FrontWeightLevel } from '@/lib/touch-design/front-weight-level';

import {
  TouchDesignChart,
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from './TouchDesignChart';
import { useMeasuredSerie } from './hooks/use-measured-serie';

export interface FrontWeightChartProps {
  defaultFrontWeightLevelsToInclude?: FrontWeightLevel[];
}

export const FrontWeightChart = (props: FrontWeightChartProps) => {
  const { measuredSerie, shouldBeDisplayed: shouldDisplayMeasuredSerie } =
    useMeasuredSerie(
      (key) => key.frontWeight,
      'Measured',
      TouchDesignSerieVariant.Measured,
    );

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
