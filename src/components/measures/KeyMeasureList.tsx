import { keyboardLength } from '@/lib/constants';
import { KeyMeasurement } from './KeyMeasurement';

export const KeyMeasureList = () => {
  const keyNumbers = Array.from({ length: keyboardLength }, (_, i) => i + 1);

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
