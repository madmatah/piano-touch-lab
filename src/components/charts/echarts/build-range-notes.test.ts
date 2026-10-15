import { beforeEach, describe, expect, it } from 'bun:test';
import type { CustomSeriesOption } from 'echarts';

import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

import type { ChartTokens } from '../hooks/use-chart-tokens';
import type { KeyRangeNote } from '../interfaces';
import type { AxisScale } from './build-base-option';
import { buildRangeNotes } from './build-range-notes';

const GEOMETRY = {
  keysByNumber: new Map(
    [1, 2, 3, 4].map((number) => [number, { backCenter: number - 0.5 }]),
  ),
} as unknown as KeyboardGeometry;

const SCALE: AxisScale = { interval: 2, max: 10, min: 0 };

const TOKENS = { inkMuted: 'muted', inkSubtle: 'subtle' } as ChartTokens;

const COORDINATES = {
  coord: ([x, y]: [number, number]) => [x * 10, 100 - y * 10],
};

const drawn = (notes: KeyRangeNote[]) => {
  const series = buildRangeNotes(notes, GEOMETRY, SCALE, TOKENS);
  const renderItem = series.renderItem as (
    params: { dataIndex: number },
    api: typeof COORDINATES,
  ) => unknown;
  const element =
    Array.isArray(series.data) && series.data.length > 0
      ? renderItem({ dataIndex: 0 }, COORDINATES)
      : null;
  return { element, series };
};

describe('The buildRangeNotes() function', () => {
  let result: { element: unknown; series: CustomSeriesOption };

  describe('When a stretch is bracketed', () => {
    beforeEach(() => {
      result = drawn([{ from: 1, kind: 'bracket', text: '3 springs', to: 3 }]);
    });

    it('should rule the bracket under the top of the plot, from the first key to the last', () => {
      expect(result.element).toMatchObject({
        children: [
          {
            shape: {
              points: [
                [5, 28],
                [5, 20],
                [25, 20],
                [25, 28],
              ],
            },
            type: 'polyline',
          },
          {},
        ],
      });
    });

    it('should name it above its rule, centred over the stretch', () => {
      expect(result.element).toMatchObject({
        children: [
          {},
          {
            style: { fill: 'muted', text: '3 springs', x: 15, y: 16 },
            type: 'text',
          },
        ],
      });
    });
  });

  describe('When a stretch is only labelled', () => {
    beforeEach(() => {
      result = drawn([
        { from: 3, kind: 'label', text: 'without springs', to: 4 },
      ]);
    });

    it('should stand the label over the axis, centred over the stretch', () => {
      expect(result.element).toMatchObject({
        style: { fill: 'subtle', text: 'without springs', x: 30, y: 70 },
        type: 'text',
      });
    });
  });

  describe('When a stretch runs off the keyboard', () => {
    beforeEach(() => {
      result = drawn([{ from: 3, kind: 'label', text: 'beyond', to: 9 }]);
    });

    it('should leave it out', () => {
      expect(result.series.data).toEqual([]);
    });
  });
});
