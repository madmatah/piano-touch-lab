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
}) => (
  <figcaption className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-[18px] pt-3 pb-4 text-[13px] text-muted-foreground">
    {entries.map((entry) => (
      <span key={entry.label}>
        {entry.label} :{' '}
        <span className="font-mono text-foreground">{entry.value}</span>
      </span>
    ))}
  </figcaption>
);
