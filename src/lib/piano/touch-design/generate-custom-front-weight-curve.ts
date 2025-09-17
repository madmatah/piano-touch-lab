import { frontWeightData } from './data/front-weights';
import { FrontWeightLevel } from './front-weight-level';

const P_COEFFS = [
  -2.2676002149678996e-13, 7.956109243575115e-11, -1.1034993717439304e-8,
  7.5465176293181945e-7, -2.5744398564424706e-5, 3.935575452636225e-4,
  -7.0825409712803366e-3, 1.7062876668821374,
];

function evalPoly(coeffs: number[], x: number): number {
  let y = 0;
  for (let i = 0; i < coeffs.length; i++) {
    y = y * x + coeffs[i]!;
  }
  return y;
}

export const getFrontWeightCurve = (level: number) => {
  if (Object.keys(FrontWeightLevel).includes(`Level${level}`)) {
    return frontWeightData[
      FrontWeightLevel[`Level${level}` as keyof typeof FrontWeightLevel]
    ];
  }

  const factor = level - 5;
  return frontWeightData[FrontWeightLevel.Level5].map((value, index) => {
    return value + factor * evalPoly(P_COEFFS, index);
  });
};
