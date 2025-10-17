import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { useCallback, useMemo } from 'react';

export interface ValueSelectorProps<T> {
  currentValue?: T;
  onChange: (value: T) => void;
  values: { value: T; label: string }[];
}

export const ValueSelector = <T,>({
  currentValue,
  onChange,
  values,
}: ValueSelectorProps<T>) => {
  const currentValueIndex = useMemo(() => {
    if (!currentValue) return 0;
    const index = values.findIndex((value) => value.value === currentValue);
    return index !== -1 ? index : 0;
  }, [currentValue, values]);

  const currentLabel = useMemo(() => {
    return values[currentValueIndex]?.label ?? '';
  }, [currentValueIndex, values]);

  const maxValueLength = useMemo(
    () => Math.max(...values.map((value) => String(value.label).length)),
    [values],
  );

  const estimatedWidth = useMemo(() => {
    return maxValueLength * 0.6;
  }, [maxValueLength]);

  const canGoNext = currentValueIndex < values.length - 1;

  const handleGoNext = useCallback(() => {
    if (!canGoNext) return;
    onChange(values[currentValueIndex + 1]!.value);
  }, [canGoNext, onChange, values, currentValueIndex]);

  const canGoPrevious = currentValueIndex > 0;

  const handleGoPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    onChange(values[currentValueIndex - 1]!.value);
  }, [canGoPrevious, onChange, values, currentValueIndex]);

  return (
    <div className="inline-flex flex-row items-center gap-3 px-5 py-3">
      <div>
        <Button
          className="hover:cursor-pointer"
          disabled={!canGoPrevious}
          onClick={handleGoPrevious}
          size="icon"
          variant="secondary"
        >
          <ChevronLeft />
        </Button>
      </div>
      <div>
        <div
          className="h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded transition-colors py-1"
          style={{ width: `${estimatedWidth}rem` }}
        >
          <span className="font-bold">{currentLabel}</span>
        </div>
      </div>
      <div>
        <Button
          className="hover:cursor-pointer"
          disabled={!canGoNext}
          onClick={handleGoNext}
          size="icon"
          variant="secondary"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
