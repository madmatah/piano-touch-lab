import { cn } from '@/lib/utils';

export interface StepperProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  children: React.ReactNode;
  className?: string;
  nextIcon: React.ReactNode;
  nextLabel: string;
  onNext: () => void;
  onPrevious: () => void;
  previousIcon: React.ReactNode;
  previousLabel: string;
}

const arrowClassName =
  'inline-flex size-10 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none disabled:opacity-40 disabled:hover:bg-transparent';

/**
 * The design's stepper: one bordered segment holding a back arrow, the value
 * and a forward arrow, rather than three controls spaced apart.
 *
 * Purely presentational — what sits between the arrows is the caller's, so the
 * same frame serves a number being nudged and a value being cycled through.
 */
export const Stepper = ({
  canGoNext,
  canGoPrevious,
  children,
  className,
  nextIcon,
  nextLabel,
  onNext,
  onPrevious,
  previousIcon,
  previousLabel,
}: StepperProps) => (
  <div
    className={cn(
      'inline-flex items-center overflow-hidden rounded-md border border-input bg-card',
      className,
    )}
  >
    <button
      type="button"
      aria-label={previousLabel}
      className={arrowClassName}
      disabled={!canGoPrevious}
      onClick={onPrevious}
    >
      {previousIcon}
    </button>
    <div className="flex h-10 items-center justify-center border-x border-border">
      {children}
    </div>
    <button
      type="button"
      aria-label={nextLabel}
      className={arrowClassName}
      disabled={!canGoNext}
      onClick={onNext}
    >
      {nextIcon}
    </button>
  </div>
);
