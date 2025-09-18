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
  type StrikeWeightDesignTarget,
} from './StrikeWeightDesign.types';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { useAnalyzedKeyboard } from '@/hooks/use-analyzed-keyboard';
import {} from '@/hooks/use-design-store';
import { useStrikeWeightTargetSelector } from './hooks/use-strike-weight-target-selector';
import { useStrikeWeightTargetSerie } from './hooks/use-strike-weight-target-serie';
import { useStrikeWeightRecommendation } from './hooks/use-strike-weight-recommendation';
import { useTranslation } from '@/hooks/use-translation';

const standardCurveTargets: TargetSelectorTarget<StrikeWeightLevel>[] =
  Object.values(StrikeWeightLevel).map((level) => ({
    label: level,
    value: level,
  }));

export const StrikeWeightDesign: React.FC<StrikeWeightDesignProps> = ({
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const { t } = useTranslation();
  const analyzedKeyboard = useAnalyzedKeyboard();
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
  const { targetSerie } = useStrikeWeightTargetSerie(
    analyzedKeyboard,
    strikeWeightDesignMode,
    strikeWeightDesignTarget,
  );
  const smoothCurveTargets: TargetSelectorTarget<SmoothStrategy>[] = [
    {
      label: t('Smoothed with Least Squares Regression'),
      value: SmoothStrategy.LeastSquaresRegression,
    },
    {
      label: t('Smoothed with LOESS'),
      value: SmoothStrategy.Loess,
    },
  ];

  const hasEnoughData =
    analyzedKeyboard
      .mapToArray((key) => key.payload.strikeWeight)
      .filter((v) => v !== undefined && v !== null).length >=
    Math.round(analyzedKeyboard.size * requiredDataPercentage);

  if (!hasEnoughData) {
    return (
      <Alert variant="default" className="w-full mx-auto my-10">
        <AlertCircleIcon />
        <AlertTitle>{notEnoughDataErrorTitle}</AlertTitle>
        <AlertDescription>{notEnoughDataErrorDescription}</AlertDescription>
      </Alert>
    );
  }

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
          <StrikeWeightChart
            keyboard={analyzedKeyboard}
            targetSerie={targetSerie ?? undefined}
          />
        </div>
      </div>
    </div>
  );
};
