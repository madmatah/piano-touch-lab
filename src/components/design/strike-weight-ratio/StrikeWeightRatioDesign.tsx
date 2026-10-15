import { useCallback, useMemo } from 'react';

import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
} from '../TargetSelector';
import {
  StrikeWeightRatioDesignMode,
  type StrikeWeightRatioDesignSmoothTarget,
  type StrikeWeightRatioDesignProps,
  type StrikeWeightRatioDesignTarget,
} from './StrikeWeightRatioDesign.types';

import { useKeyboardStats } from '@/components/analyze/key-reading/hooks/use-keyboard-stats';
import { StrikeWeightRatioChart } from '@/components/charts/StrikeWeightRatioChart';
import { useTranslation } from '@/hooks/use-translation';
import { formatRatio, formatSignedRatio } from '@/lib/format/format-weight';
import { SmoothStrategy } from '@/lib/geometry/curve-smoother/smooth-strategy.enum';
import type { KeyWith } from '@/lib/piano/keyboard';
import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { cn } from '@/lib/utils';
import { DesignChartSummary } from '../DesignChartSummary';
import { DesignLayout } from '../DesignLayout';
import { useTargetSeries } from '../hooks/use-target-series-generators';
import { useStrikeWeightRatioRecommendation } from './hooks/use-strike-weight-ratio-recommendation';
import { useStrikeWeightRatioTargetSelector } from './hooks/use-strike-weight-ratio-target-selector';
import { useTargetReading } from '../hooks/use-target-reading';
import { NotEnoughData } from '../NotEnoughData';

/** What a constant ratio can be nudged to, and by how much. */
const RATIO_BOUNDS = { max: 8, min: 4, step: 0.1 } as const;

/**
 * The ratio the design works from.
 *
 * It is what you measured where you measured it, and what the analysis derives
 * everywhere else. The smoothing modes average this very quantity, so a median
 * or a mean stated on this page is the one a mode would actually apply.
 */
const selectStrikeWeightRatio = (
  key: KeyWith<Pick<TouchWeightKeyAnalysis, 'strikeWeightRatio'>>,
): OptionalNumber => key.payload.strikeWeightRatio;

/**
 * Median or mean, as one segment rather than a dropdown.
 *
 * A choice between two values does not need a popover: the segment states both
 * at once and stays inside the card, in the same frame as the steppers of the
 * other modes.
 */
