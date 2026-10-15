import { useTranslation } from '@/hooks/use-translation';

export interface KeyboardSummaryRow {
  label: string;
  value: string;
}

/** What the whole instrument reads, under the single-key reading. */
export const KeyboardSummaryCard = ({
  rows,
}: {
  rows: KeyboardSummaryRow[];
}) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-md border border-border bg-card px-5 pt-4 pb-1.5">
      <span className="ptl-label">{t('For the whole piano')}</span>
      <dl className="mt-2 mb-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 border-t border-border py-[11px] first:border-t-0"
          >
            <dt className="m-0 text-[13.5px] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="m-0 font-mono text-base font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
