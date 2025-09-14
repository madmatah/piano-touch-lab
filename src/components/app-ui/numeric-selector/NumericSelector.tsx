import { Minus, Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { useCallback, useState, useRef, useEffect } from 'react';

export interface NumericSelectorProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
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

export const NumericSelector = ({
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
}: NumericSelectorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

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
      const numValue = parseFloat(inputVal);

      if (isNaN(numValue)) {
        setInputValue(value.toString());
        return;
      }

      const roundedValue = roundToStepPrecision(numValue, step);

      if (
        roundedValue < (minValue ?? -Infinity) ||
        roundedValue > (maxValue ?? Infinity)
      ) {
        setInputValue(value.toString());
        return;
      }

      if (roundedValue !== value) {
        onChange(roundedValue);
      }

      setInputValue(roundedValue.toString());
    },
    [value, step, minValue, maxValue, onChange],
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
        setInputValue(value.toString());
        setIsEditing(false);
      }
    },
    [inputValue, value, validateAndApplyValue],
  );

  const handleInputBlur = useCallback(() => {
    validateAndApplyValue(inputValue);
    setIsEditing(false);
  }, [inputValue, validateAndApplyValue]);

  return (
    <div className="inline-flex flex-row items-center gap-3 px-5 py-3">
      <div>
        <Button
          className="hover:cursor-pointer"
          disabled={!canDecrement}
          onClick={handleDecrement}
          size="icon"
          variant="outline"
        >
          <Minus />
        </Button>
      </div>
      <div>
        {isEditing ? (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="h-8 w-auto text-center font-bold border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            min={minValue}
            max={maxValue}
            step={step}
            size={inputValue.length || 1}
          />
        ) : (
          <div
            className="h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded transition-colors px-5 py-1"
            onClick={handleValueClick}
          >
            <strong className="font-bold">{value}</strong>
          </div>
        )}
      </div>
      <div>
        <Button
          className="hover:cursor-pointer"
          disabled={!canIncrement}
          onClick={handleIncrement}
          size="icon"
          variant="outline"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};
