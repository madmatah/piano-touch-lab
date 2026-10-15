import { useMemo } from 'react';

import { CoilSpring } from '@/assets/icons/CoilSpring';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { CHART_HEIGHTS } from './chart-geometry';
import { scaleOver } from './echarts/build-base-option';
import { EmptyState } from '@/components/app-ui/EmptyState';

import { ChartEmptyFrame } from './figure/ChartEmptyFrame';
import { ChartFigure } from './figure/ChartFigure';
import { ChartKeyboardAxis } from './figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from './figure/ChartLegend';
import { useChartFigure } from './hooks/use-chart-figure';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { KeyboardChart, TouchDesignSerieVariant } from './KeyboardChart';
import {
  serieValues,
  type ChartReadingContext,
  type KeyRangeNote,
  type TouchDesignSerie,
} from './interfaces';
import { legendIdOf, useLegendToggles } from './hooks/use-legend-toggles';

/**
 * The scales of the mockups: what Analyze reads is drawn from 0 to 30 g, ruled
 * every 10 g; what Design sets, from 0 to 12 g, ruled every 3 g.
 */
const SPRING_WEIGHT_SCALES = {
  analyze: { interval: 10, max: 30, min: 0, unit: 'g' },
  // A designed spring stays under a dozen grams: against 30 g its curve would
  // keep to the bottom third of the plot.
  design: { interval: 3, max: 12, min: 0, unit: 'g' },
};

type KeyWithSupportSpringBalanceWeight<T> = T &
  Pick<TouchWeightKeyAnalysis, 'supportSpringBalanceWeight'>;

export interface SprungKeys {
  count: number;
  first: number;
  last: number;
}

export interface SupportSpringBalanceWeightChartProps<T> {
  caption?: React.ReactNode;
  /**
   * The buttons of the empty state. Passing them is what turns an empty chart
   * into the "nothing measured yet" panel: the page owns the buttons because
   * it knows where they lead, and Design, which shares this chart, has no such
   * state to offer.
   */
  emptyStateActions?: React.ReactNode;
  /** Legend entries contributed by the page, e.g. the design target. */
  extraLegendItems?: ChartLegendItem[];
  keyboard: KeyboardLike<KeyWith<KeyWithSupportSpringBalanceWeight<T>>>;
  /**
   * The reading strip at the head of the figure. It is a function so that the
   * strip reads the very series the chart draws, rather than computing them
   * again.
   */
  renderReading?: (context: ChartReadingContext) => React.ReactNode;
  /**
   * The keys the designed springs are on, named on the plot and washed on
   * its keyboard, as the mockup does: where the target stops is the design,
   * not a gap in it. `null` is a design that fits none, said across the
   * whole keyboard; left out, the chart is not drawing a design at all.
   */
  sprungKeys?: SprungKeys | null;
  targetSerie?: TouchDesignSerie;
  variant?: 'analyze' | 'design';
}

