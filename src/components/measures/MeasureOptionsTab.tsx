import { ChartNoAxesCombined, Plus, SlidersHorizontal } from 'lucide-react';
import { useCallback } from 'react';

import { Switch } from '@/components/ui/switch';
import {
  useMeasureOptions,
  useMeasureOptionsActions,
} from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';

interface OptionConsequence {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const Consequences = ({ items }: { items: OptionConsequence[] }) => (
  <div className="flex flex-wrap gap-2 pt-1">
    {items.map((item) => (
      <span
        key={item.label}
        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[13px] text-muted-foreground"
      >
        <item.icon className="size-3.5" />
        {item.label}
      </span>
    ))}
  </div>
);

/**
 * The two optional measurements.
 *
 * Each one says what it adds to the rest of the application, because turning
 * it on changes the measure table, the analysis and the design — and nothing
 * else on screen would say so.
 */
export const MeasureOptionsTab = () => {
  const { t } = useTranslation();
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();
  const { updateOption } = useMeasureOptionsActions();

  const onUpdateUseManualSWRMeasurements = useCallback(
    (value: boolean) => {
      updateOption('useManualSWRMeasurements', value);
    },
    [updateOption],
  );

  const onUpdateUseSpringSupportMeasurements = useCallback(
    (value: boolean) => {
      updateOption('useSupportSpringMeasurements', value);
    },
    [updateOption],
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 max-w-[70ch] text-[15px] text-muted-foreground">
        {t(
          'Two optional measurements, to turn on only if you take them on your piano.',
        )}
      </p>

      <section className="rounded-md border border-border bg-card">
        <div className="flex flex-wrap items-start gap-6 border-b border-border px-6 py-[22px]">
          <div className="flex flex-[1_1_420px] flex-col gap-2.5">
            <span className="ptl-label">
              {t('Option {{number}} · Strike weight ratio', { number: 1 })}
            </span>
            <h2
              id="option-manual-swr"
              className="m-0 font-serif text-[22px] font-medium"
            >
              {t('Measure Strike Weight Ratio manually')}
            </h2>
            <p className="m-0 text-sm leading-[1.6] text-muted-foreground">
              {t(
                'By enabling this option, you will be able to manually measure the strike weight ratio of each key rather than using an automatically computed value.',
              )}
            </p>
            <p className="m-0 text-sm leading-[1.6] text-muted-foreground">
              {t(
                'If a measured value is too far from the computed one, a warning will point out that the measurements are inconsistent.',
              )}
            </p>
            <Consequences
              items={[
                { icon: Plus, label: t('“SWR” column in Measure') },
                {
                  icon: ChartNoAxesCombined,
                  label: t('Measured and computed in Analyze'),
                },
              ]}
            />
          </div>
          <Switch
            className="cursor-pointer"
            aria-labelledby="option-manual-swr"
            checked={useManualSWRMeasurements}
            onCheckedChange={onUpdateUseManualSWRMeasurements}
          />
        </div>

        <div className="flex flex-wrap items-start gap-6 px-6 py-[22px]">
          <div className="flex flex-[1_1_420px] flex-col gap-2.5">
            <span className="ptl-label">
              {t('Option {{number}} · Wippen support springs', { number: 2 })}
            </span>
            <h2
              id="option-support-springs"
              className="m-0 font-serif text-[22px] font-medium"
            >
              {t('Measure Wippen Support Spring tension')}
            </h2>
            <p className="m-0 text-sm leading-[1.6] text-muted-foreground">
              {t(
                'With this option on, an extra field appears to measure the down weight of each key with the support spring engaged. Those values feed the spring tension calculation and bring up a dedicated chart in the analysis.',
              )}
            </p>
            <p className="m-0 text-sm leading-[1.6] text-muted-foreground">
              {t(
                'This measurement is optional, even if you plan to use support springs in your design. It simply records the condition they are in today.',
              )}
            </p>
            <Consequences
              items={[
                {
                  icon: Plus,
                  label: t('“D with spring” column in Measure'),
                },
                {
                  icon: ChartNoAxesCombined,
                  label: t('Analyze › Wippen support springs'),
                },
                {
                  icon: SlidersHorizontal,
                  label: t('“Keep as measured” mode in Design'),
                },
              ]}
            />
          </div>
          <Switch
            className="cursor-pointer"
            aria-labelledby="option-support-springs"
            checked={useSupportSpringMeasurements}
            onCheckedChange={onUpdateUseSpringSupportMeasurements}
          />
        </div>
      </section>
    </div>
  );
};
