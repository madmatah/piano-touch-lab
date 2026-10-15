import type { CustomSeriesOption } from 'echarts';

import type { KeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

import type { ChartTokens } from '../hooks/use-chart-tokens';
import type { KeyRangeNote } from '../interfaces';
import { MONO_FONT, type AxisScale } from './build-base-option';

/**
 * Where a bracket stands, in pixels from the top rule, as the springs mockup
 * draws it: its rule, the ticks it drops at each end, and its label above.
 */
export const BRACKET = { gap: 4, rule: 20, tick: 8 } as const;

/** How far above the axis a bare label stands. */
export const LABEL_LIFT = 30;

/** The slice of the ECharts custom series API the notes are placed with. */
interface CoordinateApi {
  coord: (value: [number, number]) => number[];
}

/**
 * Stretches of the keyboard named on the plot itself — the keys the springs
 * are on, and those they are not — so that the reader sees a curve stop on
 * purpose rather than reading a gap.
 *
 * Placed by ECharts, from the axes, so that the notes stay over their keys
 * however wide the figure is drawn, on screen or on a sheet.
 */
export const buildRangeNotes = (
  notes: readonly KeyRangeNote[],
  geometry: KeyboardGeometry,
  scale: AxisScale,
  tokens: ChartTokens,
): CustomSeriesOption => {
  const placed = notes.flatMap((note) => {
    const from = geometry.keysByNumber.get(note.from)?.backCenter;
    const to = geometry.keysByNumber.get(note.to)?.backCenter;
    return from === undefined || to === undefined ? [] : [{ from, note, to }];
  });
  const textStyle = (fill: string) => ({
    align: 'center' as const,
    fill,
    fontFamily: MONO_FONT,
    fontSize: 11,
    verticalAlign: 'bottom' as const,
  });

  return {
    data: placed.map(({ from }) => [from, scale.min]),
    name: '',
    renderItem: (params, api) => {
      const { from, note, to } = placed[params.dataIndex]!;
      const { coord } = api as unknown as CoordinateApi;
      const [left = 0, top = 0] = coord([from, scale.max]);
      const [right = 0, bottom = 0] = coord([to, scale.min]);
      const middle = (left + right) / 2;

      if (note.kind === 'label') {
        return {
          style: {
            ...textStyle(tokens.inkSubtle),
            text: note.text,
            x: middle,
            y: bottom - LABEL_LIFT,
          },
          type: 'text',
        };
      }
      const rule = top + BRACKET.rule;
      return {
        children: [
          {
            shape: {
              points: [
                [left, rule + BRACKET.tick],
                [left, rule],
                [right, rule],
                [right, rule + BRACKET.tick],
              ],
            },
            style: { fill: 'none', lineWidth: 1.5, stroke: tokens.inkSubtle },
            type: 'polyline',
          },
          {
            style: {
              ...textStyle(tokens.inkMuted),
              text: note.text,
              x: middle,
              y: rule - BRACKET.gap,
            },
            type: 'text',
          },
        ],
        type: 'group',
      };
    },
    silent: true,
    type: 'custom',
    z: 4,
  };
};
