import type { NumericUserInput } from '@/lib/touch-design/measure-requirements';
import Joi from 'joi';
import { useCallback, useState } from 'react';

export const useValidatedNumericInputField = (
  inputValue: NumericUserInput,
  onUpdate: (value: NumericUserInput) => void,
  validator: Joi.Schema = Joi.number().optional()
) => {
  const [error, setError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string>(
    inputValue?.toString() ?? ''
  );

  const getSanitizedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    return e.target.value.replaceAll(',', '.').replace(/[\s]/g, '');
  };

  const parseNumericValue = (value: string): NumericUserInput => {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? null : numValue;
  };

  const checkIsInputValid = useCallback(
    (currentValue: string): boolean => {
      const { error } = validator.allow('', '-').validate(currentValue);
      const hasError = !!error?.message;
      setError(error?.message ?? null);
      return !hasError;
    },
    [validator]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = getSanitizedValue(e);
      setCurrentValue(value);
      if (checkIsInputValid(value)) {
        onUpdate(parseNumericValue(value));
      }
    },
    [checkIsInputValid, onUpdate]
  );

  return { error, inputValue: currentValue, onInputChange };
};
