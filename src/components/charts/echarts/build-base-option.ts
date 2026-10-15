import type { XAXisComponentOption, YAXisComponentOption } from 'echarts';

import { formatAxisValue } from '@/lib/format/format-weight';
import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

import { PLOT_INSET } from '../chart-geometry';
import type { ChartTokens } from '../hooks/use-chart-tokens';

export const MONO_FONT =
  "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace";

export interface AxisScale {
  interval: number;
  max: number;
  min: number;
  /** Shown on the topmost tick only, as the mockups do. */
  unit?: string;
  /** Faint lines between the labelled ones, as on the ratio charts. */
  minorSplit?: boolean;
}

/**
 * A design scale widened to whatever the instrument actually reads.
 *
 * Every scale in the mockups is a floor: an unusual piano stretches the axis
 * rather than have its outlying keys quietly dropped off the plot, which is
 * what ECharts does with a value outside an explicit min/max.
 */
export const scaleOver = (
  base: AxisScale,
  values: readonly number[],
): AxisScale =>
  values.length === 0
    ? base
    : {
        ...base,
        max:
          Math.ceil(Math.max(base.max, ...values) / base.interval) *
          base.interval,
        min:
          Math.floor(Math.min(base.min, ...values) / base.interval) *
          base.interval,
      };

/** The highest tick the interval actually lands on. */
const highestTick = (scale: AxisScale): number =>
  scale.min +
  Math.floor((scale.max - scale.min) / scale.interval) * scale.interval;

/**
 * How many decimals the ticks need, read off the interval.
 *
 * A scale ruled every 0.5 writes `6,0` and `6,5`, never `6` and `6,5`: a
 * column of axis labels is read by the position of its decimal point.
 */
const tickDecimals = (interval: number): number => {
  const text = String(interval);
  const point = text.indexOf('.');
  return point === -1 ? 0 : text.length - point - 1;
};

/**
 * The vertical scale.
 *
 * No axis line, no ticks, no axis name: the design keeps only the horizontal
 * rules and their values, and names the quantity in the page heading instead.
 */
export const buildValueAxis = (
  tokens: ChartTokens,
  scale: AxisScale,
  locale: string,
): YAXisComponentOption => ({
  axisLabel: {
    color: tokens.inkSubtle,
    fontFamily: MONO_FONT,
    fontSize: 11,
    formatter: (value: number) => {
      // The scale often ends above its last round tick, to leave the topmost
      // curve some air. That bare maximum is not labelled; the unit goes on
      // the highest round tick instead, as the mockups do.
      const topTick = highestTick(scale);
      if (value > topTick) {
        return '';
      }
      const decimals = tickDecimals(scale.interval);
      const text = formatAxisValue(value, locale, decimals);
      return scale.unit && value === topTick ? `${text} ${scale.unit}` : text;
    },
    margin: 10,
  },
  axisLine: { show: false },
  axisTick: { show: false },
  interval: scale.interval,
  max: scale.max,
  min: scale.min,
  minorSplitLine: scale.minorSplit
    ? { lineStyle: { color: tokens.gridSoft, width: 1 }, show: true }
    : { show: false },
  minorTick: { show: false },
  splitLine: { lineStyle: { color: tokens.grid, width: 1 }, show: true },
  type: 'value',
});

/**
 * The horizontal scale, in white-key units.
 *
 * It is invisible: the keyboard drawn under the plot is the axis, and it
 * covers exactly the same range.
 */
export const buildKeyAxis = (
  geometry: KeyboardGeometry,
): XAXisComponentOption => ({
  axisLabel: { show: false },
  axisLine: { show: false },
  axisTick: { show: false },
  max: geometry.width,
  min: 0,
  splitLine: { show: false },
  type: 'value',
});

export const buildGrid = (height: number) => ({
  bottom: 0,
  containLabel: false,
  height,
  left: PLOT_INSET.left,
  right: PLOT_INSET.right,
  top: 10,
});
