import { Minus, Plus } from 'lucide-react';
import { useCallback, useState, useRef, useEffect, useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { decimalSeparatorOf } from '@/lib/format/format-weight';
import { Stepper } from '../stepper/Stepper';

export interface NumericSelectorProps {
  value: number;
  onChange: (value: number) => void;
  labelFormatter?: (value: number) => string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  maxCharacters?: number;
}

const getDecimalPlaces = (step: number): number => {
  const stepStr = step.toString();
  const decimalIndex = stepStr.indexOf('.');
  return decimalIndex === -1 ? 0 : stepStr.length - decimalIndex - 1;
};

const roundToStepPrecision = (value: number, step: number): number => {
  const decimalPlaces = getDecimalPlaces(step);
  return (
    Math.round(value * Math.pow(10, decimalPlaces)) /
    Math.pow(10, decimalPlaces)
  );
};

/**
 * What the reader typed, as a number — or NaN unless all of it is one.
 *
 * A French reader types a comma, since that is what the label shows them;
 * `parseFloat` would stop at it and quietly keep the whole part, 9,7 becoming
 * 9. And a value with anything after it is refused rather than cut short.
 */
const parseTypedNumber = (typed: string): number => {
  const normalised = typed.replaceAll(',', '.').replace(/\s/g, '');
  return normalised === '' ? NaN : Number(normalised);
};

const calculateMaxCharacters = (maxValue: number, step: number): number => {
  const decimalPlaces = getDecimalPlaces(step);
  const maxValueStr = maxValue.toFixed(decimalPlaces);
  return maxValueStr.length;
};

export const NumericSelector = ({
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  labelFormatter,
  maxCharacters,
}: NumericSelectorProps) => {
  const { currentLanguage, t } = useTranslation();
  const decimalSeparator = useMemo(
    () => decimalSeparatorOf(currentLanguage),
    [currentLanguage],
  );
  const asTyped = useCallback(
    (number: number) => number.toString().replace('.', decimalSeparator),
    [decimalSeparator],
  );
  const valueString = useMemo(
    () => (value === undefined ? '' : asTyped(value)),
    [asTyped, value],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(valueString);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveMaxCharacters = useMemo(() => {
    if (maxCharacters !== undefined) return maxCharacters;
    if (maxValue !== undefined) return calculateMaxCharacters(maxValue, step);
    return undefined;
  }, [maxCharacters, maxValue, step]);

  const formatLabel = useCallback(
    (value: number) => {
      return labelFormatter ? labelFormatter(value) : (value?.toString() ?? '');
    },
    [labelFormatter],
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(valueString);
  }, [valueString]);

  const canIncrement = value + step <= (maxValue ?? Infinity);

  const handleIncrement = useCallback(() => {
    if (!canIncrement) return;
    onChange(roundToStepPrecision(value + step, step));
  }, [canIncrement, onChange, value, step]);

  const canDecrement = value - step >= (minValue ?? -Infinity);
  const handleDecrement = useCallback(() => {
    if (!canDecrement) return;
    onChange(roundToStepPrecision(value - step, step));
  }, [canDecrement, onChange, value, step]);

  const handleValueClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const validateAndApplyValue = useCallback(
    (inputVal: string) => {
      const numValue = parseTypedNumber(inputVal);

      if (isNaN(numValue)) {
        setInputValue(valueString);
        return;
      }

      const roundedValue = roundToStepPrecision(numValue, step);

      if (
        roundedValue < (minValue ?? -Infinity) ||
        roundedValue > (maxValue ?? Infinity)
      ) {
        setInputValue(valueString);
        return;
      }

      if (roundedValue !== value) {
        onChange(roundedValue);
      }

      setInputValue(asTyped(roundedValue));
    },
    [asTyped, valueString, value, step, minValue, maxValue, onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        validateAndApplyValue(inputValue);
        setIsEditing(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setInputValue(valueString);
        setIsEditing(false);
      }
    },
    [inputValue, valueString, validateAndApplyValue],
  );

  const handleInputBlur = useCallback(() => {
    validateAndApplyValue(inputValue);
    setIsEditing(false);
  }, [inputValue, validateAndApplyValue]);

  const valueWidth = effectiveMaxCharacters
    ? `calc(${effectiveMaxCharacters}ch + 2.5rem)`
    : undefined;

  return (
    <Stepper
      canGoNext={canIncrement}
      canGoPrevious={canDecrement}
      nextIcon={<Plus className="size-[17px]" />}
      nextLabel={t('Increase')}
      onNext={handleIncrement}
      onPrevious={handleDecrement}
      previousIcon={<Minus className="size-[17px]" />}
      previousLabel={t('Decrease')}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="h-10 min-w-16 bg-transparent px-2 text-center font-mono text-base font-medium outline-none"
          min={minValue}
          max={maxValue}
          step={step}
          size={inputValue.length || 1}
          style={{ width: valueWidth }}
        />
      ) : (
        <button
          type="button"
          className="h-10 min-w-16 cursor-text px-2 font-mono text-base font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
          onClick={handleValueClick}
          style={{ width: valueWidth }}
        >
          {formatLabel(value)}
        </button>
      )}
    </Stepper>
  );
};
