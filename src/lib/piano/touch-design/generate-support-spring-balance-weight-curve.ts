interface SupportSpringBalanceWeightCurveParams {
  numberOfSprings: number;
  baseTension: number;
  tensionDropIndex: number;
}

export const generateSupportSpringBalanceWeightCurve = ({
  numberOfSprings,
  baseTension,
  tensionDropIndex,
}: SupportSpringBalanceWeightCurveParams): number[] => {
  if (numberOfSprings <= 0) {
    return [];
  }

  const normalizedTensionDropIndex = Math.max(1, tensionDropIndex);
  const effectiveTensionDropIndex = Math.min(
    normalizedTensionDropIndex,
    numberOfSprings,
  );

  const curve: number[] = [];

  for (let i = 1; i <= numberOfSprings; i++) {
    if (i < effectiveTensionDropIndex) {
      curve.push(baseTension);
    } else {
      const progress =
        (i - effectiveTensionDropIndex) /
        (numberOfSprings + 1 - effectiveTensionDropIndex);
      const tension = baseTension * (1 - progress);
      curve.push(Math.max(tension, 0));
    }
  }

  return curve;
};
