import { TouchDesignSerieVariant } from '../TouchDesignChart';
import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';
import { frontWeightData } from '@/lib/piano/touch-design/data/front-weights';
import type { TouchDesignSerie } from '../interfaces';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';

export const useFrontWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: FrontWeightLevel[],
) => {
  const seriesWithBoldVariant = [
    FrontWeightLevel.Level5,
    FrontWeightLevel.Level7,
    FrontWeightLevel.Level9,
  ];

  return levels.map(
    (fwLevel): TouchDesignSerie => ({
      data: keyboard
        .map((key) => frontWeightData[fwLevel]?.[key.number - 1])
        .getKeys(),
      name: `${fwLevel}`,
      variant: seriesWithBoldVariant.includes(fwLevel)
        ? TouchDesignSerieVariant.DefaultBold
        : TouchDesignSerieVariant.Default,
    }),
  );
};
