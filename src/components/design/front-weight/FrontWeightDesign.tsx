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
import { AlertCircleIcon } from 'lucide-react';
import {} from '@/hooks/store/use-design-store';
import { useFrontWeightTargetSerie } from './hooks/use-front-weight-target-serie';
import { FrontWeightChart } from '@/components/charts/FrontWeightChart';
import { useFrontWeightRecommendation } from './hooks/use-front-weight-recommendation';
import { useFrontWeightTargetSelector } from './hooks/use-frontweight-target-selector';
import { useTranslation } from '@/hooks/use-translation';
import { useCallback, useMemo } from 'react';

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

  useFrontWeightRecommendation(
    frontWeightDesignMode,
    frontWeightDesignTarget,
    updateFrontWeightDesign,
  );

  const { targetSerie } = useFrontWeightTargetSerie(
    analyzedKeyboard,
    frontWeightDesignMode,
    frontWeightDesignTarget,
  );

  const hasEnoughData =
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
          'Choose a target from the standard front weight curves.',
        ),
        label: t('Use standard curves'),
        options: {
          labelFormatter: frontWeightCurveLabelFormatter,
          maxValue: 12,
          minValue: 1,
          placeholder: t('Select your target curve'),
          selectorUi: TargetSelectorUi.NumericSelector,
          step: 1,
        },
        value: FrontWeightDesignMode.StandardCurves,
      },
    ],
    [t, frontWeightCurveLabelFormatter],
  );

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
            title={t('Choose a target from the standard front weight curves.')}
            modes={targetSelectorModes}
            selectedMode={frontWeightDesignMode}
            selectedTarget={frontWeightDesignTarget}
            onModeChange={onModeChange}
            onTargetChange={onTargetChange}
          />
        </div>
        <div className="w-full 2xl:max-w-[--breakpoint-2xl] 3xl:max-w-[100rem]">
          <FrontWeightChart
            keyboard={analyzedKeyboard}
            targetSerie={targetSerie ?? undefined}
          />
        </div>
      </div>
    </div>
  );
};
