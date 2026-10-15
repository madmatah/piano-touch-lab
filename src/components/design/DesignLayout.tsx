/**
 * A design page: what you are aiming for on the left, what it gives you on
 * the right. The two sit side by side so a change to the target can be read
 * on the curve without scrolling.
 */
export const DesignLayout = ({
  chart,
  objective,
}: {
  chart: React.ReactNode;
  objective: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-start gap-6">
    <div className="flex flex-[1_1_360px] flex-col gap-4">{objective}</div>
    {chart}
  </div>
);
