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

export interface KeyReading {
  /** A sentence under the numbers: what they mean at the key. */
  footnote?: React.ReactNode;
  keyNumber: number | null;
  /** Scientific pitch, e.g. `C4`. */
  noteName: string | null;
  rows: KeyReadingRow[];
}

/**
 * What one key reads, across the head of its chart.
 *
 * Ink-dark in both themes — it is the one panel of the interface that is: the
 * design treats it as the instrument's own display, not as a surface of the
 * page. It lies along the top of the figure rather than beside it so that the
 * plot keeps the width of the page, and it is the pointer's own echo, so it
 * never prints.
 *
 * It sticks to the top of the screen while its figure is in view: on a short
 * screen — a phone held sideways — the keyboard is at the bottom of a figure
 * taller than the screen, and a key touched there was read out of sight.
 */
export const KeyReadingStrip = ({ reading }: { reading: KeyReading }) => {
  const { footnote, keyNumber, noteName, rows } = reading;
  const { t } = useTranslation();

  return (
    <section
      aria-live="polite"
      className="sticky top-0 z-20 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-b border-border bg-ptl-reading px-[18px] py-3 text-ptl-reading-foreground print:hidden"
    >
      <span className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[0.08em] text-ptl-reading-muted uppercase">
          {keyNumber === null
            ? t('Reading')
            : t('Reading · key #{{number}}', { number: keyNumber })}
        </span>
        <span className="min-w-[2.2ch] font-serif text-[30px] leading-none">
          {noteName ?? '—'}
        </span>
      </span>
      <dl className="m-0 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-2">
            <dt className="m-0 flex items-center gap-[7px] text-[12.5px] text-ptl-reading-muted">
              {row.mark}
              {row.label}
            </dt>
            <dd
              className={cn(
                'm-0 text-[16px] font-medium',
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
        <p className="m-0 font-serif text-[14px] italic text-ptl-reading-muted">
          {footnote}
        </p>
      ) : null}
    </section>
  );
};
