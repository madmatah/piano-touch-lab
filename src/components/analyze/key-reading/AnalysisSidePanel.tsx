import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  KeyboardSummaryCard,
  type KeyboardSummaryRow,
} from './KeyboardSummaryCard';
import { KeyReadingCard, type KeyReadingCardProps } from './KeyReadingCard';

export interface AnalysisSidePanelProps {
  action?: { label: string; to: string };
  ariaLabel: string;
  /** A sentence under the cards, e.g. how to read a key. */
  hint?: React.ReactNode;
  reading: KeyReadingCardProps;
  summary: KeyboardSummaryRow[];
}

/**
 * The rail to the right of an Analyze chart: one key, then the whole piano.
 *
 * Only the whole-piano summary is printed: a reading rail on paper would show
 * whichever key the pointer happened to rest on, and the link to the next step
 * leads nowhere there.
 */
export const AnalysisSidePanel = ({
  action,
  ariaLabel,
  hint,
  reading,
  summary,
}: AnalysisSidePanelProps) => (
  <aside
    aria-label={ariaLabel}
    className="flex flex-[1_1_260px] flex-col gap-4"
  >
    <KeyReadingCard {...reading} />
    <KeyboardSummaryCard rows={summary} />
    {action ? (
      <Link
        to={action.to}
        className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-ptl-rule-strong px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent print:hidden"
      >
        {action.label}
        <ArrowRight className="size-[17px]" />
      </Link>
    ) : null}
    {hint ? (
      <p className="m-0 text-[13px] leading-[1.55] text-ptl-ink-3 print:hidden">
        {hint}
      </p>
    ) : null}
  </aside>
);
