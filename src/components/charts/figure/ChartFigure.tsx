import { MIN_PLOT_WIDTH, PLOT_INSET } from '../chart-geometry';
import type { KeyboardPlacement } from '@/lib/piano/keyboard/keyboard-geometry';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface ChartFigureProps {
  children: React.ReactNode;
  className?: string;
  /** Legend and toggles, above a rule at its head. */
  header?: React.ReactNode;
  /** Geometry of the keyboard axis, used to place the hover band. */
  geometry?: KeyboardPlacement;
  /** The key being read, marked by a brass band across the plot. */
  highlightedKey?: number | null;
  /** Names the plot for a reader who arrives on it with the keyboard. */
  label?: string;
  /** The drawn keyboard that serves as the x axis. */
  keyboard?: React.ReactNode;
  /** Arrow keys move the reading along the keyboard. */
  onKeyDown?: React.KeyboardEventHandler;
  /** What the key under the pointer reads, along the head of the figure. */
  reading?: React.ReactNode;
  tabIndex?: number;
  variant?: 'analyze' | 'design';
}

/**
 * The frame every chart sits in: a header carrying its legend, the reading of
 * the key under the pointer, and the plot with its keyboard axis.
 */
export const ChartFigure = ({
  children,
  className,
  geometry,
  header,
  highlightedKey,
  keyboard,
  label,
  onKeyDown,
  reading,
  tabIndex,
  variant = 'analyze',
}: ChartFigureProps) => {
  const { t } = useTranslation();
  const isAnalyze = variant === 'analyze';

  return (
    <figure
      data-slot="chart-figure"
      className={cn(
        'm-0 min-w-0 rounded-md border border-ptl-rule-strong bg-card',
        className,
      )}
    >
      {header ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-y-2.5 border-b border-border px-[18px] py-3.5',
            isAnalyze ? 'gap-x-[22px]' : 'gap-x-[18px]',
          )}
        >
          {header}
        </div>
      ) : null}
      {reading}
      {/*
       * The focus stop is the box that scrolls, so the same element both
       * reaches the far end of the keyboard and moves the reading with the
       * arrow keys.
       */}
      <div
        data-slot="chart-plot"
        role="group"
        aria-label={label ?? t('Figure: hover a key, or use the arrow keys')}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        className={cn(
          'overflow-x-auto pb-1.5',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          isAnalyze ? 'px-3 pt-4' : 'px-2.5 pt-3.5',
        )}
      >
        <div
          className="relative"
          style={{
            minWidth: isAnalyze
              ? MIN_PLOT_WIDTH.analyze
              : MIN_PLOT_WIDTH.design,
          }}
        >
          {/* The band runs down to the keyboard, whatever its height. */}
          <div className="relative">
            {geometry && highlightedKey ? (
              <HoverBand geometry={geometry} keyNumber={highlightedKey} />
            ) : null}
            <div className="relative z-10">{children}</div>
          </div>
          {keyboard}
        </div>
      </div>
    </figure>
  );
};

/**
 * The brass column behind the key being read.
 *
 * It covers the key's slot at the balance rail — the same column the plot is
 * ruled by — so it stands over the back of the key whose stick it lights, at
 * any width of the figure. It sits behind the plot: a 16 % brass wash over
 * the measurement dots would tint them.
 */
const HoverBand = ({
  geometry,
  keyNumber,
}: {
  geometry: KeyboardPlacement;
  keyNumber: number;
}) => {
  const placed = geometry.keysByNumber.get(keyNumber);
  if (!placed || geometry.width === 0) {
    return null;
  }

  const unit = geometry.slotWidth;
  const start = (placed.backCenter - unit / 2) / geometry.width;
  const width = unit / geometry.width;
  const insets = `(100% - ${PLOT_INSET.left + PLOT_INSET.right}px)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-0 bg-ptl-brass-soft"
      style={{
        left: `calc(${PLOT_INSET.left}px + ${start} * ${insets})`,
        width: `calc(${width} * ${insets})`,
      }}
    />
  );
};
