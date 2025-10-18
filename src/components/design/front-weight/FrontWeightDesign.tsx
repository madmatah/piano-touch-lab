import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
} from '../TargetSelector';
import {
  FrontWeightDesignMode,
  type FrontWeightDesignProps,
  type FrontWeightDesignTarget,
} from './FrontWeightDesign.types';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, HourglassIcon } from 'lucide-react';
import { useStrikeWeightDesign } from '@/hooks/store/use-design-store';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';
import { useFrontWeightRecommendation } from './hooks/use-front-weight-recommendation';
import { useFrontWeightTargetSelector } from './hooks/use-frontweight-target-selector';
import { useTranslation } from '@/hooks/use-translation';
import { useCallback, useMemo } from 'react';
import { StrikeWeightDesignMode } from '../strike-weight/StrikeWeightDesign.types';
import { useTargetSeries } from '../hooks/use-target-series-generators';

export const FrontWeightDesign: React.FC<FrontWeightDesignProps> = ({
  analyzedKeyboard,
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const { t } = useTranslation();
  const {
    frontWeightDesignMode,
    frontWeightDesignTarget,
    onModeChange,
    onTargetChange,
    updateFrontWeightDesign,
  } = useFrontWeightTargetSelector();
  const { strikeWeightDesignMode } = useStrikeWeightDesign();

  useFrontWeightRecommendation(
    frontWeightDesignMode,
    frontWeightDesignTarget,
    updateFrontWeightDesign,
  );

  const { frontWeightTargetSerie: targetSerie } =
    useTargetSeries(analyzedKeyboard);

  const hasEnoughInputData =
    analyzedKeyboard
      .mapToArray((key) => key.payload.frontWeight)
      .filter((v) => v !== undefined && v !== null).length >=
    Math.round(analyzedKeyboard.size * requiredDataPercentage);

  const frontWeightCurveLabelFormatter = useCallback(
    (value: number) => {
      return t('FW #{{value}}', {
        value,
      });
    },
    [t],
  );

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
        strikeWeightDesignMode === StrikeWeightDesignMode.Computed;
      const reason = shouldDisableComputedMode
        ? t(
            'The automatic computation is already active on the strike weight design.',
          )
        : undefined;
      return {
        computedModeDisabledReason: reason,
        shouldDisableComputedMode,
      };
    }, [strikeWeightDesignMode, t]);

  const targetSelectorModes: TargetSelectorMode<
    FrontWeightDesignMode,
    FrontWeightDesignTarget
  >[] = useMemo(
    () => [
      {
        description: t('Use front weight measured values'),
        label: t('Keep the front weight as is.'),
        options: {
          selectorUi: TargetSelectorUi.UniqueTargetSelector,
          target: null,
        },
        value: FrontWeightDesignMode.AsMeasured,
      },
      {
        description: t(
          'The front weight will be computed automatically in order to achieve the specified balance weight.',
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
        value: FrontWeightDesignMode.Computed,
      },
      {
        description: t(
          'Choose a target from the standard front weight curves.',
        ),
        label: t('Use standard curves'),
        options: {
          labelFormatter: frontWeightCurveLabelFormatter,
          maxCharacters: 8,
          maxValue: 12,
          minValue: 1,
          placeholder: t('Target curve'),
          selectorUi: TargetSelectorUi.NumericSelector,
          step: 1,
        },
        value: FrontWeightDesignMode.StandardCurves,
      },
    ],
    [
      t,
      shouldDisableComputedMode,
      computedModeDisabledReason,
      balanceWeightLabelFormatter,
      frontWeightCurveLabelFormatter,
    ],
  );

  const shouldDisplayComputeModeWaitingMessage = useMemo(() => {
    const hasEnoughOutputData = targetSerie?.data?.some((key) => key?.payload);

    return (
      frontWeightDesignMode === FrontWeightDesignMode.Computed &&
      !hasEnoughOutputData
    );
  }, [frontWeightDesignMode, targetSerie]);

  return !hasEnoughInputData ? (
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
            title={t('Choose a target from the standard front weight curves.')}
            modes={targetSelectorModes}
            selectedMode={frontWeightDesignMode}
            selectedTarget={frontWeightDesignTarget}
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
                  'The front weight will be computed when all other design targets will be specified.',
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <FrontWeightChart
              keyboard={analyzedKeyboard}
              targetSerie={targetSerie ?? undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};
