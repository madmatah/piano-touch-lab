import { useTranslation } from '@/hooks/use-translation';

import { DEMO_KEY_COUNT, demoDesigned, demoMeasured } from './demo-sample';
import { dotsPath, linePath, plotY, type PlotBox } from './plot';

const BOX: PlotBox = {
  from: 0,
  height: 110,
  max: 25,
  min: -10,
  to: DEMO_KEY_COUNT - 1,
  width: 300,
  x: 10,
  y: 30,
};

/**
 * What the keys should weigh to land on a chosen balance weight.
 *
 * The measurements sit low and flat, the computed curve sweeps down across
 * the keyboard: the gap between the two is the lead to move, which is what
 * the page is offering to work out.
 */
export const FrontWeightPreview = () => {
  const { t } = useTranslation();

  return (
    <svg
      viewBox="0 0 320 150"
      className="block min-h-0 w-full flex-1"
      role="img"
      aria-label={t(
        'The measured front weight of the demonstration piano under the target curve computed from a chosen balance weight.',
      )}
    >
      <path
        d={`M0 ${plotY(BOX, 0)}H320`}
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
        className="stroke-input"
      />
      <path
        d={dotsPath(demoMeasured.frontWeight, BOX, 1.4)}
        opacity="0.7"
        className="fill-ptl-series-balance"
      />
      <path
        d={linePath(demoDesigned.frontWeight, BOX)}
        strokeWidth="2.2"
        fill="none"
        className="stroke-ptl-brass"
      />

      <text x="12" y="22" className="fill-ptl-brass font-mono text-[9.5px]">
        {t('computed front weight')}
      </text>
      <text x="12" y="132" className="fill-ptl-ink-3 font-mono text-[9.5px]">
        {t('measured')}
      </text>
    </svg>
  );
};
