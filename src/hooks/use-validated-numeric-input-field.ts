import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import Joi from 'joi';
import { useCallback, useState, useEffect } from 'react';

export const useValidatedNumericInputField = (
  inputValue: OptionalNumber,
  onUpdate: (value: OptionalNumber) => void,
  validator: Joi.Schema = Joi.number().optional(),
) => {
  const [error, setError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string>(
    inputValue?.toString() ?? '',
  );

  useEffect(() => {
    setCurrentValue(inputValue?.toString() ?? '');
  }, [inputValue]);

  const getSanitizedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    return e.target.value.replaceAll(',', '.').replace(/[\s]/g, '');
  };

  const parseNumericValue = (value: string): OptionalNumber => {
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
    [validator],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = getSanitizedValue(e);
      setCurrentValue(value);
      if (checkIsInputValid(value)) {
        onUpdate(parseNumericValue(value));
      }
    },
    [checkIsInputValid, onUpdate],
  );

  return { error, inputValue: currentValue, onInputChange };
};
