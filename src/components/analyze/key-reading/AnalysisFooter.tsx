import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AnalysisFooterProps {
  /** Where this figure leads: the step of the design that acts on it. */
  action?: { label: string; to: string };
  /** How to read the figure, for someone meeting it for the first time. */
  hint?: React.ReactNode;
}

/**
 * The line under an Analyze figure: how to read it, and what to do about it.
 *
 * Neither belongs on paper — one describes the pointer, the other leads to a
 * page — so the whole line stays on the screen. It runs as wide as the figure
 * above it, not as the prose: on a wide screen the action otherwise hung
 * under the middle of the keyboard, 430 px short of the figure's edge.
 */
export const AnalysisFooter = ({ action, hint }: AnalysisFooterProps) =>
  action || hint ? (
    <div
      data-slot="page-wide"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 print:hidden"
    >
      {hint ? (
        <p className="m-0 max-w-[70ch] text-[13px] leading-[1.55] text-ptl-ink-3">
          {hint}
        </p>
      ) : (
        <span />
      )}
      {action ? (
        <Link
          to={action.to}
          className="flex min-h-11 items-center gap-3 rounded-md border border-ptl-rule-strong px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          {action.label}
          <ArrowRight className="size-[17px]" />
        </Link>
      ) : null}
    </div>
  ) : null;
