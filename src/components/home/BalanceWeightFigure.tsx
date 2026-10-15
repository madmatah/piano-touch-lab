import { useMemo } from 'react';

import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { computeKeyboardGeometry } from '@/lib/piano/keyboard/keyboard-geometry';

const PLOT_HEIGHT = 160;
/** The keybed shows a sliver of itself below the front of the keys. */
const KEYBED_OVERHANG = 3;
const PLOT_TOP = 10;
/** The curve is drawn between these two weights, in grams. */
const WEIGHT_FLOOR = 40;
const WEIGHT_CEILING = 80;

/**
 * The balance weight of the piano on screen, key by key, drawn above its own
 * keyboard.
 *
 * The home page opens on the demo instrument, so this is a real measurement
 * set rather than a decorative squiggle — the figure is the argument.
 */
export const BalanceWeightFigure = ({
  caption,
  description,
}: {
  caption: string;
  description: string;
}) => {
  const analyzedKeyboard = useAnalyzedKeyboard();

  const figure = useMemo(() => {
    const keys = analyzedKeyboard.getKeys();
    const geometry = computeKeyboardGeometry(keys, {
      keyHeight: 126,
      whiteKeyWidth: 20,
    });

    const points = keys
      .map((key) => {
        const balanceWeight = key.payload.balanceWeight;
        const placed = geometry.keysByNumber.get(key.number);
        if (balanceWeight === null || !placed) {
          return null;
        }
        const ratio =
          (balanceWeight - WEIGHT_FLOOR) / (WEIGHT_CEILING - WEIGHT_FLOOR);
        return {
          x: placed.center,
          y: PLOT_TOP + PLOT_HEIGHT * (1 - Math.min(Math.max(ratio, 0), 1)),
        };
      })
      .filter((point) => point !== null);

    if (points.length < 2) {
      return null;
    }

    const keyboardTop = PLOT_TOP + PLOT_HEIGHT + 10;
    return {
      dots: points
        .map(
          (point) =>
            `M${point.x - 2.2} ${point.y}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0z`,
        )
        .join(''),
      geometry,
      height: keyboardTop + geometry.height + KEYBED_OVERHANG,
      keyboardTop,
      line: points
        .map(
          (point, index) =>
            `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
        )
        .join(''),
      stems: points
        .map((point) => `M${point.x} ${point.y + 3}V${keyboardTop - 2}`)
        .join(''),
    };
  }, [analyzedKeyboard]);

  if (!figure) {
    return null;
  }

  return (
    <figure className="m-0 mt-8 w-full max-w-[1080px]">
      <svg
        viewBox={`0 0 ${figure.geometry.width} ${figure.height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={description}
      >
        <defs>
          <linearGradient id="ptl-home-stem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ptl-brass)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--ptl-brass)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          d={figure.stems}
          strokeWidth="1"
          fill="none"
          stroke="url(#ptl-home-stem)"
        />
        <path
          d={figure.line}
          strokeWidth="1.6"
          fill="none"
          className="stroke-ptl-brass"
        />
        <path d={figure.dots} className="fill-ptl-series-down" />
        <g transform={`translate(0, ${figure.keyboardTop})`}>
          <rect
            x="0"
            y="0"
            width={figure.geometry.width}
            height={figure.geometry.height + KEYBED_OVERHANG}
            rx="3"
            className="fill-ptl-keybed"
          />
          <rect
            x="0"
            y="0"
            width={figure.geometry.width}
            height={figure.geometry.feltHeight}
            className="fill-ptl-felt"
          />
          <path
            d={figure.geometry.whiteKeys.map((key) => key.path).join('')}
            strokeWidth="0.8"
            className="fill-ptl-key-white stroke-ptl-key-white-edge"
          />
          <path
            d={figure.geometry.blackKeys.map((key) => key.path).join('')}
            className="fill-ptl-key-black"
          />
        </g>
      </svg>
      <figcaption className="px-0 pt-[18px] pb-[30px] font-serif text-base italic text-ptl-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
};
