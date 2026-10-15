import { useId } from 'react';

import { cn } from '@/lib/utils';

export interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Mono note aligned right of the title: counts, ranges, units. */
  meta?: React.ReactNode;
  title: React.ReactNode;
}

/** A bordered block of the page, titled in serif with an optional mono note. */
export const PageSection = ({
  children,
  className,
  contentClassName,
  meta,
  title,
}: PageSectionProps) => {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex flex-col gap-4 rounded-md border border-border bg-card px-6 pt-[22px] pb-[26px]',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id={titleId}
          className="m-0 font-serif text-[26px] leading-none font-medium"
        >
          {title}
        </h2>
        {meta ? (
          <span className="font-mono text-[12.5px] text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </div>
      <div className={cn('flex flex-col gap-4', contentClassName)}>
        {children}
      </div>
    </section>
  );
};
