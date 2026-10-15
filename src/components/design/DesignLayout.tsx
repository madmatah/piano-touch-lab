import { DesignPrintSummary } from './steps/DesignPrintSummary';

/**
 * A design page: what it gives you, and what you are aiming for.
 *
 * The curve comes first, at the width of the page, and the target under it,
 * where the mockup puts it in a column beside: eighty-eight keys read across,
 * and the column took a third of the page away from them. Above the curve,
 * the cards pushed it off a laptop's screen, and moved it each time a choice
 * brought controls of a different height. Under it, the whole curve is on the
 * screen when the page opens, nothing a choice does moves it, and a step of a
 * control is read on it with the control in view.
 */
export const DesignLayout = ({
  chart,
  objective,
}: {
  chart: React.ReactNode;
  objective: React.ReactNode;
}) => (
  <div data-slot="page-wide" className="flex flex-col gap-6">
    {/*
     * A printed sheet has nothing to choose. What it still needs is what was
     * chosen — here and on the three other parameters — so the cards give
     * way to the same recap the adjustment sheet carries.
     */}
    <DesignPrintSummary />
    {chart}
    {/* The cards are read, so they keep the measure the prose keeps. */}
    <div className="max-w-[var(--ptl-text-measure)] print:hidden">
      {objective}
    </div>
  </div>
);
