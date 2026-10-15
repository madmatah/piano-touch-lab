import { useId } from 'react';
import { CircleHelp, Info } from 'lucide-react';

import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RadioGroupItem } from '../ui/radio-group';

export interface RadioGroupItemProps<T extends string> {
  children?: React.ReactNode;
  description?: string;
  disabledReason?: string;
  /**
   * The description on demand, behind a "?" that a tap opens as well as a
   * click: the card keeps its title alone, so that a row of cards stays one
   * line of choices rather than a column of paragraphs.
   */
  hasDescriptionOnDemand?: boolean;
  isDisabled?: boolean;
  label: string;
  value: T;
}

/**
 * A choice presented as a card: the control, a title and a description, with
 * the selected card ringed in full-strength ink.
 *
 * `children` are rendered inside the card, under the description — the design
 * tucks the controls belonging to a choice (a target weight, a curve) into the
 * card itself rather than beside it. They sit outside the `<label>`, though:
 * inside it, every stepper button and figure of the card was read out as the
 * name of the radio, and a label may hold one control only.
 *
 * Why a choice is unavailable is written in the card, not in a tooltip: a
 * tooltip opens on a mouse hover, and on a tablet the card was greyed out
 * with nothing to say why.
 */
export const RadioItem = <T extends string>({
  children,
  description,
  disabledReason,
  hasDescriptionOnDemand = false,
  isDisabled,
  label,
  value,
}: RadioGroupItemProps<T>) => {
  const { t } = useTranslation();
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : null;
  const reasonId = isDisabled && disabledReason ? `${id}-reason` : null;

  return (
    <div
      className={cn(
        'flex flex-col gap-3.5 rounded-md border border-border bg-card px-4 py-3.5 transition-colors',
        'has-[[data-state=checked]]:border-ptl-rule-strong has-[[data-state=checked]]:shadow-[inset_0_0_0_1px_var(--ptl-rule-strong)]',
        !isDisabled && 'hover:bg-accent/60',
      )}
    >
      <div className="flex items-start gap-2">
        <label
          className={cn(
            'flex flex-1 cursor-pointer items-start gap-3 select-none',
            isDisabled && 'cursor-not-allowed',
          )}
        >
          {/*
           * Selection is reported by the group's `onValueChange`, which the
           * keyboard raises too; an `onClick` here would report a mouse click
           * twice and leave the arrow keys reporting nothing.
           */}
          <RadioGroupItem
            value={value}
            className="mt-0.5"
            disabled={!!isDisabled}
            aria-labelledby={titleId}
            aria-describedby={
              [descriptionId, reasonId].filter(Boolean).join(' ') || undefined
            }
          />
          <span
            className={cn(
              'flex flex-col gap-[3px]',
              isDisabled && 'opacity-70',
            )}
          >
            <span id={titleId} className="text-[14.5px] font-semibold">
              {label}
            </span>
            {description ? (
              <span
                id={descriptionId ?? undefined}
                className={cn(
                  'text-[13px] leading-[1.5] text-muted-foreground',
                  // Still read out with the radio, only no longer shown.
                  hasDescriptionOnDemand && 'sr-only',
                )}
              >
                {description}
              </span>
            ) : null}
          </span>
        </label>
        {/*
         * Beside the label rather than in it: inside, a tap on the "?" would
         * also pick the choice.
         */}
        {description && hasDescriptionOnDemand ? (
          <Popover>
            <PopoverTrigger
              aria-label={t('About “{{label}}”', { label })}
              className="-mt-1 -mr-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ptl-ink-3 transition-colors hover:bg-accent hover:text-foreground"
            >
              <CircleHelp aria-hidden="true" className="size-4" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="text-[13px] leading-[1.5] text-muted-foreground"
            >
              {description}
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
      {reasonId ? (
        <p
          id={reasonId}
          className="m-0 flex items-start gap-2 pl-7 text-[12.5px] leading-[1.5] text-muted-foreground"
        >
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {disabledReason}
        </p>
      ) : null}
      {children ? <div className="pl-7">{children}</div> : null}
    </div>
  );
};
