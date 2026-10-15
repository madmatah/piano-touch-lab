import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { Stepper } from '../stepper/Stepper';

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
  const { t } = useTranslation();
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
    return Math.max(maxValueLength * 0.7, 4);
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
    <Stepper
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      nextIcon={<ChevronRight className="size-[17px]" />}
      nextLabel={t('Next value')}
      onNext={handleGoNext}
      onPrevious={handleGoPrevious}
      previousIcon={<ChevronLeft className="size-[17px]" />}
      previousLabel={t('Previous value')}
    >
      <span
        className="flex h-10 items-center justify-center px-2 font-mono text-base font-medium"
        style={{ width: `${estimatedWidth}rem` }}
      >
        {currentLabel}
      </span>
    </Stepper>
  );
};
