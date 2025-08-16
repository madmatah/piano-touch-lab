import type { XYCoordinates } from '../coordinates';

export const computePolygonCentroid = (
  polygon: XYCoordinates[],
): XYCoordinates => {
  let twiceSignedArea = 0;
  let centroidX = 0;
  let centroidY = 0;
  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i] as [number, number];
    const next = polygon[(i + 1) % polygon.length] as [number, number];
    const [x0, y0] = current;
    const [x1, y1] = next;
    const cross = x0 * y1 - x1 * y0;
    twiceSignedArea += cross;
    centroidX += (x0 + x1) * cross;
    centroidY += (y0 + y1) * cross;
  }
  if (twiceSignedArea === 0)
    return [polygon[0]?.[0] ?? 0, polygon[0]?.[1] ?? 0];
  const area = twiceSignedArea * 0.5;
  return [centroidX / (6 * area), centroidY / (6 * area)];
};
