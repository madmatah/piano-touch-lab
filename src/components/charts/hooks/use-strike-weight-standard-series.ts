import { TouchDesignSerieVariant } from '../TouchDesignChart';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { strikeWeightData } from '@/lib/piano/touch-design/data/strike-weight';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { TouchDesignSerie } from '../interfaces';

export const useStrikeWeightStandardSeries = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  levels: StrikeWeightLevel[],
) => {
  const seriesWithBoldVariant = [
    StrikeWeightLevel.Level1,
    StrikeWeightLevel.Level5,
    StrikeWeightLevel.Level9,
    StrikeWeightLevel.Level13,
  ];

  return levels.map(
    (hammerLevel): TouchDesignSerie => ({
      data: keyboard
        .map((key) => strikeWeightData[hammerLevel]?.[key.number - 1])
        .getKeys(),
      name: `${hammerLevel}`,
      variant: seriesWithBoldVariant.includes(hammerLevel)
        ? TouchDesignSerieVariant.DefaultBold
        : TouchDesignSerieVariant.Default,
    }),
  );
};
