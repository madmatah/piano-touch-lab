import { KeyMeasurement } from './KeyMeasurement';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMemo } from 'react';

export const KeyMeasureList = () => {
  const { keyboard } = useKeyboard();

  const keyNumbers = useMemo(() => keyboard.getKeyNumbers(), [keyboard]);

  return (
    <div>
      <div className="columns-1 lg:columns-2 xl:columns-3 3xl:columns-4 gap-6">
        {keyNumbers.map((keyNumber) => (
          <div key={keyNumber} className="mb-1 break-inside-avoid">
            <KeyMeasurement keyNumber={keyNumber} />
          </div>
        ))}
      </div>
    </div>
  );
};
