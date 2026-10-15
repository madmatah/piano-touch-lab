import { ArrowRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { KeyReadingStrip } from '../analyze/key-reading/KeyReadingStrip';
import {
  readingMark,
  touchWeightReadingRows,
} from '../analyze/key-reading/touch-weight-reading';
import {
  TouchWeightChart,
  type TouchWeightReadingContext,
} from '../charts/touch-weight-chart/TouchWeightChart';
import {
  DESIGN_INCLUDES_SPRING_SUPPORT,
  useTouchWeightPreviewSeries,
} from './hooks/use-touch-weight-preview-series';
import { serieValueAt, type TouchDesignSerie } from '../charts/interfaces';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { ADJUSTMENT_THRESHOLD } from '@/lib/piano/touch-design/bench-adjustment';
import { formatGrams } from '@/lib/format/format-weight';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

export interface TouchWeightPreviewProps {
  designedKeyboard: TouchWeightAnalyzedKeyboard;
}

const isWeight = (value: number | undefined): value is number =>
  value !== undefined && !Number.isNaN(value);

/**
 * The keys the design gives a weight to.
 *
 * Before and after are averaged over these alone: a key the design cannot
 * resolve yet — one with no front weight, say — has a "before" but no
 * "after", and counting it on one side only would compare two pianos.
 */
const designedKeysOf = (serie: TouchDesignSerie): ReadonlySet<number> =>
  new Set(
    serie.data
      .filter((point) => isWeight(point.payload))
      .map((point) => point.number),
  );

const averageOf = (
  serie: TouchDesignSerie,
  keys: ReadonlySet<number>,
): number | null => {
  const values = serie.data
    .filter((point) => keys.has(point.number))
    .map((point) => point.payload)
    .filter(isWeight);
  return values.length === 0
    ? null
    : values.reduce((total, value) => total + value, 0) / values.length;
};

const ComparisonTile = ({
  before,
  label,
  isUnchanged,
  unchangedLabel,
  value,
}: {
  before: string;
  isUnchanged: boolean;
  label: string;
  unchangedLabel: string;
  value: string;
}) => (
  <div className="flex flex-[1_1_200px] flex-col gap-1.5 rounded-md border border-border bg-card px-[18px] py-4">
    <span className="text-[13px] text-muted-foreground">{label}</span>
    <span className="flex items-baseline gap-2">
      {isUnchanged ? null : (
        <span className="font-mono text-[14px] text-ptl-ink-3 line-through">
          {before}
        </span>
      )}
      <span className="font-mono text-[22px] font-medium">{value}</span>
      {isUnchanged ? (
        <span className="text-[12.5px] text-ptl-ink-3">{unchangedLabel}</span>
      ) : null}
    </span>
  </div>
);

/**
 * The touch the design gives, against the touch the piano has today.
 *
 * Four figures say what changes at a glance; the chart underneath shows where
 * along the keyboard it changes, with the current balance weight drawn hollow
 * behind the designed one.
 */
export const TouchWeightPreview = ({
  designedKeyboard,
}: TouchWeightPreviewProps) => {
  const { currentLanguage, t } = useTranslation();
  const analyzedKeyboard = useAnalyzedKeyboard();
  const { useSupportSpringMeasurements } = useMeasureOptions();

  const { current: currentSeries, designed: designedSeries } =
    useTouchWeightPreviewSeries(
      designedKeyboard,
      analyzedKeyboard,
      useSupportSpringMeasurements,
    );

  const ghostSerie = useMemo<TouchDesignSerie>(
    () => ({ ...currentSeries.balance, name: t('Balance, as it stands') }),
    [currentSeries.balance, t],
  );

  const designedKeys = useMemo(
    () => designedKeysOf(designedSeries.balance),
    [designedSeries.balance],
  );

  const tiles = useMemo(() => {
    const entries = [
      { current: currentSeries.balance, label: t('Average balance weight') },
      { current: currentSeries.down, label: t('Average down weight') },
      { current: currentSeries.up, label: t('Average up weight') },
      { current: currentSeries.friction, label: t('Average friction') },
    ] as const;
    const designed = [
      designedSeries.balance,
      designedSeries.down,
      designedSeries.up,
      designedSeries.friction,
    ];

    return entries.map((entry, index) => {
      const before = averageOf(entry.current, designedKeys);
      const after = averageOf(designed[index]!, designedKeys);
      return {
        before: formatGrams(before, currentLanguage),
        isUnchanged:
          before !== null &&
          after !== null &&
          Math.abs(after - before) < ADJUSTMENT_THRESHOLD,
        label: entry.label,
        value: formatGrams(after, currentLanguage),
      };
    });
  }, [currentLanguage, currentSeries, designedKeys, designedSeries, t]);

  const designedBalance = averageOf(designedSeries.balance, designedKeys);

  // The designed weights of the key under the pointer, and the balance it
  // has today: the per-key answer the averages above cannot give.
  const renderReading = useCallback(
    ({ hoveredKey, series }: TouchWeightReadingContext) => (
      <KeyReadingStrip
        reading={{
          keyNumber: hoveredKey,
          noteName:
            designedKeyboard.getKeyByNumber(hoveredKey ?? 0)?.name ?? null,
          rows: [
            ...touchWeightReadingRows(series, hoveredKey, currentLanguage),
            {
              label: ghostSerie.name,
              mark: readingMark('diamond-hollow', 'text-ptl-reading-muted'),
              value: formatGrams(
                serieValueAt(ghostSerie, hoveredKey),
                currentLanguage,
              ),
            },
          ],
        }}
      />
    ),
    [currentLanguage, designedKeyboard, ghostSerie],
  );

  return (
    <div data-slot="page-wide" className="flex flex-col gap-4">
      {/* The tiles are read, so they keep the measure the prose keeps. */}
      <div className="flex max-w-[var(--ptl-text-measure)] flex-wrap gap-3">
        {tiles.map((tile) => (
          <ComparisonTile
            key={tile.label}
            {...tile}
            unchangedLabel={t('unchanged')}
          />
        ))}
      </div>

      <TouchWeightChart
        variant="design"
        analyzedKeyboard={designedKeyboard}
        ghostSerie={ghostSerie}
        renderReading={renderReading}
        useSupportSpringMeasurements={DESIGN_INCLUDES_SPRING_SUPPORT}
        caption={
          <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border px-[18px] pt-3 pb-4 text-[13px] text-muted-foreground">
            <span>
              {t('Balance weight once adjusted')} :{' '}
              <span className="font-mono text-foreground">
                {formatGrams(designedBalance, currentLanguage)}
              </span>{' '}
              {t('across the {{count}} keys', {
                count: designedKeys.size,
              })}
            </span>
            <Link
              to="/design/adjustment-sheet"
              className="inline-flex items-center gap-2 font-semibold text-ptl-brass transition-colors hover:text-foreground"
            >
              {t('See the adjustment sheet')}
              <ArrowRight className="size-4" />
            </Link>
          </figcaption>
        }
      />
    </div>
  );
};
