import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
} from '../TargetSelector';

import {} from '@/hooks/store/use-design-store';
import { useWippenSupportSpringsTargetSerie } from './hooks/use-wippen-support-springs-target-serie';
import { useWippenSupportSpringsRecommendation } from './hooks/use-wippen-support-springs-recommendation';
import { useTranslation } from '@/hooks/use-translation';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignProps,
  type WippenSupportSpringsDesignTarget,
} from './WippenSupportSpringsDesign.types';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';
import { useWippenSupportSpringsTargetSelector } from './hooks/use-wippen-support-springs-target-selector';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { WippenDesignSelector } from './wippen-design-selector/WippenDesignSelector';

export const WippenSupportSpringsDesign: React.FC<
  WippenSupportSpringsDesignProps
> = ({ analyzedKeyboard }) => {
  const { t } = useTranslation();
  const { useSupportSpringMeasurements } = useMeasureOptions();
  const {
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
    onModeChange,
    onTargetChange,
    updateWippenSupportSpringsDesign,
  } = useWippenSupportSpringsTargetSelector(analyzedKeyboard);
  useWippenSupportSpringsRecommendation(
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
    updateWippenSupportSpringsDesign,
  );
  const { targetSerie } = useWippenSupportSpringsTargetSerie(
    analyzedKeyboard,
    wippenSupportSpringsDesignMode,
    wippenSupportSpringsDesignTarget,
  );

  const targetSelectorModes: TargetSelectorMode<
    WippenSupportSpringsDesignMode,
    WippenSupportSpringsDesignTarget
  >[] = [
    {
      description: t(
        'Choose this option if your piano does not have wippen support springs.',
      ),
      label: t('Do not use wippen support springs'),
      options: {
        selectorUi: TargetSelectorUi.UniqueTargetSelector as const,
        target: null,
      },
      value: WippenSupportSpringsDesignMode.None,
    },
    {
      description: t(
        'All your wippen support springs will have the same tension.',
      ),
      label: t('Use wippen support springs with constant tension'),
      options: {
        componentFactory: (
          currentTarget: WippenSupportSpringsDesignTarget,
          onTargetChange: (target: WippenSupportSpringsDesignTarget) => void,
        ) => (
          <WippenDesignSelector
            currentTarget={currentTarget}
            onTargetChange={onTargetChange}
            shouldEnableTensionDropIndexSelector={false}
          />
        ),
        selectorUi: TargetSelectorUi.CustomComponentTargetSelector as const,
      },
      value: WippenSupportSpringsDesignMode.Constant,
    },
    {
      description: t(
        'The general idea is to define a base weight that will decrease to zero starting from a specific key.',
      ),
      label: t('Use wippen support springs with smooth transition'),
      options: {
        componentFactory: (
          currentTarget: WippenSupportSpringsDesignTarget,
          onTargetChange: (target: WippenSupportSpringsDesignTarget) => void,
        ) => (
          <WippenDesignSelector
            currentTarget={currentTarget}
            onTargetChange={onTargetChange}
            shouldEnableTensionDropIndexSelector={true}
          />
        ),
        selectorUi: TargetSelectorUi.CustomComponentTargetSelector as const,
      },
      value: WippenSupportSpringsDesignMode.SmoothTransition,
    },
    useSupportSpringMeasurements
      ? {
          description: t('Use wippen support springs measured values'),
          label: t('Keep the wippen support springs as is.'),
          options: {
            selectorUi: TargetSelectorUi.UniqueTargetSelector as const,
            target: null,
          },
          value: WippenSupportSpringsDesignMode.AsMeasured,
        }
      : undefined,
  ].filter((mode) => mode !== undefined);

  return (
    <div>
      <div className="flex flex-col gap-1 items-center">
        <div className="w-full max-w-[1000px]">
          <TargetSelector
            title={t('Target selection')}
            modes={targetSelectorModes}
            selectedMode={wippenSupportSpringsDesignMode}
            selectedTarget={wippenSupportSpringsDesignTarget}
            onModeChange={onModeChange}
            onTargetChange={onTargetChange}
          />
        </div>
        {wippenSupportSpringsDesignMode !==
        WippenSupportSpringsDesignMode.None ? (
          <div className="w-full 2xl:max-w-[--breakpoint-2xl] 3xl:max-w-[100rem]">
            <SupportSpringBalanceWeightChart
              keyboard={analyzedKeyboard}
              targetSerie={targetSerie ?? undefined}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
