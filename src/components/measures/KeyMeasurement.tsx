import type {
  OptionalNumber,
  KeyMeasureRequirements,
} from '@/lib/piano/touch-design/measure-requirements';
import { useCallback } from 'react';
import { MeasureInputField } from './MeasureInputField';
import { useKeyMeasures, useMeasureActions } from '@/hooks/use-measure-store';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';

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
    (keyProperty: keyof KeyMeasureRequirements) => (value: OptionalNumber) => {
      updateKeyMeasure(keyIndex, keyProperty, value);
    },
    [keyIndex, updateKeyMeasure],
  );

  const { getTabIndexFor, orderedProperties } = useKeyTabIndex(keyIndex, [
    ['downWeight', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
  ]);

  const placeholders: { [key in keyof KeyMeasureRequirements]: string } = {
    downWeight: 'D',
    frontWeight: 'FW',
    strikeWeight: 'SW',
    upWeight: 'U',
  };

  return (
    keySpec && (
      <div className="group/key hover:bg-purple-50 p-1 px-3">
        <div className="flex gap-2 justify-start items-start">
          <div className="w-10  shrink text-sm font-medium text-gray-700 self-center">
            #{keyNumber}
          </div>
          {orderedProperties.map((property) => (
            <MeasureInputField
              key={property}
              defaultValue={keySpec[property]}
              onUpdate={onUpdateKeyProperty(property)}
              placeholder={placeholders[property]}
              tabIndex={getTabIndexFor(property)}
            />
          ))}
        </div>
      </div>
    )
  );
};
