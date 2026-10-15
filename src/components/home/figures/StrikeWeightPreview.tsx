import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { useTranslation } from '@/hooks/use-translation';

import {
  DEMO_DESIGN,
  DEMO_KEY_COUNT,
  demoMeasured,
  demoStandardStrikeWeight,
} from './demo-sample';
import { dotsPath, linePath, plotY, type PlotBox } from './plot';

const BOX: PlotBox = {
  from: 0,
  height: 128,
  max: 15,
  min: 3,
  to: DEMO_KEY_COUNT - 1,
  width: 288,
  x: 8,
  y: 12,
};

const SELECTED = DEMO_DESIGN.strikeWeightLevel;

/**
 * Three of the thirteen stand out, so the fan reads as a graded family rather
 * than a smear — the same three the chart's own axis labels call out.
 */
const LANDMARKS = [
  StrikeWeightLevel.Level1,
  StrikeWeightLevel.Level9,
  StrikeWeightLevel.Level13,
];

const levels = Object.values(StrikeWeightLevel);

/** Where a curve leaves the box, for the number written at its end. */
const endOf = (level: StrikeWeightLevel) =>
  plotY(BOX, demoStandardStrikeWeight[level][BOX.to] ?? BOX.min) + 3;

/**
 * The strike weight of the demonstration piano against Stanwood's standard
 * curves, one of them picked.
 *
 * It stands for the design pages: a fan of references, one chosen, and the
 * measurements to judge it against.
 */
export const StrikeWeightPreview = () => {
  const { t } = useTranslation();

  return (
    <svg
      viewBox="0 0 320 150"
      className="block min-h-0 w-full flex-1"
      role="img"
      aria-label={t(
        'Measured strike weights against the standard curves SW#1 to SW#13, with SW#5 picked out.',
      )}
    >
      {levels
        .filter((level) => level !== SELECTED && !LANDMARKS.includes(level))
        .map((level) => (
          <path
            key={level}
            d={linePath(demoStandardStrikeWeight[level], BOX)}
            strokeWidth="0.8"
            fill="none"
            className="stroke-ptl-series-standard-soft"
          />
        ))}
      {LANDMARKS.map((level) => (
        <path
          key={level}
          d={linePath(demoStandardStrikeWeight[level], BOX)}
          strokeWidth="1.2"
          fill="none"
          className="stroke-ptl-series-standard"
        />
      ))}
      <path
        d={dotsPath(demoMeasured.strikeWeight, BOX, 1.4)}
        opacity="0.75"
        className="fill-ptl-series-balance"
      />
      <path
        d={linePath(demoStandardStrikeWeight[SELECTED], BOX)}
        strokeWidth="2.4"
        fill="none"
        className="stroke-ptl-brass"
      />

      {[...LANDMARKS, SELECTED].map((level) => (
        <text
          key={level}
          x="302"
          y={endOf(level)}
          className={
            level === SELECTED
              ? 'fill-ptl-brass font-mono text-[8.5px] font-semibold'
              : 'fill-ptl-ink-3 font-mono text-[8px]'
          }
        >
          {level.replace('SW#', '')}
        </text>
      ))}
    </svg>
  );
};
