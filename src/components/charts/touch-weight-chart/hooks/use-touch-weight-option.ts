import type {
  EChartsOption,
  SeriesOption,
  YAXisComponentOption,
} from 'echarts';
import { useMemo } from 'react';

import type { XYCoordinates } from '@/lib/geometry/coordinates';
import type { KeyWith } from '@/lib/piano/keyboard';
import type { KeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';

import { CHART_HEIGHTS, PLOT_INSET } from '../../chart-geometry';
import {
  buildKeyAxis,
  buildValueAxis,
  scaleFromReadings,
  scaleOver,
  MONO_FONT,
  type AxisScale,
} from '../../echarts/build-base-option';
import type { ChartTokens } from '../../chart-tokens';
import type { TouchDesignDataPoint, TouchDesignSerie } from '../../interfaces';
import {
  TOUCH_WEIGHT_SERIE_IDS,
  type TouchWeightSerieId,
  type TouchWeightSeries,
} from './use-touch-weight-series';

/** Room above a panel for the title the design writes there. */
const PLOT_TOP = 20;
/** The weight panel. `chart-geometry` only sizes single-panel plots. */
const WEIGHT_PLOT_HEIGHT = 240;
/** Air between the two panels, enough for the lower one's title. */
const PANE_GAP = 26;

/** The weight panel is the first grid, the friction panel the second. */
const WEIGHT_GRID = 0;
export const FRICTION_GRID = 1;

/**
 * Both panels, their margins and their titles, plus a hair so the lowest rule
 * is not clipped. `extra` is the room a printed sheet has left over, and it
 * all goes to the weight panel: the friction one reads a range of a few grams
 * and gains nothing from being stretched.
 */
export const touchWeightPlotHeight = (extra = 0) =>
  PLOT_TOP +
  WEIGHT_PLOT_HEIGHT +
  extra +
  PANE_GAP +
  CHART_HEIGHTS.frictionPlot +
  2;

/**
 * The scales of the design.
 *
 * They are a floor, not a ceiling: an atypical action is allowed to push a
 * scale further rather than have its readings quietly clipped.
 */
export const WEIGHT_SCALE: AxisScale = { interval: 20, max: 100, min: 0 };
const FRICTION_SCALE: AxisScale = { interval: 8, max: 24, min: 0 };

interface SerieStyle {
  gridIndex: number;
  symbol: string;
  symbolRotate?: number;
  symbolSize: number;
  token: keyof ChartTokens;
  z: number;
}

/** Symbols and sizes read off the mockup, at its drawing scale. */
const SERIE_STYLES: Record<TouchWeightSerieId, SerieStyle> = {
  balance: {
    gridIndex: WEIGHT_GRID,
    symbol: 'diamond',
    symbolSize: 7,
    token: 'seriesBalance',
    z: 4,
  },
  down: {
    gridIndex: WEIGHT_GRID,
    symbol: 'triangle',
    symbolRotate: 180,
    symbolSize: 6,
    token: 'seriesDown',
    z: 3,
  },
  friction: {
    gridIndex: FRICTION_GRID,
    symbol: 'circle',
    symbolSize: 5,
    token: 'seriesFriction',
    z: 3,
  },
  up: {
    gridIndex: WEIGHT_GRID,
    symbol: 'triangle',
    symbolSize: 6,
    token: 'seriesUp',
    z: 3,
  },
};

const isMeasured = (
  point: TouchDesignDataPoint,
): point is KeyWith<number> & TouchDesignDataPoint =>
  point.payload !== undefined && !Number.isNaN(point.payload);

/** A reading sits above the balance rail slot of its own key. */
const positionOf = (geometry: KeyboardPlacement, keyNumber: number): number =>
  geometry.keysByNumber.get(keyNumber)?.backCenter ?? 0;

const pointsOf = (
  serie: TouchDesignSerie,
  geometry: KeyboardPlacement,
): XYCoordinates[] =>
  serie.data
    .filter(isMeasured)
    .map((point) => [positionOf(geometry, point.number), point.payload]);

const valuesOf = (series: TouchDesignSerie[]): number[] =>
  series.flatMap((serie) =>
    serie.data.filter(isMeasured).map((point) => point.payload),
  );

const buildPanelAxis = (
  tokens: ChartTokens,
  scale: AxisScale,
  locale: string,
  gridIndex: number,
  title: string,
): YAXisComponentOption => ({
  ...buildValueAxis(tokens, scale, locale),
  gridIndex,
  // The quantity is named above its own panel: with two scales in one drawing,
  // the page heading can no longer say which is which.
  name: title,
  nameGap: 14,
  nameLocation: 'end',
  nameTextStyle: {
    align: 'left',
    color: tokens.ink,
    fontFamily: MONO_FONT,
    fontSize: 10,
  },
});

const buildScatterSerie = (
  serie: TouchDesignSerie,
  style: SerieStyle,
  geometry: KeyboardPlacement,
  tokens: ChartTokens,
): SeriesOption => ({
  data: pointsOf(serie, geometry),
  itemStyle: { color: tokens[style.token] },
  name: serie.name,
  silent: true,
  symbol: style.symbol,
  symbolRotate: style.symbolRotate,
  symbolSize: style.symbolSize,
  type: 'scatter',
  xAxisIndex: style.gridIndex,
  yAxisIndex: style.gridIndex,
  z: style.z,
});

/** The tie between the down and up readings of one key: the touch's spread. */
const buildRangeSerie = (
  down: TouchDesignSerie,
  up: TouchDesignSerie,
  geometry: KeyboardPlacement,
  tokens: ChartTokens,
): SeriesOption => {
  const upByKey = new Map(
    up.data.filter(isMeasured).map((point) => [point.number, point.payload]),
  );

  return {
    coordinateSystem: 'cartesian2d',
    data: down.data.filter(isMeasured).flatMap((point) => {
      const upValue = upByKey.get(point.number);
      if (upValue === undefined) {
        return [];
      }
      const position = positionOf(geometry, point.number);
      return [
        {
          coords: [
            [position, upValue],
            [position, point.payload],
          ] as XYCoordinates[],
        },
      ];
    }),
    lineStyle: { color: tokens.range, width: 1.3 },
    name: '',
    silent: true,
    type: 'lines',
    xAxisIndex: WEIGHT_GRID,
    yAxisIndex: WEIGHT_GRID,
    z: 1,
  };
};

/** The firmer rule at the foot of a panel, which the grid alone does not draw. */
const buildBaselineSerie = (
  gridIndex: number,
  tokens: ChartTokens,
  /** The foot of the panel, which is not zero once the floor has been raised. */
  foot: number,
): SeriesOption => ({
  data: [],
  markLine: {
    data: [{ yAxis: foot }],
    label: { show: false },
    lineStyle: { color: tokens.axisStrong, type: 'solid', width: 1.2 },
    silent: true,
    symbol: 'none',
  },
  name: '',
  silent: true,
  type: 'line',
  xAxisIndex: gridIndex,
  yAxisIndex: gridIndex,
});

export interface TouchWeightOptionInput {
  /** Room a printed sheet has left over, which the weight panel takes. */
  extraWeightHeight?: number;
  /** The reference bands behind the friction panel. */
  frictionZones: SeriesOption[];
  geometry: KeyboardPlacement;
  locale: string;
  panelTitles: { friction: string; weight: string };
  series: TouchWeightSeries;
  tokens: ChartTokens;
  visibleSeries: Readonly<Record<TouchWeightSerieId, boolean>>;
}

/**
 * One drawing, two stacked plots: weight above, friction below.
 *
 * They share the keyboard axis — and the keyboard drawn under the figure — so
 * a key reads as one column across both panels.
 *
 * The key being read is deliberately absent from here: it moves with every
 * pixel of the pointer, and rebuilding this option that often would redraw
 * the whole drawing. The brass band and the lit key are HTML, outside ECharts.
 */
export const useTouchWeightOption = (
  input: TouchWeightOptionInput,
): EChartsOption => {
  const {
    extraWeightHeight = 0,
    frictionZones,
    geometry,
    locale,
    panelTitles,
    series,
    tokens,
    visibleSeries,
  } = input;

  return useMemo(() => {
    // The scales take in every series, hidden ones included: switching a
    // series off should not move the grid under the others.
    const weightScale = scaleFromReadings(
      WEIGHT_SCALE,
      valuesOf([series.down, series.up, series.balance]),
    );
    const frictionScale = scaleOver(
      FRICTION_SCALE,
      valuesOf([series.friction]),
    );

    const echartsSeries: SeriesOption[] = [
      ...frictionZones,
      buildBaselineSerie(WEIGHT_GRID, tokens, weightScale.min),
      buildBaselineSerie(FRICTION_GRID, tokens, frictionScale.min),
      // The tie only means something while both of its ends are drawn.
      ...(visibleSeries.down && visibleSeries.up
        ? [buildRangeSerie(series.down, series.up, geometry, tokens)]
        : []),
      ...TOUCH_WEIGHT_SERIE_IDS.filter((id) => visibleSeries[id]).map((id) =>
        buildScatterSerie(series[id], SERIE_STYLES[id], geometry, tokens),
      ),
    ];

    return {
      animation: false,
      grid: [
        {
          height: WEIGHT_PLOT_HEIGHT + extraWeightHeight,
          left: PLOT_INSET.left,
          right: PLOT_INSET.right,
          top: PLOT_TOP,
        },
        {
          height: CHART_HEIGHTS.frictionPlot,
          left: PLOT_INSET.left,
          right: PLOT_INSET.right,
          top: PLOT_TOP + WEIGHT_PLOT_HEIGHT + extraWeightHeight + PANE_GAP,
        },
      ],
      legend: { show: false },
      series: echartsSeries,
      // The strip at the head of the figure is the reading: a tooltip would
      // say less, and only while the pointer rests.
      tooltip: { show: false },
      xAxis: [
        buildKeyAxis(geometry),
        { ...buildKeyAxis(geometry), gridIndex: FRICTION_GRID },
      ],
      yAxis: [
        buildPanelAxis(
          tokens,
          weightScale,
          locale,
          WEIGHT_GRID,
          panelTitles.weight,
        ),
        buildPanelAxis(
          tokens,
          frictionScale,
          locale,
          FRICTION_GRID,
          panelTitles.friction,
        ),
      ],
    };
  }, [
    extraWeightHeight,
    frictionZones,
    geometry,
    locale,
    panelTitles,
    series,
    tokens,
    visibleSeries,
  ]);
};
