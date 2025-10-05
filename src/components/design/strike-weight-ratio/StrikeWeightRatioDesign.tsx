import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
  type TargetSelectorTarget,
} from '../TargetSelector';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignSmoothTarget,
  type StrikeWeightRatioDesignProps,
  type StrikeWeightRatioDesignTarget,
} from './StrikeWeightRatioDesign.types';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { useAnalyzedKeyboard } from '@/hooks/use-analyzed-keyboard';
import {} from '@/hooks/store/use-design-store';
import { useStrikeWeightRatioRecommendation } from './hooks/use-strike-weight-ratio-recommendation';
import { useTranslation } from '@/hooks/use-translation';
import { useStrikeWeightRatioTargetSelector } from './hooks/use-strike-weight-ratio-target-selector';
import { useStrikeWeightRatioTargetSerie } from './hooks/strike-weight-ratio-target-serie';
import { useMemo } from 'react';
import { StrikeWeightRatioChart } from '@/components/charts/StrikeWeightRatioChart';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';

export const StrikeWeightRatioDesign: React.FC<
  StrikeWeightRatioDesignProps
> = ({
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const { t } = useTranslation();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const {
    onModeChange,
    onTargetChange,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    updateStrikeWeightRatioDesign,
  } = useStrikeWeightRatioTargetSelector();

  useStrikeWeightRatioRecommendation(
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
    updateStrikeWeightRatioDesign,
  );

  const { targetSerie } = useStrikeWeightRatioTargetSerie(
    analyzedKeyboard,
    strikeWeightRatioDesignMode,
    strikeWeightRatioDesignTarget,
  );

  const hasEnoughData = useMemo(() => {
    return (
      analyzedKeyboard
        .mapToArray((key) => key.payload.strikeWeightRatio)
        .filter((v) => v !== undefined && v !== null).length >=
      Math.round(analyzedKeyboard.size * requiredDataPercentage)
    );
  }, [analyzedKeyboard, requiredDataPercentage]);

  const smoothCurveTargets: TargetSelectorTarget<StrikeWeightRatioDesignSmoothTarget>[] =
    [
      {
        label: t('Compute the mean of your measurements'),
        value: SmoothStrategy.Mean,
      },
      {
        label: t('Compute the median of your measurements'),
        value: SmoothStrategy.Median,
      },
    ];

  const targetSelectorModes: TargetSelectorMode<
    StrikeWeightRatioDesignMode,
    StrikeWeightRatioDesignTarget
  >[] = [
    {
      description: t('Use measured values'),
      label: t('Leave the strike weight ratio as measured.'),
      options: {
        selectorUi: TargetSelectorUi.UniqueTargetSelector,
        target: null,
      },
      value: StrikeWeightRatioDesignMode.AsMeasured,
    },
    {
      description: t('Compute the median or mean of your measurements'),
      label: t('Compute a value from your measurements'),
      options: {
        selectorUi: TargetSelectorUi.HtmlSelect,
        targets: smoothCurveTargets,
      },
      value: StrikeWeightRatioDesignMode.Smoothed,
    },
    {
      description: t('Use a constant strike weight ratio for all keys.'),
      label: t('Choose a target strike weight ratio.'),
      options: {
        maxValue: 8,
        minValue: 4,
        selectorUi: TargetSelectorUi.NumericSelector,
        step: 0.1,
      },
      value: StrikeWeightRatioDesignMode.FixedValue,
    },
  ];

  return !hasEnoughData ? (
    <Alert variant="default" className="w-full mx-auto my-10">
      <AlertCircleIcon />
      <AlertTitle>{notEnoughDataErrorTitle}</AlertTitle>
      <AlertDescription>{notEnoughDataErrorDescription}</AlertDescription>
    </Alert>
  ) : (
    <div>
      <div className="flex flex-col gap-1 items-center">
        <div className="w-full max-w-[1000px]">
          <TargetSelector
            title={t('Target selection')}
            modes={targetSelectorModes}
            selectedMode={strikeWeightRatioDesignMode}
            selectedTarget={strikeWeightRatioDesignTarget}
            onModeChange={onModeChange}
            onTargetChange={onTargetChange}
          />
        </div>
        <div className="w-full 2xl:max-w-[--breakpoint-2xl] 3xl:max-w-[100rem]">
          <StrikeWeightRatioChart
            keyboard={analyzedKeyboard}
            targetSerie={targetSerie ?? undefined}
          />
        </div>
      </div>
    </div>
  );
};
