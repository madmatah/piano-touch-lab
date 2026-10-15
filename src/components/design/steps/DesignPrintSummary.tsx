import { useDesignSteps } from './hooks/use-design-steps';

/**
 * The design, recapped at the top of a printed sheet.
 *
 * On screen the steps bar says the same thing, but as links. On paper the
 * reader still needs the four settings the sheet was computed from — and
 * nothing to click.
 */
export const DesignPrintSummary = () => {
  const steps = useDesignSteps();

  return (
    <div className="ptl-print-only flex flex-wrap gap-2">
      {steps
        .filter((step) => step.kind === 'parameter')
        .map((step) => (
          <div
            key={step.id}
            className="flex flex-[1_1_140px] flex-col gap-1 rounded-md border border-border px-3 py-2.5"
          >
            <span className="ptl-label">{step.name}</span>
            <span className="font-mono text-[12.5px]">{step.value}</span>
          </div>
        ))}
    </div>
  );
};
