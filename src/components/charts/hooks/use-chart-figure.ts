import { useMemo } from 'react';

import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { computeKeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';

import { useHoveredKey, type HoveredKeyApi } from './use-hovered-key';

/**
 * The geometry a chart and its keyboard axis share, plus the key being read.
 *
 * One white key is one unit, so the chart's x axis and the keyboard drawn
 * under it use the same numbers and line up at any width.
 */
export const useChartFigure = <T>(
  keyboard: KeyboardLike<KeyWith<T>>,
  gridCount = 1,
) => {
  const keys = useMemo(() => keyboard.getKeys(), [keyboard]);
  const geometry = useMemo(() => computeKeyboardPlacement(keys), [keys]);
  const hover: HoveredKeyApi = useHoveredKey(
    geometry,
    keyboard.size,
    gridCount,
  );
  return { geometry, hover, keys };
};
