import { useTranslation } from '@/hooks/use-translation';

/**
 * What the target curve amounts to, under the chart that draws it.
 *
 * It replaces the figure caption on the design pages: there, the question is
 * not what the figure shows but what it will cost in grams.
 */
export const DesignChartSummary = ({
  entries,
}: {
  entries: { label: string; value: string }[];
}) => {
  const { t } = useTranslation();

  // The colon is the translation's: French puts a space before it, English
  // does not. Not a namespace separator either, which i18next would take it
  // for in a key with no space in it.
  return (
    <figcaption className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-[18px] pt-3 pb-4 text-[13px] text-muted-foreground">
      {entries.map((entry) => (
        <span key={entry.label}>
          {t('{{label}}:', { label: entry.label, nsSeparator: false })}{' '}
          <span className="font-mono text-foreground">{entry.value}</span>
        </span>
      ))}
    </figcaption>
  );
};
