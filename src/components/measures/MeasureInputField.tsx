import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import Joi from 'joi';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useValidatedNumericInputField } from '@/hooks/use-validated-numeric-input-field';
import { cn } from '@/lib/utils';

export interface MeasureInputFieldProps {
  'aria-label'?: string;
  className?: string;
  defaultValue: OptionalNumber;
  onFocusChange?: (isFocused: boolean) => void;
  onUpdate: (value: OptionalNumber) => void;
  placeholder?: string;
  tabIndex?: number;
  tooltip?: string | React.ReactNode;
  validator?: Joi.Schema;
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
  onFocusChange,
  onUpdate,
  placeholder,
  tabIndex,
  tooltip: tooltipContent,
  validator,
}) => {
  const { error, inputValue, onInputChange } = useValidatedNumericInputField(
    defaultValue,
    onUpdate,
    validator,
  );
  const [isFocused, setIsFocused] = useState(false);

  const shouldShowErrorState = !!error && isFocused;
  const shouldShowFilledState = !error && !['', '-'].includes(inputValue);

  const inputClassName = cn(
    'h-8 w-16 rounded-md border border-input bg-card px-2 text-center font-mono text-sm text-foreground outline-none transition-colors',
    'placeholder:text-ptl-ink-3',
    'focus-visible:border-ptl-current focus-visible:ring-2 focus-visible:ring-ptl-current/40',
    shouldShowFilledState && 'border-ptl-rule-strong',
    shouldShowErrorState &&
      'border-destructive bg-destructive/10 text-destructive',
    className,
  );

  return (
    <Tooltip open={isFocused && (!!error || !!tooltipContent)}>
      <TooltipTrigger asChild>
        <input
          type="text"
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={inputValue ?? undefined}
          onChange={onInputChange}
          onFocus={() => {
            setIsFocused(true);
            onFocusChange?.(true);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onFocusChange?.(false);
            onInputChange(e);
          }}
          tabIndex={tabIndex}
          className={inputClassName}
        />
      </TooltipTrigger>
      {error && <TooltipContent variant="destructive">{error}</TooltipContent>}
      {isFocused && !error && !!tooltipContent && (
        <TooltipContent>{tooltipContent}</TooltipContent>
      )}
    </Tooltip>
  );
};
