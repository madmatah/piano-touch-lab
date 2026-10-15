import { cn } from '@/lib/utils';

export interface PageHeadingProps {
  /** Buttons on the heading's baseline, aligned right. Never printed. */
  actions?: React.ReactNode;
  className?: string;
  /** How wide the lede is allowed to run, in characters. */
  ledeWidth?: string;
  /** One or two sentences under the title. */
  lede?: React.ReactNode;
  /**
   * The title. Its accented word is set in brass italic, so pass a `<Trans>`
   * rather than a plain string whenever the design calls for one.
   */
  title: React.ReactNode;
}

/** The title block that opens every page. */
export const PageHeading = ({
  actions,
  className,
  lede,
  ledeWidth = '66ch',
  title,
}: PageHeadingProps) => (
  <header
    className={cn('flex flex-wrap items-end justify-between gap-4', className)}
  >
    <div className="flex flex-col gap-2.5">
      <h1 className="ptl-display m-0 text-[clamp(38px,4.6vw,58px)] leading-none">
        {title}
      </h1>
      {lede ? (
        <p
          data-slot="page-lede"
          className="m-0 text-base leading-[1.55] text-muted-foreground"
          style={{ maxWidth: ledeWidth }}
        >
          {lede}
        </p>
      ) : null}
    </div>
    {actions ? (
      <div className="flex flex-wrap gap-2.5 print:hidden">{actions}</div>
    ) : null}
  </header>
);