const SmoothStrategySegment = ({
  label,
  onChange,
  options,
  selected,
}: {
  label: string;
  onChange: (target: StrikeWeightRatioDesignSmoothTarget) => void;
  options: { label: string; value: StrikeWeightRatioDesignSmoothTarget }[];
  selected: StrikeWeightRatioDesignSmoothTarget | null;
}) => {
  const select = useCallback(
    (target: StrikeWeightRatioDesignSmoothTarget) => () => {
      onChange(target);
    },
    [onChange],
  );

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex overflow-hidden rounded-md border border-input"
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={select(option.value)}
            className={cn(
              'h-10 cursor-pointer px-4 text-[13.5px] font-medium transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-accent',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export const StrikeWeightRatioDesign: React.FC<
  StrikeWeightRatioDesignProps
> = ({
  analyzedKeyboard,
  requiredDataPercentage,
  notEnoughDataErrorTitle,
  notEnoughDataErrorDescription,
}) => {
  const { currentLanguage, t } = useTranslation();
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

  const { strikeWeightRatioTargetSerie: targetSerie } =
    useTargetSeries(analyzedKeyboard);

  const renderReading = useTargetReading({
    format: formatRatio,
    formatDifference: formatSignedRatio,
    keyboard: analyzedKeyboard,
    targetSerie,
  });

  const stats = useKeyboardStats(analyzedKeyboard, selectStrikeWeightRatio);

  const hasEnoughData = useMemo(() => {
    return (
      analyzedKeyboard
        .mapToArray((key) => key.payload.strikeWeightRatio)
        .filter((v) => v !== undefined && v !== null).length >=
      Math.round(analyzedKeyboard.size * requiredDataPercentage)
    );
  }, [analyzedKeyboard, requiredDataPercentage]);

  // A ratio is read to a hundredth, like the measurements it is set against.
  const ratioLabelFormatter = useCallback(
    (value: number) => formatRatio(value, currentLanguage),
    [currentLanguage],
  );

  const smoothStrategySelectorFactory = useCallback(
    (
      currentTarget: StrikeWeightRatioDesignTarget | null,
      onChange: (target: StrikeWeightRatioDesignTarget) => void,
    ) => (
      <SmoothStrategySegment
        label={t('Computation')}
        onChange={onChange}
        options={[
          { label: t('Median'), value: SmoothStrategy.Median },
          { label: t('Mean'), value: SmoothStrategy.Mean },
        ]}
        selected={
          currentTarget === SmoothStrategy.Median ||
          currentTarget === SmoothStrategy.Mean
            ? currentTarget
            : null
        }
      />
    ),
    [t],
  );

  const targetSelectorModes: TargetSelectorMode<
    StrikeWeightRatioDesignMode,
    StrikeWeightRatioDesignTarget
  >[] = useMemo(
    () => [
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
        // Both figures are spelled out, so the choice can be made without
        // switching to one of them to find out what it amounts to.
        description: t(
          'Compute the median ({{median}}) or the mean ({{mean}}) of your measurements.',
          {
            mean: formatRatio(stats.mean, currentLanguage),
            median: formatRatio(stats.median, currentLanguage),
          },
        ),
        label: t('Compute a value from your measurements'),
        options: {
          componentFactory: smoothStrategySelectorFactory,
          placeholder: t('Computation'),
          selectorUi: TargetSelectorUi.CustomComponentTargetSelector,
        },
        value: StrikeWeightRatioDesignMode.Smoothed,
      },
      {
        description: t('Use a constant strike weight ratio for all keys.'),
        hint: t('From 4.0 to 8.0, in steps of 0.1.'),
        label: t('Choose a target strike weight ratio.'),
        options: {
          labelFormatter: ratioLabelFormatter,
          // Four characters, so the box does not resize between 4,00 and 8,00.
          maxCharacters: 4,
          maxValue: RATIO_BOUNDS.max,
          minValue: RATIO_BOUNDS.min,
          placeholder: t('Target ratio'),
          selectorUi: TargetSelectorUi.NumericSelector,
          step: RATIO_BOUNDS.step,
        },
        value: StrikeWeightRatioDesignMode.FixedValue,
      },
    ],
    [
      currentLanguage,
      ratioLabelFormatter,
      smoothStrategySelectorFactory,
      stats.mean,
      stats.median,
      t,
    ],
  );

  const targetValues = targetSerie.data
    .map((point) => point.payload)
    .filter(
      (value): value is number => value !== undefined && !Number.isNaN(value),
    );
  const targetKeyCount = targetValues.length;
  const lowestTarget = Math.min(...targetValues);
  // Every mode but "as measured" aims at a single value for the whole
  // keyboard, and that one figure is the entire reading of the curve. Where
  // the target follows the measurements, stating it under the plot would only
  // repeat the line beside it.
  const constantTarget =
    targetKeyCount > 0 && lowestTarget === Math.max(...targetValues)
      ? lowestTarget
      : null;

  const summaryEntries = useMemo(
    () => [
      ...(constantTarget === null
        ? []
        : [
            {
              label: t('Target'),
              value: `${formatRatio(constantTarget, currentLanguage)} ${t(
                'across the {{count}} keys',
                { count: targetKeyCount },
              )}`,
            },
          ]),
      ...(stats.count === 0
        ? []
        : [
            {
              label: t('Your measurements'),
              value: t('from {{min}} to {{max}}, median {{median}}', {
                max: formatRatio(stats.max, currentLanguage),
                median: formatRatio(stats.median, currentLanguage),
                min: formatRatio(stats.min, currentLanguage),
              }),
            },
          ]),
    ],
    [constantTarget, currentLanguage, stats, t, targetKeyCount],
  );

  return !hasEnoughData ? (
    <NotEnoughData
      title={notEnoughDataErrorTitle}
      description={notEnoughDataErrorDescription}
    />
  ) : (
    <DesignLayout
      objective={
        <TargetSelector
          title={t('Target')}
          modes={targetSelectorModes}
          selectedMode={strikeWeightRatioDesignMode}
          selectedTarget={strikeWeightRatioDesignTarget}
          onModeChange={onModeChange}
          onTargetChange={onTargetChange}
        />
      }
      chart={
        <StrikeWeightRatioChart
          renderReading={renderReading}
          variant="design"
          keyboard={analyzedKeyboard}
          targetSerie={targetSerie}
          displayBothManualAndComputed={false}
          extraLegendItems={
            targetKeyCount === 0
              ? undefined
              : [
                  {
                    colorClassName: 'text-ptl-series-target',
                    id: 'target',
                    label: t('Target'),
                    mark: 'line-thick' as const,
                  },
                ]
          }
          caption={<DesignChartSummary entries={summaryEntries} />}
        />
      }
    />
  );
};
