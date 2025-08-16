import type { XYCoordinates } from '@/lib/geometry/coordinates';
import { computePolygonCentroid } from '@/lib/geometry/polygon/compute-polygon-centroid';
import type { Polygon } from '@/lib/geometry/polygon/polygon';
import {
  getKeyboardFrictionThresholds,
  type FrictionZone,
  type KeyFrictionThresholds,
} from '@/lib/touch-design/data/friction';
import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  SeriesOption,
} from 'echarts';
import { useMemo } from 'react';

export interface FrictionZonePolygons {
  high: Polygon;
  medium: Polygon;
  low: Polygon;
}

export const FRICTION_ZONE_COLORS = {
  highFill: 'rgba(237, 203, 145, 0.4)',
  highLabel: 'rgba(139, 69, 19, 0.5)',
  lowFill: 'rgba(145, 237, 227, 0.4)',
  lowLabel: 'rgba(0, 100, 100, 0.5)',
  mediumFill: 'rgba(144, 238, 144, 0.4)',
  mediumLabel: 'rgba(34, 139, 34, 0.5)',
};

export const FRICTION_LABEL_ROTATION_RAD = -0.05;

export const buildFrictionZonePolygon = (
  frictionThresholds: KeyFrictionThresholds[],
  zoneSelector: (threshold: KeyFrictionThresholds) => FrictionZone,
): Polygon => {
  const upper = frictionThresholds.map<XYCoordinates>((threshold, i) => [
    i + 1,
    zoneSelector(threshold).higher,
  ]);
  const lower = frictionThresholds
    .map<XYCoordinates>((threshold, i) => [
      i + 1,
      zoneSelector(threshold).lower,
    ])
    .reverse();
  return upper.concat(lower);
};

export const buildFrictionZoneSeries = (
  rotationRad: number = FRICTION_LABEL_ROTATION_RAD,
): SeriesOption[] => {
  const thresholds = getKeyboardFrictionThresholds();

  const highZonePolygon = buildFrictionZonePolygon(
    thresholds,
    (t) => t.highZone,
  );
  const mediumZonePolygon = buildFrictionZonePolygon(
    thresholds,
    (t) => t.mediumZone,
  );
  const lowZonePolygon = buildFrictionZonePolygon(thresholds, (t) => t.lowZone);

  const buildSerie = (
    zonePolygon: Polygon,
    zoneColor: string,
    zoneName: string,
    zoneLabelColor: string,
  ): SeriesOption => ({
    color: zoneColor,
    data: [0],
    name: zoneName,
    renderItem: (
      _params: CustomSeriesRenderItemParams,
      api: CustomSeriesRenderItemAPI,
    ) => {
      const polygonPointsPx = zonePolygon.map((pt) => api.coord(pt));
      const [cxData, cyData] = computePolygonCentroid(zonePolygon);
      const [cxPx, cyPx] = api.coord([cxData, cyData]);
      return {
        children: [
          {
            shape: { points: polygonPointsPx },
            style: { fill: zoneColor, stroke: 'transparent' },
            type: 'polygon',
          },
          {
            children: [
              {
                style: {
                  fill: zoneLabelColor,
                  font: 'bold 16px sans-serif',
                  text: zoneName,
                  textAlign: 'center',
                  textVerticalAlign: 'middle',
                  x: 0,
                  y: 0,
                },
                type: 'text',
                z2: 10,
              },
            ],
            position: [cxPx, cyPx],
            rotation: rotationRad,
            type: 'group',
          },
        ],
        type: 'group',
      };
    },
    silent: true,
    type: 'custom' as const,
    z: 0,
  });

  return [
    buildSerie(
      highZonePolygon,
      FRICTION_ZONE_COLORS.highFill,
      'High friction',
      FRICTION_ZONE_COLORS.highLabel,
    ),
    buildSerie(
      mediumZonePolygon,
      FRICTION_ZONE_COLORS.mediumFill,
      'Medium friction',
      FRICTION_ZONE_COLORS.mediumLabel,
    ),
    buildSerie(
      lowZonePolygon,
      FRICTION_ZONE_COLORS.lowFill,
      'Low friction',
      FRICTION_ZONE_COLORS.lowLabel,
    ),
  ];
};

export const useFrictionZonesSeries = () => {
  return useMemo(() => buildFrictionZoneSeries(), []);
};
