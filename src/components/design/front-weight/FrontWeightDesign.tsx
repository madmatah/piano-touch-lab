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
import { DesignChartSummary } from '../DesignChartSummary';
import { DesignLayout } from '../DesignLayout';
import { formatGrams, formatSignedGrams } from '@/lib/format/format-weight';
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
  const { currentLanguage, t } = useTranslation();
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
      return t('FW#{{value}}', {
        value,
      });
    },
    [t],
  );

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
        formula: 'FW = WBW + R × SW − BW − BWS',
        hint: t(
          'Uses the springs, the strike weight and the ratio set in steps 1, 3 and 4.',
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
        value: FrontWeightDesignMode.Computed,
      },
      {
        description: t(
          'Pick a target among the standard front weight curves, from FW#1 to FW#12.',
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
          .frontWeight;
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
              value: t('{{weight}} on average', {
                weight: formatSignedGrams(
                  differences.reduce((total, value) => total + value, 0) /
                    differences.length,
                  currentLanguage,
                ),
              }),
            },
          ]),
    ];
  }, [analyzedKeyboard, currentLanguage, t, targetSerie]);

  return !hasEnoughInputData ? (
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
          selectedMode={frontWeightDesignMode}
          selectedTarget={frontWeightDesignTarget}
          onModeChange={onModeChange}
          onTargetChange={onTargetChange}
        />
      }
      chart={
        shouldDisplayComputeModeWaitingMessage ? (
          <Alert variant="default" className="flex-[999_1_480px]">
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
