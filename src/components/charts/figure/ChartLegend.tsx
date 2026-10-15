import { cn } from '@/lib/utils';

import { ChartLegendMark, type ChartLegendMarkKind } from './ChartLegendMark';

export interface ChartLegendItem {
  /** A text colour class, e.g. `text-ptl-series-down`. */
  colorClassName: string;
  id: string;
  /** Only meaningful when the item can be switched off. */
  isVisible?: boolean;
  label: string;
  mark: ChartLegendMarkKind;
  onToggle?: () => void;
}

/**
 * The legend of a figure, in HTML rather than in the chart's drawing.
 *
 * The design puts it in the figure's header, above the rule that separates it
 * from the plot, and its entries are real buttons that switch their curves
 * off, as ECharts' own legend did. In HTML it follows the theme through CSS,
 * wraps properly and stays selectable.
 */
export const ChartLegend = ({ items }: { items: ChartLegendItem[] }) => (
  <>
    {items.map((item) =>
      item.onToggle ? (
        <button
          key={item.id}
          type="button"
          aria-pressed={item.isVisible ?? true}
          onClick={item.onToggle}
          className={cn(
            'inline-flex h-[34px] items-center gap-2 rounded-md border border-input bg-card px-3 text-[13px] font-medium text-foreground transition-colors',
            'aria-[pressed=false]:border-dashed aria-[pressed=false]:bg-transparent aria-[pressed=false]:text-ptl-ink-3',
          )}
        >
          <span className={(item.isVisible ?? true) ? item.colorClassName : ''}>
            <ChartLegendMark kind={item.mark} />
          </span>
          {item.label}
        </button>
      ) : (
        <span
          key={item.id}
          className="inline-flex items-center gap-2 text-[13px] text-muted-foreground"
        >
          <span className={item.colorClassName}>
            <ChartLegendMark kind={item.mark} />
          </span>
          {item.label}
        </span>
      ),
    )}
  </>
);
