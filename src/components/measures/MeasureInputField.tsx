import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import Joi from 'joi';
import { TriangleAlert } from 'lucide-react';
import { useId, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useValidatedNumericInputField } from '@/hooks/use-validated-numeric-input-field';
import { cn } from '@/lib/utils';

export interface MeasureInputFieldProps {
  'aria-label'?: string;
  className?: string;
  defaultValue: OptionalNumber;
  /** The quantity the field holds: the table finds the next field by it. */
  name?: string;
  onUpdate: (value: OptionalNumber) => void;
  placeholder?: string;
  validator?: Joi.Schema;
  /**
   * A reading that is a number but cannot be right, such as an up weight
   * above the down weight. The value is kept; the field is ringed in red and
   * says why: at once to a screen reader, and in a tooltip on focus — which
   * a tap gives, where a hover does not exist.
   */
  warning?: string;
}

/**
 * One measured value.
 *
 * A field that has been answered is marked by a full-strength rule rather than
 * a fill: the table is read as a whole, and an answered field should settle
 * back rather than stand out.
 */
export const MeasureInputField: React.FC<MeasureInputFieldProps> = ({
  'aria-label': ariaLabel,
  className,
  defaultValue,
  name,
  onUpdate,
  placeholder,
  validator,
  warning,
}) => {
  const warningId = useId();
  const { error, inputValue, onInputChange } = useValidatedNumericInputField(
    defaultValue,
    onUpdate,
    validator,
  );
  const [isFocused, setIsFocused] = useState(false);

  const shouldShowErrorState = !!error && isFocused;
  const shouldShowFilledState = !error && !['', '-'].includes(inputValue);
  const shouldShowWarningState = !error && !!warning;

  const inputClassName = cn(
    // 16px on a phone: Safari zooms the page into any field set smaller.
    'h-8 w-16 rounded-md border border-input bg-card px-2 text-center font-mono text-sm text-foreground outline-none transition-colors max-md:text-base',
    'placeholder:text-ptl-ink-3',
    'focus-visible:border-ptl-current focus-visible:ring-2 focus-visible:ring-ptl-current/40',
    shouldShowFilledState && 'border-ptl-rule-strong',
    shouldShowErrorState &&
      'border-destructive bg-destructive/10 text-destructive',
    shouldShowWarningState && 'border-destructive text-destructive',
    className,
  );

  return (
    <span className="inline-flex items-center gap-1.5">
      <Tooltip open={isFocused && (!!error || shouldShowWarningState)}>
        <TooltipTrigger asChild>
          <input
            type="text"
            // A decimal keypad on a phone, with a key that goes on to the next
            // field; text rather than number, which would refuse a comma.
            inputMode="decimal"
            enterKeyHint="next"
            aria-label={ariaLabel}
            aria-describedby={shouldShowWarningState ? warningId : undefined}
            name={name}
            placeholder={placeholder}
            value={inputValue ?? undefined}
            onChange={onInputChange}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onInputChange(e);
            }}
            className={inputClassName}
          />
        </TooltipTrigger>
        {error || shouldShowWarningState ? (
          <TooltipContent variant="destructive">
            {error ?? warning}
          </TooltipContent>
        ) : null}
      </Tooltip>
      {shouldShowWarningState ? (
        <>
          <TriangleAlert
            aria-hidden="true"
            className="size-3.5 shrink-0 text-destructive"
          />
          <span id={warningId} className="sr-only">
            {warning}
          </span>
        </>
      ) : null}
    </span>
  );
};
