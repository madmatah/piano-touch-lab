import { useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import type { KeyboardLike, KeyWith } from '@/lib/piano/keyboard';
import { FrontWeightLevel } from '@/lib/piano/touch-design/front-weight-level';
import type { MeasuredKeyRequirements } from '@/lib/piano/touch-design/measured-key.requirements';

import { CHART_HEIGHTS } from './chart-geometry';
import { scaleOver } from './echarts/build-base-option';
import { ChartFigure } from './figure/ChartFigure';
import { ChartKeyboardAxis } from './figure/ChartKeyboardAxis';
import { ChartLegend, type ChartLegendItem } from './figure/ChartLegend';
import { useChartFigure } from './hooks/use-chart-figure';
import { useFrontWeightStandardSeries } from './hooks/use-front-weight-standard-series';
import { useGenerateSerie } from './hooks/use-generate-serie';
import { KeyboardChart, TouchDesignSerieVariant } from './KeyboardChart';
import {
  serieValues,
  type ChartReadingContext,
  type TouchDesignSerie,
} from './interfaces';

/** The scale of the mockups: −10 g to 45 g, ruled every 10 g. */
const FRONT_WEIGHT_SCALE = { interval: 10, max: 45, min: -10, unit: 'g' };

type KeyWithFrontWeight<T> = T & Pick<MeasuredKeyRequirements, 'frontWeight'>;

export interface FrontWeightChartProps<T> {
  caption?: React.ReactNode;
  defaultFrontWeightLevelsToInclude?: FrontWeightLevel[];
  /** Legend entries contributed by the page, e.g. the design target. */
  extraLegendItems?: ChartLegendItem[];
  keyboard: KeyboardLike<KeyWith<KeyWithFrontWeight<T>>>;
  /**
   * The rail to the right of the figure. It is a function so that the panel
   * reads the very series the chart draws, rather than computing them again.
   */
  renderReading?: (context: ChartReadingContext) => React.ReactNode;
  targetSerie?: TouchDesignSerie;
  variant?: 'analyze' | 'design';
}

export const FrontWeightChart = <T,>({
  caption,
  defaultFrontWeightLevelsToInclude,
  extraLegendItems,
  keyboard,
  renderReading,
  targetSerie,
  variant = 'analyze',
}: FrontWeightChartProps<T>) => {
  const { t } = useTranslation();
  const { geometry, hover, keys } = useChartFigure(keyboard);
  const { isSerieEmpty, generateSerie } = useGenerateSerie(keyboard);

  const measuredSerie = useMemo(
    () =>
      generateSerie(
        (key) => key.payload.frontWeight,
        t('Measured front weight'),
        TouchDesignSerieVariant.Measured,
      ),
    [generateSerie, t],
  );
  const isEmpty = useMemo(
    () => isSerieEmpty(measuredSerie),
    [isSerieEmpty, measuredSerie],
  );

  const defaultSeriesToInclude = useMemo(
    () =>
      defaultFrontWeightLevelsToInclude ?? [
        FrontWeightLevel.Level5,
        FrontWeightLevel.Level6,
        FrontWeightLevel.Level7,
        FrontWeightLevel.Level8,
        FrontWeightLevel.Level9,
      ],
    [defaultFrontWeightLevelsToInclude],
  );

  const standardSeries = useFrontWeightStandardSeries(
    keyboard,
    defaultSeriesToInclude,
  );

  const series = useMemo(
    () =>
      [
        ...standardSeries,
        ...(targetSerie ? [targetSerie] : []),
        ...(isEmpty ? [] : [measuredSerie]),
      ].filter((serie): serie is TouchDesignSerie => serie !== undefined),
    [standardSeries, targetSerie, isEmpty, measuredSerie],
  );

  const scale = useMemo(
    () => scaleOver(FRONT_WEIGHT_SCALE, serieValues(series)),
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
              label: t('Measured front weight'),
              mark: 'dot' as const,
            },
          ]),
      {
        colorClassName: 'text-ptl-series-standard',
        id: 'standard-bold',
        label: t('Standard curves FW#5, FW#7, FW#9'),
        mark: 'line' as const,
      },
      {
        colorClassName: 'text-ptl-series-standard-soft',
        id: 'standard-soft',
        label: t('FW#6, FW#8'),
        mark: 'line-soft' as const,
      },
    ],
    [extraLegendItems, isEmpty, t],
  );

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
        ruleAt={0}
        scale={scale}
        series={series}
      />
    </ChartFigure>
  );

  return figure;
};