export const SupportSpringBalanceWeightChart = <T,>({
  caption,
  emptyStateActions,
  extraLegendItems,
  keyboard,
  renderReading,
  sprungKeys,
  targetSerie,
  variant = 'analyze',
}: SupportSpringBalanceWeightChartProps<T>) => {
  const { t } = useTranslation();
  const { geometry, hover, keys } = useChartFigure(keyboard);
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);
  const { useSupportSpringMeasurements } = useMeasureOptions();

  const measuredSerie = useMemo(
    () =>
      generateSerie(
        // Readings taken before the option was switched off stay in the
        // profile, but they are no longer what the piano is: do not draw them.
        (key) =>
          useSupportSpringMeasurements
            ? key.payload.supportSpringBalanceWeight
            : null,
        t('Measured spring-supported weight'),
        TouchDesignSerieVariant.Measured,
      ),
    [generateSerie, t, useSupportSpringMeasurements],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(measuredSerie),
    [isSerieEmpty, measuredSerie],
  );

  const series = useMemo(
    () => [
      // What lies under the target is what the springs take off the keys.
      ...(targetSerie ? [{ ...targetSerie, isFilled: true }] : []),
      ...(isEmpty ? [] : [measuredSerie]),
    ],
    [isEmpty, measuredSerie, targetSerie],
  );

  const lastKey = keys[keys.length - 1]?.number;
  const firstKey = keys[0]?.number;
  const rangeNotes = useMemo<KeyRangeNote[] | undefined>(() => {
    if (sprungKeys === undefined) {
      return undefined;
    }
    if (sprungKeys === null) {
      return firstKey === undefined || lastKey === undefined
        ? undefined
        : [
            {
              from: firstKey,
              kind: 'label',
              text: t('without springs'),
              to: lastKey,
            },
          ];
    }
    const { count, first, last } = sprungKeys;
    return [
      {
        from: first,
        kind: 'bracket',
        text: t('{{count}} springs', { count }),
        to: last,
      },
      ...(lastKey !== undefined && last < lastKey
        ? [
            {
              from: last + 1,
              kind: 'label' as const,
              text: t('without springs'),
              to: lastKey,
            },
          ]
        : []),
    ];
  }, [firstKey, lastKey, sprungKeys, t]);
  const markedKeys = useMemo(
    () =>
      sprungKeys
        ? new Set(
            keys
              .map((key) => key.number)
              .filter(
                (number) =>
                  number >= sprungKeys.first && number <= sprungKeys.last,
              ),
          )
        : undefined,
    [keys, sprungKeys],
  );

  const scale = useMemo(
    () => scaleOver(SPRING_WEIGHT_SCALES[variant], serieValues(series)),
    [series, variant],
  );

  const { isShown, withToggles } = useLegendToggles();
  const drawnSeries = useMemo(
    () => series.filter((serie) => isShown(legendIdOf(serie))),
    [isShown, series],
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      withToggles([
        ...(extraLegendItems ?? []),
        ...(isEmpty
          ? []
          : [
              {
                colorClassName: 'text-foreground',
                id: 'measured',
                label: t('Measured spring-supported weight'),
                mark: 'dot' as const,
              },
            ]),
      ]),
    [extraLegendItems, isEmpty, t, withToggles],
  );

  const plotHeight =
    variant === 'analyze' ? CHART_HEIGHTS.plot : CHART_HEIGHTS.plotCompact;

  if (isEmpty && emptyStateActions) {
    return (
      <ChartEmptyFrame
        geometry={geometry}
        height={plotHeight}
        keys={keys}
        scale={SPRING_WEIGHT_SCALES[variant]}
        variant={variant}
      >
        <EmptyState
          icon={<CoilSpring />}
          title={t('No wippen support spring measurement')}
          text={t(
            'Enable the “Measure Wippen Support Spring tension” option, then record the down weight with the spring attached in Measure.',
          )}
          note={t(
            'This measurement is optional: you can design your springs without it.',
          )}
          actions={emptyStateActions}
        />
      </ChartEmptyFrame>
    );
  }

  const figure = (
    <ChartFigure
      reading={renderReading?.({
        hoveredKey: hover.hoveredKey,
        measuredSerie,
        // The spring chart has no standard curves to compare against.
        referenceSeries: [],
      })}
      variant={variant}
      geometry={geometry}
      highlightedKey={hover.hoveredKey}
      header={
        legendItems.length > 0 ? <ChartLegend items={legendItems} /> : undefined
      }
      caption={caption}
      keyboard={
        <ChartKeyboardAxis
          keys={keys}
          highlightedKey={hover.hoveredKey}
          markedKeys={markedKeys}
          onKeyHover={hover.setHoveredKey}
          description={t('Keyboard: hover a key to read its measurement')}
        />
      }
      {...hover.figureProps}
    >
      <KeyboardChart
        variant={variant}
        geometry={geometry}
        height={plotHeight}
        onChartReady={hover.bindChart}
        rangeNotes={rangeNotes}
        scale={scale}
        series={drawnSeries}
      />
    </ChartFigure>
  );

  return figure;
};
