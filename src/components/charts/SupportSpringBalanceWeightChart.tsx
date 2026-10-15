import { useMemo } from 'react';

import { CoilSpring } from '@/assets/icons/CoilSpring';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { CHART_HEIGHTS } from './chart-geometry';
import { scaleOver } from './echarts/build-base-option';
import { ChartFigure } from './figure/ChartFigure';
import { ChartKeyboardAxis } from './figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from './figure/ChartLegend';
import { useChartFigure } from './hooks/use-chart-figure';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { KeyboardChart, TouchDesignSerieVariant } from './KeyboardChart';
import {
  serieValues,
  type ChartReadingContext,
  type TouchDesignSerie,
} from './interfaces';

/** The scale of the mockups: 0 g to 30 g, ruled every 10 g. */
const SPRING_WEIGHT_SCALE = { interval: 10, max: 30, min: 0, unit: 'g' };

type KeyWithSupportSpringBalanceWeight<T> = T &
  Pick<TouchWeightKeyAnalysis, 'supportSpringBalanceWeight'>;

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
   * The rail to the right of the figure. It is a function so that the panel
   * reads the very series the chart draws, rather than computing them again.
   */
  renderSidePanel?: (context: ChartReadingContext) => React.ReactNode;
  targetSerie?: TouchDesignSerie;
  variant?: 'analyze' | 'design';
}

export const SupportSpringBalanceWeightChart = <T,>({
  caption,
  emptyStateActions,
  extraLegendItems,
  keyboard,
  renderSidePanel,
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
      ...(targetSerie ? [targetSerie] : []),
      ...(isEmpty ? [] : [measuredSerie]),
    ],
    [isEmpty, measuredSerie, targetSerie],
  );

  const scale = useMemo(
    () => scaleOver(SPRING_WEIGHT_SCALE, serieValues(series)),
    [series],
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () => [
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
    ],
    [extraLegendItems, isEmpty, t],
  );

  const plotHeight =
    variant === 'analyze' ? CHART_HEIGHTS.plot : CHART_HEIGHTS.plotCompact;

  if (isEmpty && emptyStateActions) {
    return (
      <section
        aria-label={t('Chart unavailable')}
        className="relative overflow-hidden rounded-md border border-ptl-rule-strong bg-card"
      >
        <div aria-hidden="true" className="px-3 pt-[18px] pb-1.5 opacity-55">
          <KeyboardChart
            geometry={geometry}
            height={plotHeight}
            scale={SPRING_WEIGHT_SCALE}
            series={[]}
          />
          <ChartKeyboardAxis
            keys={keys}
            marks="none"
            description={t('Keyboard')}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-ptl-veil p-6">
          <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
            <CoilSpring
              aria-hidden="true"
              className="size-[34px] text-ptl-brass"
            />
            <h2 className="ptl-display m-0 text-[30px] leading-[1.15]">
              {t('No wippen support spring measurement')}
            </h2>
            <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
              {t(
                'Enable the “Measure Wippen Support Spring tension” option, then record the down weight with the spring attached in Measure.',
              )}
            </p>
            <p className="m-0 text-sm leading-[1.55] text-ptl-ink-3">
              {t(
                'This measurement is optional: you can design your springs without it.',
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 pt-1.5">
              {emptyStateActions}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const figure = (
    <ChartFigure
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
          onKeyHover={hover.setHoveredKey}
          description={t('Keyboard: hover a key to read its measurement')}
        />
      }
      {...hover.figureProps}
    >
      <KeyboardChart
        geometry={geometry}
        height={plotHeight}
        onChartReady={hover.bindChart}
        scale={scale}
        series={series}
      />
    </ChartFigure>
  );

  if (!renderSidePanel) {
    return figure;
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      {figure}
      {renderSidePanel({
        hoveredKey: hover.hoveredKey,
        measuredSerie,
        // The spring chart has no standard curves to compare against.
        referenceSeries: [],
      })}
    </div>
  );
};
