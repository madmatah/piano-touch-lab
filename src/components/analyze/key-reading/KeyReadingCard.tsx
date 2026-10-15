import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface KeyReadingRow {
  /** Highlighted in brass: the measurement the page is about. */
  isAccent?: boolean;
  /** Set in serif italic: a judgement rather than a number. */
  isQualitative?: boolean;
  label: string;
  /** Optional series glyph, as on the static balance chart. */
  mark?: React.ReactNode;
  value: string;
}

export interface KeyReadingCardProps {
  footnote?: React.ReactNode;
  keyNumber: number | null;
  /** Scientific pitch, e.g. `C4`. */
  noteName: string | null;
  rows: KeyReadingRow[];
}

/**
 * What one key reads, beside the chart.
 *
 * Ink-dark in both themes — it is the one panel of the interface that is: the
 * design treats it as the instrument's own display, not as a surface of the
 * page.
 */
export const KeyReadingCard = ({
  footnote,
  keyNumber,
  noteName,
  rows,
}: KeyReadingCardProps) => {
  const { t } = useTranslation();

  return (
    <section
      aria-live="polite"
      className={cn(
        'rounded-md border border-ptl-reading-border bg-ptl-reading px-5 pt-[18px] text-ptl-reading-foreground print:hidden',
        footnote ? 'pb-3.5' : 'pb-2',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.08em] text-ptl-reading-muted uppercase">
          {keyNumber === null
            ? t('Reading')
            : t('Reading · key #{{number}}', { number: keyNumber })}
        </span>
      </div>
      <div className="pt-2.5 pb-3.5 font-serif text-[64px] leading-none">
        {noteName ?? '—'}
      </div>
      <dl className="m-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 border-t border-ptl-reading-rule py-[11px]"
          >
            <dt className="m-0 flex items-center gap-[9px] text-[13.5px] text-ptl-reading-muted">
              {row.mark}
              {row.label}
            </dt>
            <dd
              className={cn(
                'm-0 text-[18px] font-medium',
                row.isQualitative ? 'font-serif italic' : 'font-mono',
                (row.isAccent ?? row.isQualitative)
                  ? 'text-ptl-reading-accent'
                  : undefined,
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {footnote ? (
        <p className="m-0 border-t border-ptl-reading-rule pt-3 text-[13px] leading-[1.5] text-ptl-reading-muted">
          {footnote}
        </p>
      ) : null}
    </section>
  );
};
