import { formatGrams } from '@/lib/format/format-weight';
import { useTranslation } from '@/hooks/use-translation';

import {
  DEMO_DESIGN,
  DEMO_KEY_COUNT,
  demoDesigned,
  demoMeasured,
} from './demo-sample';
import { barsPath, dotsPath, plotX, plotY, type PlotBox } from './plot';

const BOX: PlotBox = {
  from: 0,
  height: 100,
  max: 20,
  min: 0,
  to: DEMO_KEY_COUNT - 1,
  width: 300,
  x: 10,
  y: 40,
};

/** The first key the design leaves unsprung. */
const FIRST_UNSPRUNG = DEMO_DESIGN.springCount + 1;
const DIVIDER = plotX(BOX, FIRST_UNSPRUNG - 1) + 2;

/**
 * What the wippen springs take off the keys, and where they stop.
 *
 * The taper is the point: full tension in the bass, nothing past the last
 * sprung key, so the lead comes out of the keys that need it most. The
 * measured tensions ride above it — the gap is the work to do.
 */
export const SpringsPreview = () => {
  const { currentLanguage, t } = useTranslation();

  return (
    <svg
      viewBox="0 0 320 150"
      className="block min-h-0 w-full flex-1"
      role="img"
      aria-label={t(
        'The weight the wippen springs take off the measuring point, falling away over the first 48 keys and absent beyond them, against the tensions measured on the piano.',
      )}
    >
      <path
        d={`M0 ${plotY(BOX, 0)}H320`}
        strokeWidth="1"
        fill="none"
        className="stroke-input"
      />
      <path
        d={barsPath(demoDesigned.springBalance, BOX, 2.6, 0)}
        opacity="0.55"
        className="fill-ptl-brass"
      />
      <path
        d={dotsPath(demoMeasured.springBalance, BOX, 1.5)}
        opacity="0.8"
        className="fill-ptl-series-balance"
      />
      <path
        d={`M${DIVIDER} ${plotY(BOX, 0)}V${BOX.y}`}
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
        className="stroke-input"
      />

      <text x="12" y="20" className="fill-ptl-brass font-mono text-[9.5px]">
        {t('{{tension}} → 0 over {{count}} keys', {
          count: DEMO_DESIGN.springCount,
          tension: formatGrams(DEMO_DESIGN.springBaseTension, currentLanguage),
        })}
      </text>
      <text
        x={DIVIDER + 6}
        y={BOX.y + 10}
        className="fill-ptl-ink-3 font-mono text-[9.5px]"
      >
        <tspan x={DIVIDER + 6}>
          {t('keys {{first}}–{{last}}', {
            first: FIRST_UNSPRUNG,
            last: DEMO_KEY_COUNT,
          })}
        </tspan>
        <tspan x={DIVIDER + 6} dy="13">
          {t('without springs')}
        </tspan>
      </text>
    </svg>
  );
};
