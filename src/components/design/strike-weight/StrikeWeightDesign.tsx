import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
  type TargetSelectorTarget,
} from '../TargetSelector';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import { StrikeWeightChart } from '../../charts/StrikeWeightChart';
import {
  StrikeWeightDesignMode,
  type StrikeWeightDesignProps,
  type StrikeWeightDesignSmoothTarget,
  type StrikeWeightDesignTarget,
} from './StrikeWeightDesign.types';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, HourglassIcon } from 'lucide-react';
import { useFrontWeightDesign } from '@/hooks/store/use-design-store';
import { useStrikeWeightTargetSelector } from './hooks/use-strike-weight-target-selector';
import { useStrikeWeightRecommendation } from './hooks/use-strike-weight-recommendation';
import { useTranslation } from '@/hooks/use-translation';
import { useCallback, useMemo } from 'react';
import { FrontWeightDesignMode } from '../front-weight/FrontWeightDesign.types';
import { useTargetSeries } from '../hooks/use-target-series-generators';

const standardCurveTargets: TargetSelectorTarget<StrikeWeightLevel>[] =
  Object.values(StrikeWeightLevel).map((level) => ({
    label: level,
    value: level,
  }));

export const StrikeWeightDesign: React.FC<StrikeWeightDesignProps> = ({
  analyzedKeyboard,
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const { t } = useTranslation();
  const {
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
    onModeChange,
    onTargetChange,
    updateStrikeWeightDesign,
  } = useStrikeWeightTargetSelector();
  useStrikeWeightRecommendation(
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
    updateStrikeWeightDesign,
  );
  const { strikeWeightTargetSerie: targetSerie } =
    useTargetSeries(analyzedKeyboard);

  const { frontWeightDesignMode } = useFrontWeightDesign();
  const smoothCurveTargets: TargetSelectorTarget<StrikeWeightDesignSmoothTarget>[] =
    [
      {
        label: t('Smoothed with Least Squares Regression'),
        value: SmoothStrategy.LeastSquaresRegression,
      },
      {
        label: t('Smoothed with LOESS'),
        value: SmoothStrategy.Loess,
      },
    ];

  const balanceWeightLabelFormatter = useCallback(
    (value: number) => {
      return t('{{value}}g', {
        value,
      });
    },
    [t],
  );

  const { shouldDisableComputedMode, computedModeDisabledReason } =
    useMemo(() => {
      const shouldDisableComputedMode =
        frontWeightDesignMode === FrontWeightDesignMode.Computed;
      const reason = shouldDisableComputedMode
        ? t(
            'The automatic computation is already active on the front weight design.',
          )
        : undefined;
      return {
        computedModeDisabledReason: reason,
        shouldDisableComputedMode,
      };
    }, [frontWeightDesignMode, t]);

  const hasEnoughData =
    analyzedKeyboard
      .mapToArray((key) => key.payload.strikeWeight)
      .filter((v) => v !== undefined && v !== null).length >=
    Math.round(analyzedKeyboard.size * requiredDataPercentage);

  const shouldDisplayComputeModeWaitingMessage = useMemo(() => {
    const hasEnoughOutputData = targetSerie?.data?.some((key) => key?.payload);

    return (
      strikeWeightDesignMode === StrikeWeightDesignMode.Computed &&
      !hasEnoughOutputData
    );
  }, [strikeWeightDesignMode, targetSerie]);

  const targetSelectorModes: TargetSelectorMode<
    StrikeWeightDesignMode,
    StrikeWeightDesignTarget
  >[] = [
    {
      description: t('Use strike weight measured values'),
      label: t('Keep the strike weight as is.'),
      options: {
        selectorUi: TargetSelectorUi.UniqueTargetSelector,
        target: null,
      },
      value: StrikeWeightDesignMode.AsMeasured,
    },
    {
      description: t(
        'The strike weight will be computed automatically in order to achieve the specified balance weight.',
      ),
      disabledReason: computedModeDisabledReason,
      isDisabled: shouldDisableComputedMode,
      label: t('Compute automatically'),
      options: {
        labelFormatter: balanceWeightLabelFormatter,
        maxValue: 60,
        minValue: 30,
        placeholder: t('Target Balance Weight'),
        selectorUi: TargetSelectorUi.NumericSelector,
        step: 1,
      },
      value: StrikeWeightDesignMode.Computed,
    },
    {
      description: t('Choose a target from the standard strike weight curves.'),
      label: t('Use standard curves'),
      options: {
        placeholder: t('Select your target curve'),
        selectorUi: TargetSelectorUi.ValueSelector,
        targets: standardCurveTargets,
      },
      value: StrikeWeightDesignMode.StandardCurves,
    },
    {
      description: t(
        'Create a custom smoothed curve based on your measured strike weight data.',
      ),
      label: t('Generate a smoothed curve'),
      options: {
        placeholder: t('Select your smoothing algorithm'),
        selectorUi: TargetSelectorUi.HtmlSelect,
        targets: smoothCurveTargets,
      },
      value: StrikeWeightDesignMode.Smoothed,
    },
  ];

  if (!hasEnoughData) {
    return (
      <Alert variant="default" className="w-full mx-auto my-10">
        <AlertCircleIcon />
        <AlertTitle>{notEnoughDataErrorTitle}</AlertTitle>
        <AlertDescription>{notEnoughDataErrorDescription}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1 items-center">
        <div className="w-full max-w-[1000px]">
          <TargetSelector
            title={t('Target selection')}
            modes={targetSelectorModes}
            selectedMode={strikeWeightDesignMode}
            selectedTarget={strikeWeightDesignTarget}
            onModeChange={onModeChange}
            onTargetChange={onTargetChange}
          />
        </div>
        <div className="w-full 2xl:max-w-[--breakpoint-2xl] 3xl:max-w-[100rem]">
          {shouldDisplayComputeModeWaitingMessage ? (
            <Alert variant="default" className="w-full mx-auto my-10">
              <HourglassIcon />
              <AlertTitle>
                {t('Waiting for remaining design targets to be specified.')}
              </AlertTitle>
              <AlertDescription>
                {t(
                  'The strike weight will be computed when all other design targets will be specified.',
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <StrikeWeightChart
              keyboard={analyzedKeyboard}
              targetSerie={targetSerie ?? undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};
