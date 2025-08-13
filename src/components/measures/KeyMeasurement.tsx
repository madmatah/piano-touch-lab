import type {
  NumericUserInput,
  KeyMeasureRequirements,
} from '@/lib/touch-design/measure-requirements';
import { useCallback } from 'react';
import { MeasureInputField } from './MeasureInputField';
import { useKeyMeasures, useMeasureActions } from '@/hooks/use-measure-store';

export interface KeyMeasurementProps {
  keyNumber: number;
}

export const KeyMeasurement: React.FC<KeyMeasurementProps> = ({
  keyNumber,
}) => {
  const keyIndex = keyNumber - 1;
  const keySpec = useKeyMeasures(keyIndex, 'default');
  const { updateKeyMeasure } = useMeasureActions('default');

  const onUpdateKeyProperty = useCallback(
    (keyProperty: keyof KeyMeasureRequirements) =>
      (value: NumericUserInput) => {
        updateKeyMeasure(keyIndex, keyProperty, value);
      },
    [keyIndex, updateKeyMeasure]
  );

  return (
    keySpec && (
      <div className="group/key hover:bg-purple-50 p-1 px-3">
        <div className="flex gap-2 justify-start items-start">
          <div className="w-10  shrink text-sm font-medium text-gray-700 self-center">
            #{keyNumber}
          </div>
          <div className="self-center">
            <MeasureInputField
              defaultValue={keySpec.strikeWeight}
              onUpdate={onUpdateKeyProperty('strikeWeight')}
              placeholder="SW"
            />
          </div>
          <div className="">
            <MeasureInputField
              defaultValue={keySpec.upWeight}
              onUpdate={onUpdateKeyProperty('upWeight')}
              placeholder="U"
            />
          </div>
          <div className="">
            <MeasureInputField
              defaultValue={keySpec.downWeight}
              onUpdate={onUpdateKeyProperty('downWeight')}
              placeholder="D"
            />
          </div>
          <div className="flex-3 shrink">
            <MeasureInputField
              defaultValue={keySpec.frontWeight}
              onUpdate={onUpdateKeyProperty('frontWeight')}
              placeholder="FW"
            />
          </div>
        </div>
      </div>
    )
  );
};
