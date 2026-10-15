import { getKeyFrictionThresholds } from '@/lib/piano/touch-design/data/friction';
import { useTranslation } from '@/hooks/use-translation';

import { DEMO_KEY_COUNT, demoMeasured } from './demo-sample';
import {
  bandPath,
  diamondsPath,
  dotsPath,
  plotX,
  plotY,
  trianglesPath,
  type PlotBox,
} from './plot';

/** F5 to E7, the two octaves where the demonstration piano jumps. */
const FROM = 56;
const TO = 79;
/** The key the balance weight steps up on, and by how much. */
const STEP_KEY = 68;
const STEP_GRAMS = 12;

const WEIGHTS: PlotBox = {
  from: FROM,
  height: 88,
  max: 75,
  min: 30,
  to: TO,
  width: 252,
  x: 12,
  y: 8,
};

const FRICTION: PlotBox = {
  ...WEIGHTS,
  height: 38,
  max: 20,
  min: 4,
  y: 108,
};

/** The grid the weights are read against, in grams. */
const GRID = [40, 50, 60, 70];

/**
 * The reference zones, as the friction chart computes them: the middle of the
 * band drifts down from the bass to the treble, so they are sloping ribbons
 * rather than stripes.
 */
const thresholds = Array.from({ length: DEMO_KEY_COUNT }, (_, index) =>
  getKeyFrictionThresholds(index + 1, DEMO_KEY_COUNT),
);

const ZONES = [
  {
    bounds: thresholds.map((zones) => zones.highZone),
    className: 'fill-ptl-zone-high',
  },
  {
    bounds: thresholds.map((zones) => zones.mediumZone),
    className: 'fill-ptl-zone-medium',
  },
  {
    bounds: thresholds.map((zones) => zones.lowZone),
    className: 'fill-ptl-zone-low',
  },
];

/** Down weight and up weight tied together, key by key. */
const ranges = () => {
  let path = '';
  for (let index = FROM; index <= TO; index += 1) {
    const down = demoMeasured.downWeight[index];
    const up = demoMeasured.upWeight[index];
    if (down == null || up == null) {
      continue;
    }
    path += `M${plotX(WEIGHTS, index)} ${plotY(WEIGHTS, down)}V${plotY(WEIGHTS, up)}`;
  }
  return path;
};

/**
 * A slice of the static balance figure: the irregularity you are looking for.
 *
 * The demonstration piano jumps twelve grams between E6 and F6 without the
 * friction moving, which is exactly the kind of thing the page is promising
 * to show — so the illustration rings it.
 */
export const StaticBalancePreview = () => {
  const { t } = useTranslation();
  const ringCenter = plotX(WEIGHTS, STEP_KEY - 0.5);

  return (
    <svg
      viewBox="0 0 320 156"
      className="block min-h-0 w-full flex-1"
      role="img"
      aria-label={t(
        'An extract of the static balance figure, keys F5 to E7: down, balance and up weight, and the friction with its reference zones; a 12 g step is ringed between E6 and F6, with no change in friction.',
      )}
    >
      <path
        d={GRID.map((weight) => `M0 ${plotY(WEIGHTS, weight)}H276`).join('')}
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
        className="stroke-ptl-chart-grid"
      />
      <path
        d="M0 101.5H276"
        strokeWidth="1"
        fill="none"
        className="stroke-input"
      />

      {ZONES.map((zone) => (
        <path
          key={zone.className}
          d={bandPath(zone.bounds, FRICTION, 10)}
          className={zone.className}
        />
      ))}

      <path
        d={ranges()}
        strokeWidth="1.2"
        fill="none"
        className="stroke-ptl-chart-range"
      />
      <path
        d={trianglesPath(
          demoMeasured.downWeight,
          WEIGHTS,
          { halfWidth: 3.4, height: 5.6 },
          'down',
        )}
        className="fill-ptl-series-down"
      />
      <path
        d={trianglesPath(
          demoMeasured.upWeight,
          WEIGHTS,
          { halfWidth: 3.4, height: 5.6 },
          'up',
        )}
        className="fill-ptl-series-up"
      />
      <path
        d={diamondsPath(demoMeasured.balanceWeight, WEIGHTS, 3.6)}
        className="fill-ptl-series-balance"
      />
      <path
        d={dotsPath(demoMeasured.friction, FRICTION, 2.2)}
        className="fill-ptl-series-friction"
      />

      <ellipse
        cx={ringCenter}
        cy="52"
        rx="15"
        ry="43"
        strokeWidth="1.3"
        strokeDasharray="3 3"
        fill="none"
        className="stroke-ptl-current"
      />
      <text
        x={plotX(WEIGHTS, STEP_KEY - 1) - 16}
        y="13"
        textAnchor="end"
        className="ptl-halo fill-ptl-current font-mono text-[10px]"
      >
        {t('+{{weight}} g', { weight: STEP_GRAMS })}
      </text>

      <text
        x="318"
        y="20"
        textAnchor="end"
        className="fill-ptl-ink-3 font-mono text-[7.5px]"
      >
        {t('weight')}
      </text>
      <text
        x="318"
        y="98"
        textAnchor="end"
        className="fill-ptl-ink-3 font-mono text-[7.5px]"
      >
        {t('friction')}
      </text>
      {[
        { label: t('High'), y: 115 },
        { label: t('Medium'), y: 127 },
        { label: t('Low'), y: 139 },
      ].map((zone) => (
        <text
          key={zone.y}
          x="318"
          y={zone.y}
          textAnchor="end"
          className="fill-ptl-ink-3 font-mono text-[7.5px]"
        >
          {zone.label}
        </text>
      ))}
      {[
        { label: 'C6', number: 64 },
        { label: 'C7', number: 76 },
      ].map((octave) => (
        <text
          key={octave.label}
          x={plotX(WEIGHTS, octave.number - 1)}
          y="155"
          textAnchor="middle"
          className="fill-ptl-ink-3 font-mono text-[8px]"
        >
          {octave.label}
        </text>
      ))}
    </svg>
  );
};
