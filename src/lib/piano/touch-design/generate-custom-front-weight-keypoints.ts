export const generateCustomFrontWeightKeypoints = (
  level: number,
): Map<number, number> => {
  return new Map([
    [1, 1.7 * level + 25.9],
    [22, 1.6 * level + 21.4],
    [44, 1.5 * level + 15],
    [66, 1.4 * level + 5],
    [88, 1.3 * level - 8.2],
  ]);
};
