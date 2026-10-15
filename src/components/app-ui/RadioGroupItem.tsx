import { useId } from 'react';
import { RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export interface RadioGroupItemProps<T extends string> {
  children?: React.ReactNode;
  description?: string;
  disabledReason?: string;
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
  isDisabled,
  label,
  value,
}: RadioGroupItemProps<T>) => {
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
      <label
        className={cn(
          'flex cursor-pointer items-start gap-3 select-none',
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
          className={cn('flex flex-col gap-[3px]', isDisabled && 'opacity-70')}
        >
          <span id={titleId} className="text-[14.5px] font-semibold">
            {label}
          </span>
          {description ? (
            <span
              id={descriptionId ?? undefined}
              className="text-[13px] leading-[1.5] text-muted-foreground"
            >
              {description}
            </span>
          ) : null}
        </span>
      </label>
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
