import { NavLink } from 'react-router-dom';

import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import {
  useDesignSteps,
  type DesignStep,
  type DesignStepId,
} from './hooks/use-design-steps';

const tileClassName = (step: DesignStep, isCurrent: boolean) =>
  cn(
    'flex flex-[1_1_140px] flex-col gap-1 rounded-md border border-border bg-card px-3 py-2.5 text-foreground no-underline transition-colors max-md:flex-[0_0_150px]',
    step.kind === 'result' && 'border-dashed',
    isCurrent &&
      'border-solid border-ptl-rule-strong bg-accent shadow-[inset_0_0_0_1px_var(--ptl-rule-strong)]',
    !isCurrent && step.isAvailable && 'hover:border-input',
    !step.isAvailable && 'cursor-not-allowed opacity-60',
  );

/**
 * Where the design stands, on every page of it.
 *
 * Four parameters and two results, each showing its current setting: the
 * reader sees the whole design from whichever page they are on, which is what
 * turns four pages into one form. A result tile stays dashed and inert until
 * there is a design to show.
 */
export const DesignStepsBar = ({
  currentStepId,
}: {
  currentStepId: DesignStepId;
}) => {
  const { t } = useTranslation();
  const steps = useDesignSteps();

  return (
    <nav
      aria-label={t('Your design')}
      // One row on a phone, scrolled sideways: wrapped in three rows it put
      // the page title some 570 px down an 844 px screen.
      className="flex flex-wrap items-stretch gap-2 max-md:-mx-4 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-4 max-md:pb-1 print:hidden"
    >
      {steps.map((step) => {
        const isCurrent = step.id === currentStepId;
        const content = (
          <>
            <span className="ptl-label">{step.label}</span>
            <span className="font-mono text-[12.5px] text-foreground">
              {step.value}
            </span>
          </>
        );

        // A disabled link stays focusable and is announced as a link; a span
        // says plainly that there is nothing to go to yet.
        return step.isAvailable ? (
          <NavLink
            key={step.id}
            to={step.to}
            aria-current={isCurrent ? 'page' : undefined}
            className={tileClassName(step, isCurrent)}
          >
            {content}
          </NavLink>
        ) : (
          <span
            key={step.id}
            aria-disabled="true"
            className={tileClassName(step, false)}
          >
            {content}
          </span>
        );
      })}
    </nav>
  );
};
