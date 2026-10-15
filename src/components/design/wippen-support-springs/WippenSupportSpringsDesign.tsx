import {
  TargetSelector,
  TargetSelectorUi,
  type TargetSelectorMode,
} from '../TargetSelector';

import { useMemo } from 'react';
import { useWippenSupportSpringsRecommendation } from './hooks/use-wippen-support-springs-recommendation';
import { useTranslation } from '@/hooks/use-translation';
import {
  WippenSupportSpringsDesignMode,
  type WippenSupportSpringsDesignProps,
  type WippenSupportSpringsDesignTarget,
} from './WippenSupportSpringsDesign.types';
import { SupportSpringBalanceWeightChart } from '@/components/charts/SupportSpringBalanceWeightChart';
import { DesignChartSummary } from '../DesignChartSummary';
import { DesignLayout } from '../DesignLayout';
import { formatGrams, formatSignedGrams } from '@/lib/format/format-weight';
import { useWippenSupportSpringsTargetSelector } from './hooks/use-wippen-support-springs-target-selector';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { WippenDesignSelector } from './wippen-design-selector/WippenDesignSelector';
import { useTargetSeries } from '../hooks/use-target-series-generators';
import { useTargetReading } from '../hooks/use-target-reading';
import { benchAdjustment } from '@/lib/piano/touch-design/bench-adjustment';

export const WippenSupportSpringsDesign: React.FC<
  WippenSupportSpringsDesignProps
> = ({ analyzedKeyboard }) => {
  const { currentLanguage, t } = useTranslation();
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
  const { supportSpringBalanceWeightTargetSerie: targetSerie } =
    useTargetSeries(analyzedKeyboard);

  const renderReading = useTargetReading({
    difference: benchAdjustment,
    format: formatGrams,
    formatDifference: formatSignedGrams,
    keyboard: analyzedKeyboard,
    targetSerie,
  });

  const targetSelectorModes: TargetSelectorMode<
    WippenSupportSpringsDesignMode,
    WippenSupportSpringsDesignTarget
  >[] = useMemo(
    () => [
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
      {
        // Shown even when it cannot be picked: dropping the card altogether
        // hid both the option and the measurement that unlocks it.
        description: useSupportSpringMeasurements
          ? t('Use wippen support springs measured values')
          : t('Requires the “Measure Wippen Support Spring tension” option.'),
        isDisabled: !useSupportSpringMeasurements,
        label: t('Keep the wippen support springs as is.'),
        options: {
          selectorUi: TargetSelectorUi.UniqueTargetSelector as const,
          target: null,
        },
        value: WippenSupportSpringsDesignMode.AsMeasured,
      },
    ],
    [t, useSupportSpringMeasurements],
  );

  const sprungPoints = useMemo(
    () =>
      targetSerie.data.filter(
        (point) => point.payload !== undefined && point.payload !== null,
      ),
    [targetSerie],
  );
  const sprungKeys = useMemo(
    () =>
      sprungPoints.length === 0
        ? null
        : {
            count: sprungPoints.length,
            first: sprungPoints[0]!.number,
            last: sprungPoints[sprungPoints.length - 1]!.number,
          },
    [sprungPoints],
  );

  const summaryEntries = useMemo(() => {
    if (sprungPoints.length === 0) {
      return [{ label: t('Springs'), value: '0' }];
    }
    const first = sprungPoints[0]!;
    const last = sprungPoints[sprungPoints.length - 1]!;

    return [
      { label: t('Springs'), value: sprungPoints.length.toString() },
      {
        label: t('Tension'),
        // A constant tension has nothing to read as a range.
        value:
          first.payload === last.payload
            ? formatGrams(first.payload, currentLanguage)
            : t('from {{from}} ({{fromNote}}) to {{to}} ({{toNote}})', {
                from: formatGrams(first.payload, currentLanguage),
                fromNote: first.name,
                to: formatGrams(last.payload, currentLanguage),
                toNote: last.name,
              }),
      },
      {
        label: t('Keys with a spring'),
        value: t('{{from}} to {{to}}', {
          from: first.number,
          to: last.number,
        }),
      },
    ];
  }, [currentLanguage, sprungPoints, t]);

  return (
    <DesignLayout
      objective={
        <TargetSelector
          title={t('Target')}
          modes={targetSelectorModes}
          selectedMode={wippenSupportSpringsDesignMode}
          selectedTarget={wippenSupportSpringsDesignTarget}
          onModeChange={onModeChange}
          onTargetChange={onTargetChange}
        />
      }
      // Drawn even with no spring designed: the figure keeps its place, and
      // the cards under it do not leap up the page the moment "none" is
      // picked.
      chart={
        <SupportSpringBalanceWeightChart
          renderReading={renderReading}
          variant="design"
          keyboard={analyzedKeyboard}
          sprungKeys={sprungKeys}
          targetSerie={targetSerie}
          extraLegendItems={[
            {
              colorClassName: 'text-ptl-series-target',
              id: 'target',
              label: t('Target'),
              mark: 'line-thick' as const,
            },
          ]}
          caption={<DesignChartSummary entries={summaryEntries} />}
        />
      }
    />
  );
};
