export interface EmptyStateProps {
  /** The ways out: to the page where the missing data is entered. */
  actions?: React.ReactNode;
  /** In brass, at 34 px. */
  icon: React.ReactNode;
  /** A word for the reader who could do without it. */
  note?: string;
  text?: string;
  title: string;
}

/**
 * What a page says when it has nothing to show yet: what is missing, and the
 * way to it.
 *
 * Drawn after the first empty state the design gave, the spring figure's: an
 * icon in brass, a title in the display face, a line or two, the actions.
 * Axes with nothing on them said none of this.
 */
export const EmptyState = ({
  actions,
  icon,
  note,
  text,
  title,
}: EmptyStateProps) => (
  <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
    <span aria-hidden="true" className="text-ptl-brass [&>svg]:size-[34px]">
      {icon}
    </span>
    <h2 className="ptl-display m-0 text-[30px] leading-[1.15]">{title}</h2>
    {text ? (
      <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
        {text}
      </p>
    ) : null}
    {note ? (
      <p className="m-0 text-sm leading-[1.55] text-ptl-ink-3">{note}</p>
    ) : null}
    {actions ? (
      <div className="flex flex-wrap justify-center gap-2.5 pt-1.5 print:hidden">
        {actions}
      </div>
    ) : null}
  </div>
);
