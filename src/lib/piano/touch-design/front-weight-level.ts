export enum FrontWeightLevel {
  Level5 = 'FW#5',
  Level6 = 'FW#6',
  Level7 = 'FW#7',
  Level8 = 'FW#8',
  Level9 = 'FW#9',
}

export const frontWeightLevelToNumber = (level: FrontWeightLevel) => {
  return Number(level.replace('FW#', ''));
};
