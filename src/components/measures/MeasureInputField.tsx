import type { OptionalNumber } from '@/lib/touch-design/measure-requirements';
import Joi from 'joi';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useValidatedNumericInputField } from '@/hooks/use-validated-numeric-input-field';
import { cn } from '@/lib/utils';

export interface MeasureInputFieldProps {
  defaultValue: OptionalNumber;
  onUpdate: (value: OptionalNumber) => void;
  validator?: Joi.Schema;
  placeholder?: string;
  tabIndex?: number;
}

export const MeasureInputField: React.FC<MeasureInputFieldProps> = ({
  defaultValue,
  placeholder,
  validator,
  onUpdate,
  tabIndex,
}) => {
  const { error, inputValue, onInputChange } = useValidatedNumericInputField(
    defaultValue,
    onUpdate,
    validator,
  );
  const [isFocused, setIsFocused] = useState(false);

  const shouldShowErrorState = !!error && isFocused;
  const shouldShowSuccessState = !error && !['', '-'].includes(inputValue);

  const inputClassName = cn(
    'w-15 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary',
    shouldShowErrorState &&
      'ring-1 ring-red-500 focus:ring-red-500 bg-red-100 text-red-900',
    shouldShowSuccessState &&
      'bg-gray-100 ring-1 ring-gray-500 focus:ring-gray-500',
  );

  return (
    <Tooltip open={!!error && isFocused}>
      <TooltipTrigger asChild>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue ?? undefined}
          onChange={onInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onInputChange(e);
          }}
          tabIndex={tabIndex}
          className={inputClassName}
        />
      </TooltipTrigger>
      {error && (
        <TooltipContent
          backgroundColor="bg-red-100"
          textColor="text-red-900"
          arrowClassName="bg-red-100 fill-red-100"
        >
          {error}
        </TooltipContent>
      )}
    </Tooltip>
  );
};
