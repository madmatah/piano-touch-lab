import type { EChartsType } from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  findKeyAtBackPosition,
  type KeyboardGeometry,
} from '@/lib/piano/keyboard/keyboard-geometry';

export interface HoveredKeyApi {
  /** Pass to `<ReactECharts onChartReady>`. */
  bindChart: (chart: EChartsType) => void;
  /** Spread on the figure: makes it focusable and the arrows move the reading. */
  figureProps: {
    onKeyDown: React.KeyboardEventHandler;
    tabIndex: 0;
  };
  hoveredKey: number | null;
  setHoveredKey: (keyNumber: number | null) => void;
}

/**
 * Which key the reader is looking at.
 *
 * One piece of state feeds the brass band across the plot, the key lit on the
 * keyboard, the octave mark in bold and the reading panel beside the chart.
 * It comes from the pointer over the plot, from the pointer over the keyboard,
 * or from the arrow keys.
 */
export const useHoveredKey = (
  geometry: KeyboardGeometry,
  keyCount: number,
  gridCount = 1,
): HoveredKeyApi => {
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);
  // The chart is bound once, but the keyboard can change under it when the
  // reader edits the layout, so the handler reads the geometry through a ref.
  const geometryRef = useRef(geometry);
  useEffect(() => {
    geometryRef.current = geometry;
  }, [geometry]);

  const bindChart = useCallback(
    (chart: EChartsType) => {
      const zr = chart.getZr();

      const onMove = (event: { offsetX: number; offsetY: number }) => {
        const point = [event.offsetX, event.offsetY];
        const gridIndex = Array.from({ length: gridCount }, (_, i) => i).find(
          (index) => chart.containPixel({ gridIndex: index }, point),
        );
        if (gridIndex === undefined) {
          setHoveredKey(null);
          return;
        }
        // A point gives back a point: its first coordinate is the key axis.
        const [position] = [
          chart.convertFromPixel({ gridIndex }, point),
        ].flat();
        setHoveredKey(
          position === undefined
            ? null
            : findKeyAtBackPosition(geometryRef.current, position),
        );
      };
      const onOut = () => setHoveredKey(null);

      // Nothing is unbound first: `onChartReady` fires once per instance, and
      // zrender shares these two events with ECharts itself, whose listeners
      // an argument-less `off` would take down with ours.
      zr.on('mousemove', onMove);
      zr.on('globalout', onOut);
    },
    [gridCount],
  );

  const onKeyDown = useCallback<React.KeyboardEventHandler>(
    (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      event.preventDefault();
      setHoveredKey((current) => {
        if (current === null) {
          return Math.ceil(keyCount / 2);
        }
        const next = current + (event.key === 'ArrowRight' ? 1 : -1);
        return Math.min(Math.max(next, 1), keyCount);
      });
    },
    [keyCount],
  );

  return {
    bindChart,
    figureProps: { onKeyDown, tabIndex: 0 },
    hoveredKey,
    setHoveredKey,
  };
};
