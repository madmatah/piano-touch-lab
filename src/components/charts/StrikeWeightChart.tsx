import { useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { StrikeWeightLevel } from '@/lib/piano/touch-design/hammer-weight-level';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

import { CHART_HEIGHTS } from './chart-geometry';
import { scaleOver } from './echarts/build-base-option';
import { ChartEmptyFrame } from './figure/ChartEmptyFrame';
import { ChartFigure } from './figure/ChartFigure';
import { ChartKeyboardAxis } from './figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from './figure/ChartLegend';
import { useChartFigure } from './hooks/use-chart-figure';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { useStrikeWeightStandardSeries } from './hooks/use-strike-weight-standard-series';
import { KeyboardChart, TouchDesignSerieVariant } from './KeyboardChart';
import {
  serieValues,
  type ChartReadingContext,
  type TouchDesignSerie,
} from './interfaces';
import { legendIdOf, useLegendToggles } from './hooks/use-legend-toggles';

/** The scale of the mockups: 2 g to 16 g, ruled every 2 g. */
const STRIKE_WEIGHT_SCALE = { interval: 2, max: 16, min: 2, unit: 'g' };

/** The thirteen standard curves, drawn unless the page asks for fewer. */
const ALL_STRIKE_WEIGHT_LEVELS = Object.values(StrikeWeightLevel);

type KeyWithStrikeWeight<T> = T & Pick<MeasuredKeyRequirements, 'strikeWeight'>;

export interface StrikeWeightChartProps<T> {
  caption?: React.ReactNode;
  /** Said over the empty figure, until there is something to draw. */
  emptyState?: React.ReactNode;
  defaultHammerWeightLevelsToInclude?: StrikeWeightLevel[];
  /** Legend entries contributed by the page, e.g. the design target. */
  extraLegendItems?: ChartLegendItem[];
  keyboard: KeyboardLike<KeyWith<KeyWithStrikeWeight<T>>>;
  /**
   * The reading strip at the head of the figure. It is a function so that the
   * strip reads the very series the chart draws, rather than computing them
   * again.
   */
  renderReading?: (context: ChartReadingContext) => React.ReactNode;
  targetSerie?: TouchDesignSerie;
  variant?: 'analyze' | 'design';
}

export const StrikeWeightChart = <T,>({
  caption,
  emptyState,
  defaultHammerWeightLevelsToInclude,
  extraLegendItems,
  keyboard,
  renderReading,
  targetSerie,
  variant = 'analyze',
}: StrikeWeightChartProps<T>) => {
  const { t } = useTranslation();
  const { geometry, hover, keys } = useChartFigure(keyboard);
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);

  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.strikeWeight,
        t('Measured strike weight'),
        TouchDesignSerieVariant.Measured,
      ),
    [generateSerie, t],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(measuredSerie),
    [isSerieEmpty, measuredSerie],
  );

  const defaultSeriesToInclude = useMemo(
    () => defaultHammerWeightLevelsToInclude ?? ALL_STRIKE_WEIGHT_LEVELS,
    [defaultHammerWeightLevelsToInclude],
  );

  const standardSeries = useStrikeWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  // Thirteen curves run close together: the four landmarks are drawn last so
  // that the intermediate ones never cross over them.
  const orderedStandardSeries = useMemo(
    () => [
      ...standardSeries.filter(
        (serie) => serie.variant !== TouchDesignSerieVariant.DefaultBold,
      ),
      ...standardSeries.filter(
        (serie) => serie.variant === TouchDesignSerieVariant.DefaultBold,
      ),
    ],
    [standardSeries],
  );

  const series = useMemo(
    () =>
      [
        ...orderedStandardSeries,
        ...(targetSerie ? [targetSerie] : []),
        ...(isEmpty ? [] : [measuredSerie]),
      ].filter((serie): serie is TouchDesignSerie => serie !== undefined),
    [orderedStandardSeries, targetSerie, isEmpty, measuredSerie],
  );

  const scale = useMemo(
    () => scaleOver(STRIKE_WEIGHT_SCALE, serieValues(series)),
    [series],
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
                label: t('Measured strike weight'),
                mark: 'dot' as const,
              },
            ]),
        {
          colorClassName: 'text-ptl-series-standard',
          id: 'standard-bold',
          label: t('SW#1, SW#5, SW#9, SW#13'),
          mark: 'line' as const,
        },
        {
          colorClassName: 'text-ptl-series-standard-soft',
          id: 'standard-soft',
          label: t('Intermediate curves'),
          mark: 'line-soft' as const,
        },
      ]),
    [extraLegendItems, isEmpty, t, withToggles],
  );

  if (isEmpty && emptyState) {
    return (
      <ChartEmptyFrame
        geometry={geometry}
        height={
          variant === 'analyze' ? CHART_HEIGHTS.plot : CHART_HEIGHTS.plotCompact
        }
        keys={keys}
        scale={STRIKE_WEIGHT_SCALE}
        variant={variant}
      >
        {emptyState}
      </ChartEmptyFrame>
    );
  }

  const figure = (
    <ChartFigure
      reading={renderReading?.({
        hoveredKey: hover.hoveredKey,
        measuredSerie,
        referenceSeries: standardSeries,
      })}
      variant={variant}
      geometry={geometry}
      highlightedKey={hover.hoveredKey}
      header={<ChartLegend items={legendItems} />}
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
        variant={variant}
        geometry={geometry}
        height={
          variant === 'analyze' ? CHART_HEIGHTS.plot : CHART_HEIGHTS.plotCompact
        }
        onChartReady={hover.bindChart}
        scale={scale}
        series={drawnSeries}
      />
    </ChartFigure>
  );

  return figure;
};
