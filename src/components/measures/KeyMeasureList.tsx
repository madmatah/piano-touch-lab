import { keyboardLength } from '@/lib/constants';
import { KeyMeasurement } from './KeyMeasurement';
import { partitionArray } from '@/lib/array-utils';

export const KeyMeasureList = () => {
  const keyNumbers = Array.from({ length: keyboardLength }, (_, i) => i + 1);
  const desiredColumns = 2;

  const columns = partitionArray(keyNumbers, desiredColumns);

  return (
    <div className="flex gap-15 flex-wrap self-center">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-1">
          {column.map((keyNumber) => (
            <div key={keyNumber} className="flex">
              <KeyMeasurement keyNumber={keyNumber} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
