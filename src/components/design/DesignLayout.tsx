import { DesignPrintSummary } from './steps/DesignPrintSummary';

/**
 * A design page: what you are aiming for, and what it gives you.
 *
 * The target sits in a row above the curve rather than in a column beside
 * it. Eighty-eight keys read across, and a column of cards took a third of
 * the page away from them; laid out in a row the same cards are a band a
 * fifth as tall, so a change to the target is still read on the curve
 * without scrolling — and the curve has the whole page.
 */
export const DesignLayout = ({
  chart,
  objective,
}: {
  chart: React.ReactNode;
  objective: React.ReactNode;
}) => (
  <div data-slot="page-wide" className="flex flex-col gap-6">
    {/* The cards are read, so they keep the measure the prose keeps. */}
    <div className="max-w-[var(--ptl-text-measure)] print:hidden">
      {objective}
    </div>
    {/*
     * A printed sheet has nothing to choose. What it still needs is what was
     * chosen — here and on the three other parameters — so the cards give
     * way to the same recap the adjustment sheet carries.
     */}
    <DesignPrintSummary />
    {chart}
  </div>
);
