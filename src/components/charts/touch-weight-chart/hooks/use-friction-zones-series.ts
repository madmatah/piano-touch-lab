import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  SeriesOption,
} from 'echarts';
import { useMemo } from 'react';

import type { XYCoordinates } from '@/lib/geometry/coordinates';
import type { Polygon } from '@/lib/geometry/polygon/polygon';
import type { Key } from '@/lib/piano/keyboard';
import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';
import {
  getKeyFrictionThresholds,
  type FrictionZone,
  type KeyFrictionThresholds,
} from '@/lib/piano/touch-design/data/friction';

import { MONO_FONT } from '../../echarts/build-base-option';
import type { ChartTokens } from '../../chart-tokens';

/** The reference zones, from the top of the friction panel down. */
export const FRICTION_ZONE_KINDS = ['high', 'medium', 'low'] as const;

export type FrictionZoneKind = (typeof FRICTION_ZONE_KINDS)[number];

export type FrictionZoneLabels = Record<FrictionZoneKind, string>;

export interface FrictionZonesInput {
  /** Index of the grid the friction panel is drawn in. */
  axisIndex: number;
  geometry: KeyboardGeometry;
  keys: readonly Key[];
  labels: FrictionZoneLabels;
  tokens: ChartTokens;
}

/** Air between a zone label and the right edge of the plot. */
const LABEL_INSET = 4;

/** A zone boundary above one key, in the coordinates of the plot. */
interface ZoneEdge {
  position: number;
  zone: FrictionZone;
}

const zoneOf = (
  thresholds: KeyFrictionThresholds,
  kind: FrictionZoneKind,
): FrictionZone => {
  switch (kind) {
    case 'high':
      return thresholds.highZone;
    case 'low':
      return thresholds.lowZone;
    default:
      return thresholds.mediumZone;
  }
};

/**
 * Which reference zone a friction reading falls in.
 *
 * The zones only span a few grams either side of the ideal, so a reading past
 * the drawn band still belongs to the zone it sits beyond.
 */
export const frictionZoneAt = (
  friction: number | null | undefined,
  keyNumber: number,
  keyboardSize: number,
): FrictionZoneKind | null => {
  if (friction === null || friction === undefined || Number.isNaN(friction)) {
    return null;
  }
  const { mediumZone } = getKeyFrictionThresholds(keyNumber, keyboardSize);
  if (friction > mediumZone.higher) {
    return 'high';
  }
  if (friction < mediumZone.lower) {
    return 'low';
  }
  return 'medium';
};

/**
 * The band of one zone, as a closed polygon.
 *
 * The ideal friction drifts from bass to treble, so every key contributes a
 * point to both edges of the band; the band then runs out to the sides of the
 * plot, as the design draws it, rather than stopping at the outer keys.
 */
export const buildFrictionZonePolygon = (
  edges: readonly ZoneEdge[],
  plotWidth: number,
): Polygon => {
  const first = edges[0];
  const last = edges[edges.length - 1];
  if (!first || !last) {
    return [];
  }

  const upper = edges.map<XYCoordinates>((edge) => [
    edge.position,
    edge.zone.higher,
  ]);
  const lower = [...edges]
    .reverse()
    .map<XYCoordinates>((edge) => [edge.position, edge.zone.lower]);

  return [
    [0, first.zone.higher],
    ...upper,
    [plotWidth, last.zone.higher],
    [plotWidth, last.zone.lower],
    ...lower,
    [0, first.zone.lower],
  ];
};

/**
 * The friction zones, painted behind the friction readings.
 *
 * They are a `custom` series rather than a background image because they
 * follow the value axis: the band is the same two grams wide whatever the
 * scale ends up being.
 */
export const buildFrictionZoneSeries = ({
  axisIndex,
  geometry,
  keys,
  labels,
  tokens,
}: FrictionZonesInput): SeriesOption[] => {
  const fillByKind: Record<FrictionZoneKind, string> = {
    high: tokens.zoneHigh,
    low: tokens.zoneLow,
    medium: tokens.zoneMedium,
  };

  const buildSerie = (kind: FrictionZoneKind): SeriesOption => {
    const edges = keys.map<ZoneEdge>((key) => ({
      position: geometry.keysByNumber.get(key.number)?.center ?? 0,
      zone: zoneOf(getKeyFrictionThresholds(key.number, keys.length), kind),
    }));
    const polygon = buildFrictionZonePolygon(edges, geometry.width);
    const lastEdge = edges[edges.length - 1];
    // The label sits just past the right edge of the plot, level with the
    // band it names — the design states the zones once, in the treble. Inside
    // the plot, where the design draws it, it covered the friction of the
    // last keys; the margin on that side holds nothing else.
    const labelValue = lastEdge
      ? (lastEdge.zone.higher + lastEdge.zone.lower) / 2
      : 0;

    return {
      coordinateSystem: 'cartesian2d',
      data: [0],
      name: labels[kind],
      renderItem: (
        _params: CustomSeriesRenderItemParams,
        api: CustomSeriesRenderItemAPI,
      ) => {
        const label = api.coord([geometry.width, labelValue]);
        return {
          children: [
            {
              shape: { points: polygon.map((point) => api.coord(point)) },
              style: { fill: fillByKind[kind], stroke: 'transparent' },
              type: 'polygon',
            },
            {
              style: {
                // zrender's own names: `textAlign` would be read as a legacy
                // style and the rest of this block converted with it.
                align: 'left',
                fill: tokens.inkSubtle,
                font: `10px ${MONO_FONT}`,
                text: labels[kind],
                verticalAlign: 'middle',
                x: (label[0] ?? 0) + LABEL_INSET,
                y: label[1] ?? 0,
              },
              type: 'text',
            },
          ],
          type: 'group',
        };
      },
      silent: true,
      type: 'custom' as const,
      xAxisIndex: axisIndex,
      yAxisIndex: axisIndex,
      z: 0,
    };
  };

  return FRICTION_ZONE_KINDS.map(buildSerie);
};

export const useFrictionZonesSeries = (
  input: FrictionZonesInput,
): SeriesOption[] => {
  const { axisIndex, geometry, keys, labels, tokens } = input;
  return useMemo(
    () =>
      buildFrictionZoneSeries({ axisIndex, geometry, keys, labels, tokens }),
    [axisIndex, geometry, keys, labels, tokens],
  );
};
