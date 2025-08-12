import { strikeWeightData } from '@/lib/touch-design/data/strike-weight';
import { StrikeWeightLevel } from '@/lib/touch-design/hammer-weight-level';

import {
  TouchDesignChart,
  TouchDesignSerieVariant,
  type TouchDesignSerie,
} from './TouchDesignChart';

export interface StrikeWeightChartProps {
  defaultHammerWeightLevelsToInclude?: StrikeWeightLevel[];
}

export const StrikeWeightChart = (props: StrikeWeightChartProps) => {
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

  const series: TouchDesignSerie[] = defaultSeriesToInclude.map(
    (hammerLevel): TouchDesignSerie => ({
      data: strikeWeightData[hammerLevel],
      name: `${hammerLevel}`,
      variant: seriesWithBoldVariant.includes(hammerLevel)
        ? TouchDesignSerieVariant.DefaultBold
        : TouchDesignSerieVariant.Default,
    })
  );

  return <TouchDesignChart series={series} yAxisName="Strike Weight" />;
};
