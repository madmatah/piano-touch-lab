import { strikeWeightData } from '@/lib/piano/touch-design/data/strike-weight';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';

import { TouchDesignChart, TouchDesignSerieVariant } from './TouchDesignChart';
import { type TouchDesignSerie } from './interfaces';
import { useMeasuredSerie } from './hooks/use-measured-serie';

export interface StrikeWeightChartProps {
  defaultHammerWeightLevelsToInclude?: StrikeWeightLevel[];
}

export const StrikeWeightChart = (props: StrikeWeightChartProps) => {
  const { measuredSerie, shouldBeDisplayed: shouldDisplayMeasuredSerie } =
    useMeasuredSerie((key) => key.strikeWeight, 'Measured', {
      sharpItemStyle: {
        color: '#333',
      },
      variant: TouchDesignSerieVariant.Measured,
    });

  const seriesWithBoldVariant = [
    StrikeWeightLevel.Level1,
    StrikeWeightLevel.Level5,
    StrikeWeightLevel.Level9,
    StrikeWeightLevel.Level13,
  ];

  const defaultSeriesToInclude = props.defaultHammerWeightLevelsToInclude ?? [
    StrikeWeightLevel.Level1,
    StrikeWeightLevel.Level2,
    StrikeWeightLevel.Level3,
    StrikeWeightLevel.Level4,
    StrikeWeightLevel.Level5,
    StrikeWeightLevel.Level6,
    StrikeWeightLevel.Level7,
    StrikeWeightLevel.Level8,
    StrikeWeightLevel.Level9,
    StrikeWeightLevel.Level10,
    StrikeWeightLevel.Level11,
    StrikeWeightLevel.Level12,
    StrikeWeightLevel.Level13,
  ];

  const defaultSeries = defaultSeriesToInclude.map(
    (hammerLevel): TouchDesignSerie => ({
      data: strikeWeightData[hammerLevel],
      name: `${hammerLevel}`,
      variant: seriesWithBoldVariant.includes(hammerLevel)
        ? TouchDesignSerieVariant.DefaultBold
        : TouchDesignSerieVariant.Default,
    }),
  );

  const series: TouchDesignSerie[] = [
    ...defaultSeries,
    ...(shouldDisplayMeasuredSerie ? [measuredSerie] : []),
  ];

  return (
    <TouchDesignChart
      title="Strike Weight"
      series={series}
      yAxisName="Strike Weight"
    />
  );
};
