import type { OptionalNumber } from '@/lib/piano/touch-design/measured-key.requirements';
import Joi from 'joi';
import { useCallback, useState, useEffect } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { decimalSeparatorOf } from '@/lib/format/format-weight';

export const useValidatedNumericInputField = (
  inputValue: OptionalNumber,
  onUpdate: (value: OptionalNumber) => void,
  validator: Joi.Schema = Joi.number().optional(),
) => {
  const { currentLanguage, t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // A stored value is shown with the reader's decimal separator, as every
  // computed value beside it is: 7,06 next to 66,5, not 7.06.
  const asText = useCallback(
    (value: OptionalNumber) =>
      value === null
        ? ''
        : value.toString().replace('.', decimalSeparatorOf(currentLanguage)),
    [currentLanguage],
  );
  const [currentValue, setCurrentValue] = useState<string>(() =>
    asText(inputValue),
  );

  useEffect(() => {
    setCurrentValue(asText(inputValue));
  }, [asText, inputValue]);

  const getSanitizedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    return e.target.value.replaceAll(',', '.').replace(/[\s]/g, '');
  };

  const parseNumericValue = (value: string): OptionalNumber => {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? null : numValue;
  };

  // Joi writes its messages in English, about a field it calls "value": the
  // reader gets them in their own language, about the number they typed.
  const messageOf = useCallback(
    (error: Joi.ValidationError): string => {
      const detail = error.details[0];
      const limit =
        typeof detail?.context?.limit === 'number'
          ? asText(detail.context.limit)
          : '';
      switch (detail?.type) {
        case 'number.min':
          return t('At least {{limit}}', { limit });
        case 'number.max':
          return t('At most {{limit}}', { limit });
        default:
          return t('Enter a number');
      }
    },
    [asText, t],
  );

  const checkIsInputValid = useCallback(
    (currentValue: string): boolean => {
      const { error } = validator.allow('', '-').validate(currentValue);
      setError(error ? messageOf(error) : null);
      return !error;
    },
    [messageOf, validator],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // The field keeps what was typed, comma and all; only the number read
      // out of it is normalised.
      const value = getSanitizedValue(e);
      setCurrentValue(e.target.value);
      if (checkIsInputValid(value)) {
        onUpdate(parseNumericValue(value));
      }
    },
    [checkIsInputValid, onUpdate],
  );

  return { error, inputValue: currentValue, onInputChange };
};
