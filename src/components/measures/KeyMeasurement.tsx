import type {
  OptionalNumber,
  MeasuredKeyRequirements,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import { MeasureInputField } from './MeasureInputField';
import {
  useMeasuredKey,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';
import {
  ArrowDownFromLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  Hammer,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';

export interface KeyMeasurementProps {
  keyNumber: number;
}

export const KeyMeasurement: React.FC<KeyMeasurementProps> = ({
  keyNumber,
}) => {
  const keyIndex = keyNumber - 1;
  const keySpec = useMeasuredKey(keyIndex, 'default');
  const { updateKeyMeasure } = useMeasureActions('default');
  const { useManualSWRMeasurements } = useMeasureOptions();
  const { t } = useTranslation();

  const onUpdateKeyProperty = useCallback(
    (keyProperty: keyof MeasuredKeyRequirements) => (value: OptionalNumber) => {
      updateKeyMeasure(keyIndex, keyProperty, value);
    },
    [keyIndex, updateKeyMeasure],
  );

  type MeasuredProperties = keyof Pick<
    MeasuredKeyRequirements,
    | 'downWeight'
    | 'frontWeight'
    | 'strikeWeight'
    | 'upWeight'
    | 'measuredStrikeWeightRatio'
  >;

  const baseTabGroups: Array<Array<MeasuredProperties>> = [
    ['downWeight', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
  ];

  const tabGroups: Array<Array<MeasuredProperties>> = useManualSWRMeasurements
    ? [...baseTabGroups, ['measuredStrikeWeightRatio']]
    : baseTabGroups;

  const { getTabIndexFor, orderedProperties } =
    useKeyTabIndex<MeasuredProperties>(keyIndex, tabGroups);

  const measureSpecs: {
    [key in MeasuredProperties]: {
      placeholder: string;
      tooltip: string | React.ReactNode;
    };
  } = {
    downWeight: {
      placeholder: 'D',
      tooltip: (
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="w-3 h-3 stroke-3" />
          {t('Down Weight (g)')}
        </div>
      ),
    },
    frontWeight: {
      placeholder: 'FW',
      tooltip: (
        <div className="flex items-center gap-2">
          <ArrowDownFromLine className="w-3 h-3 stroke-3" />
          {t('Front Weight (g)')}
        </div>
      ),
    },
    measuredStrikeWeightRatio: {
      placeholder: 'SWR',
      tooltip: (
        <div className="flex items-center gap-2">
          <Hammer className="w-3 h-3 stroke-3" />
          {t('Strike Weight Ratio')}
        </div>
      ),
    },
    strikeWeight: {
      placeholder: 'SW',
      tooltip: (
        <div className="flex items-center gap-2">
          <Hammer className="w-3 h-3 stroke-3" />
          {t('Strike Weight (g)')}
        </div>
      ),
    },
    upWeight: {
      placeholder: 'U',
      tooltip: (
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="w-3 h-3 stroke-3" />
          {t('Up Weight (g)')}
        </div>
      ),
    },
  };

  return (
    keySpec && (
      <div className="group/key hover:bg-purple-50 p-1 px-3">
        <div className="flex gap-2 justify-start items-start">
          <div className="w-10  shrink text-sm font-medium text-gray-700 self-center">
            #{keyNumber}
          </div>
          {orderedProperties
            .filter((property) => {
              if (property === 'measuredStrikeWeightRatio') {
                return useManualSWRMeasurements;
              }
              return true;
            })
            .map((property) => (
              <MeasureInputField
                key={property}
                defaultValue={keySpec[property]}
                onUpdate={onUpdateKeyProperty(property)}
                placeholder={measureSpecs[property].placeholder}
                tooltip={measureSpecs[property].tooltip}
                tabIndex={getTabIndexFor(property)}
              />
            ))}
        </div>
      </div>
    )
  );
};
