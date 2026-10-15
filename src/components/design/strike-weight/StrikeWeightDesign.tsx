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
import { AlertCircleIcon, HourglassIcon } from 'lucide-react';
import { DesignChartSummary } from '../DesignChartSummary';
import { DesignLayout } from '../DesignLayout';
import {
  formatGrams,
  formatSignedGrams,
  formatSignedWeightValue,
} from '@/lib/format/format-weight';
import { useFrontWeightDesign } from '@/hooks/store/use-design-store';
import { useStrikeWeightTargetSelector } from './hooks/use-strike-weight-target-selector';
import { useStrikeWeightRecommendation } from './hooks/use-strike-weight-recommendation';
import { useTranslation } from '@/hooks/use-translation';
import { useCallback, useMemo } from 'react';
import { FrontWeightDesignMode } from '../front-weight/FrontWeightDesign.types';
import { useTargetSeries } from '../hooks/use-target-series-generators';
import { useTargetReading } from '../hooks/use-target-reading';
import { benchAdjustment } from '@/lib/piano/touch-design/bench-adjustment';

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
  const { currentLanguage, t } = useTranslation();
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

  const renderReading = useTargetReading({
    difference: benchAdjustment,
    format: formatGrams,
    formatDifference: formatSignedGrams,
    keyboard: analyzedKeyboard,
    targetSerie,
  });

  const { frontWeightDesignMode } = useFrontWeightDesign();
  const balanceWeightLabelFormatter = useCallback(
    (value: number) => {
      return t('{{value}} g', {
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
  >[] = useMemo(
    () => [
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
        // The mirror of the front weight formula: the same balance, solved for
        // the hammer instead of the key front.
        formula: 'SW = (BW + FW + BWS − WBW) / R',
        hint: t(
          'Uses the springs, the front weight and the ratio set in steps 1, 2 and 4.',
        ),
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
        description: t(
          'Choose a target from the standard strike weight curves.',
        ),
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
          selectorUi: TargetSelectorUi.UniqueTargetSelector,
          target: SmoothStrategy.LeastSquaresRegression,
        },
        value: StrikeWeightDesignMode.Smoothed,
      },
    ],
    [
      t,
      shouldDisableComputedMode,
      computedModeDisabledReason,
      balanceWeightLabelFormatter,
    ],
  );

  // What the target curve costs in grams: where it starts and ends, and how
  // far the hammers have to move from what was measured.
  const summaryEntries = useMemo(() => {
    const points = (targetSerie?.data ?? []).filter(
      (point) => point.payload !== undefined && point.payload !== null,
    );
    if (points.length === 0) {
      return [];
    }
    const first = points[0]!;
    const last = points[points.length - 1]!;
    const differences = points
      .map((point) => {
        const measured = analyzedKeyboard.getKeyByNumber(point.number)?.payload
          .strikeWeight;
        return measured === null || measured === undefined
          ? null
          : point.payload! - measured;
      })
      .filter((value): value is number => value !== null);

    return [
      {
        label: t('Target'),
        value: t('from {{from}} ({{fromNote}}) to {{to}} ({{toNote}})', {
          from: formatGrams(first.payload ?? null, currentLanguage),
          fromNote: first.name,
          to: formatGrams(last.payload ?? null, currentLanguage),
          toNote: last.name,
        }),
      },
      ...(differences.length === 0
        ? []
        : [
            {
              label: t('Difference with the measured values'),
              // A range, not a mean: hammers move by a few tenths either way,
              // and the two cancel out to a meaningless "+0.0 g on average".
              value: t('from {{min}} to {{max}} g', {
                max: formatSignedWeightValue(
                  Math.max(...differences),
                  currentLanguage,
                ),
                min: formatSignedWeightValue(
                  Math.min(...differences),
                  currentLanguage,
                ),
              }),
            },
          ]),
    ];
  }, [analyzedKeyboard, currentLanguage, t, targetSerie]);

  return !hasEnoughData ? (
    <Alert variant="default" className="my-10 w-full">
      <AlertCircleIcon />
      <AlertTitle>{notEnoughDataErrorTitle}</AlertTitle>
      <AlertDescription>{notEnoughDataErrorDescription}</AlertDescription>
    </Alert>
  ) : (
    <DesignLayout
      objective={
        <TargetSelector
          title={t('Target')}
          modes={targetSelectorModes}
          selectedMode={strikeWeightDesignMode}
          selectedTarget={strikeWeightDesignTarget}
          onModeChange={onModeChange}
          onTargetChange={onTargetChange}
        />
      }
      chart={
        shouldDisplayComputeModeWaitingMessage ? (
          <Alert variant="default">
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
            renderReading={renderReading}
            variant="design"
            keyboard={analyzedKeyboard}
            targetSerie={targetSerie ?? undefined}
            extraLegendItems={
              targetSerie
                ? [
                    {
                      colorClassName: 'text-ptl-series-target',
                      id: 'target',
                      label: t('Target'),
                      mark: 'line-thick' as const,
                    },
                  ]
                : undefined
            }
            caption={<DesignChartSummary entries={summaryEntries} />}
          />
        )
      }
    />
  );
};
