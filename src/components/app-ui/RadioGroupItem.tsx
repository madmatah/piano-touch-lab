import { useMemo } from 'react';
import { RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
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
 * card itself rather than beside it.
 */
export const RadioItem = <T extends string>({
  children,
  description,
  disabledReason,
  isDisabled,
  label,
  value,
}: RadioGroupItemProps<T>) => {
  const shouldDisplayTooltip = useMemo(() => {
    return !!isDisabled && disabledReason;
  }, [disabledReason, isDisabled]);

  const labelClassName = useMemo(() => {
    return cn(
      'flex cursor-pointer select-none flex-col gap-3.5 rounded-md border border-border bg-card px-4 py-3.5 transition-colors',
      'hover:bg-accent/60',
      'has-[[data-state=checked]]:border-ptl-rule-strong has-[[data-state=checked]]:shadow-[inset_0_0_0_1px_var(--ptl-rule-strong)]',
      isDisabled && 'cursor-not-allowed opacity-70 hover:bg-card',
    );
  }, [isDisabled]);

  const itemContent = useMemo(
    () => (
      <>
        <div className="flex items-start gap-3">
          {/*
           * Selection is reported by the group's `onValueChange`, which the
           * keyboard raises too; an `onClick` here would report a mouse
           * click twice and leave the arrow keys reporting nothing.
           */}
          <RadioGroupItem
            value={value}
            className="mt-0.5"
            disabled={!!isDisabled}
          />
          <div className="flex flex-col gap-[3px]">
            <span className="text-[14.5px] font-semibold">{label}</span>
            {description ? (
              <span className="text-[13px] leading-[1.5] text-muted-foreground">
                {description}
              </span>
            ) : null}
          </div>
        </div>
        {children ? <div className="pl-7">{children}</div> : null}
      </>
    ),
    [children, value, isDisabled, label, description],
  );

  return shouldDisplayTooltip ? (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className={labelClassName}>{itemContent}</label>
        </TooltipTrigger>
        <TooltipContent className="font-semibold">
          <div className="inline-flex items-center gap-2">
            <span>
              <Info className="h-4 w-4" />
            </span>
            <span>{disabledReason}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ) : (
    <label className={labelClassName}>{itemContent}</label>
  );
};
