import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { KeyMeasurement } from './KeyMeasurement';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useMemo } from 'react';

export const KeyMeasureList = () => {
  const { keyboard } = useKeyboard();
  const { useManualSWRMeasurements } = useMeasureOptions();

  const keyNumbers = useMemo(() => keyboard.getKeyNumbers(), [keyboard]);

  const className = useMemo(() => {
    return useManualSWRMeasurements
      ? 'columns-1 xl:columns-2 2xl:columns-3 3xl:columns-4 gap-6'
      : 'columns-1 lg:columns-2 xl:columns-3 3xl:columns-4 gap-6';
  }, [useManualSWRMeasurements]);

  return (
    <div>
      <div className={className}>
        {keyNumbers.map((keyNumber) => (
          <div key={keyNumber} className="mb-1 break-inside-avoid">
            <KeyMeasurement keyNumber={keyNumber} />
          </div>
        ))}
      </div>
    </div>
  );
};
