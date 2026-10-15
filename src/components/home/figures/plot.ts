/**
 * The little bit of geometry the home page illustrations share.
 *
 * They are pictures, not charts: no axes, no hover, no scales to negotiate —
 * a series, a box to fit it in, and a path.
 */
export interface PlotBox {
  /** The series index the drawing starts at, and the one it ends at. */
  from: number;
  height: number;
  /** The weights at the top and the bottom of the box. */
  max: number;
  min: number;
  to: number;
  width: number;
  /** Left edge of the drawing inside the box. */
  x: number;
  /** Top edge of the drawing inside the box. */
  y: number;
}

const round = (value: number) => Number(value.toFixed(1));

export const plotX = (box: PlotBox, index: number) =>
  round(box.x + ((index - box.from) / (box.to - box.from)) * box.width);

export const plotY = (box: PlotBox, value: number) =>
  round(box.y + ((box.max - value) / (box.max - box.min)) * box.height);

const inBox = (
  value: number | null | undefined,
  box: PlotBox,
  index: number,
): value is number =>
  value !== null && value !== undefined && index >= box.from && index <= box.to;

/** A line through the values that are there, broken where they are not. */
export const linePath = (
  values: readonly (number | null)[],
  box: PlotBox,
): string => {
  let path = '';
  let isDrawing = false;
  for (let index = box.from; index <= box.to; index += 1) {
    const value = values[index];
    if (value === null || value === undefined) {
      isDrawing = false;
      continue;
    }
    path += `${isDrawing ? 'L' : 'M'}${plotX(box, index)} ${plotY(box, value)}`;
    isDrawing = true;
  }
  return path;
};

/** A ribbon between two per-index weights, run out past each end of the box. */
export const bandPath = (
  bounds: readonly { lower: number; higher: number }[],
  box: PlotBox,
  overhang: number,
): string => {
  const edge = (index: number) =>
    index === box.from ? -overhang : index === box.to ? overhang : 0;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let index = box.from; index <= box.to; index += 1) {
    const bound = bounds[index];
    if (bound === undefined) {
      continue;
    }
    const x = plotX(box, index) + edge(index);
    top.push(`${top.length === 0 ? 'M' : 'L'}${x} ${plotY(box, bound.higher)}`);
    bottom.push(`L${x} ${plotY(box, bound.lower)}`);
  }
  return top.length === 0 ? '' : `${top.join('')}${bottom.reverse().join('')}z`;
};

export const dotsPath = (
  values: readonly (number | null)[],
  box: PlotBox,
  radius: number,
): string =>
  values
    .map((value, index) => {
      if (!inBox(value, box, index)) {
        return '';
      }
      const x = plotX(box, index);
      const y = plotY(box, value);
      return (
        `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0` +
        `a${radius} ${radius} 0 1 0 ${-radius * 2} 0z`
      );
    })
    .join('');

export const diamondsPath = (
  values: readonly (number | null)[],
  box: PlotBox,
  radius: number,
): string =>
  values
    .map((value, index) => {
      if (!inBox(value, box, index)) {
        return '';
      }
      const x = plotX(box, index);
      const y = plotY(box, value);
      return `M${x} ${y - radius}l${radius} ${radius}l${-radius} ${radius}l${-radius} ${-radius}z`;
    })
    .join('');

/** A row of triangles, pointing down for a down weight, up for an up weight. */
export const trianglesPath = (
  values: readonly (number | null)[],
  box: PlotBox,
  size: { halfWidth: number; height: number },
  pointing: 'up' | 'down',
): string => {
  const { halfWidth, height } = size;
  /** The weight is the middle of the triangle, not its base or its tip. */
  const base = height / 2;
  return values
    .map((value, index) => {
      if (!inBox(value, box, index)) {
        return '';
      }
      const x = plotX(box, index);
      const y = plotY(box, value);
      return pointing === 'down'
        ? `M${x - halfWidth} ${y - base}h${halfWidth * 2}l${-halfWidth} ${height}z`
        : `M${x - halfWidth} ${y + base}h${halfWidth * 2}l${-halfWidth} ${-height}z`;
    })
    .join('');
};

/** A comb of bars standing on a weight, one per key: a tapering tension. */
export const barsPath = (
  values: readonly (number | null)[],
  box: PlotBox,
  width: number,
  floor: number,
): string => {
  const bottom = plotY(box, floor);
  return values
    .map((value, index) => {
      if (!inBox(value, box, index)) {
        return '';
      }
      const x = plotX(box, index);
      const y = plotY(box, value);
      return `M${x - width / 2} ${y}h${width}V${bottom}h${-width}z`;
    })
    .join('');
};
