import { keyboardLength } from '@/lib/constants';

export interface FrictionZone {
  lower: number;
  higher: number;
}

export interface KeyFrictionThresholds {
  highZone: FrictionZone;
  mediumZone: FrictionZone;
  lowZone: FrictionZone;
}

const mediumFrictionBassWeight = 15;
const mediumFrictionTrebleWeight = 11;

const mediumFrictionTolerance = 2;
const highFrictionZoneLength = 4;
const lowFrictionZoneLength = 4;

export const getKeyFrictionThresholds = (
  key: number,
): KeyFrictionThresholds => {
  const mediumFrictionWeightForKey =
    mediumFrictionBassWeight +
    ((mediumFrictionTrebleWeight - mediumFrictionBassWeight) * (key - 1)) /
      (keyboardLength - 1);

  return {
    highZone: {
      higher:
        mediumFrictionWeightForKey +
        mediumFrictionTolerance +
        highFrictionZoneLength,
      lower: mediumFrictionWeightForKey + mediumFrictionTolerance,
    },
    lowZone: {
      higher: mediumFrictionWeightForKey - mediumFrictionTolerance,
      lower:
        mediumFrictionWeightForKey -
        mediumFrictionTolerance -
        lowFrictionZoneLength,
    },
    mediumZone: {
      higher: mediumFrictionWeightForKey + mediumFrictionTolerance,
      lower: mediumFrictionWeightForKey - mediumFrictionTolerance,
    },
  };
};

export const getKeyboardFrictionThresholds = (): KeyFrictionThresholds[] => {
  return Array.from({ length: keyboardLength }, (_, i) =>
    getKeyFrictionThresholds(i + 1),
  );
};
