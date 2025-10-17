import type {
  OptionalNumber,
  MeasuredKeyRequirements,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { useCallback } from 'react';
import { MeasureInputField } from './MeasureInputField';
import {
  useMeasuredKeyFromStore,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';
import {
  ArrowDownFromLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  Hammer,
  MessageCircleWarning,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useKeyMeasurementInconsistency } from './hooks/use-key-measurement-inconsistency';

export interface KeyMeasurementProps {
  keyNumber: number;
}

export const KeyMeasurement: React.FC<KeyMeasurementProps> = ({
  keyNumber,
}) => {
  const keyIndex = keyNumber - 1;
  const keySpec = useMeasuredKeyFromStore(keyIndex, 'default');
  const { updateKeyMeasure } = useMeasureActions('default');
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();
  const { t } = useTranslation();

  const {
    isKeyMeasurementInconsistent,
    allowedDifference,
    computedStrikeWeightRatio,
  } = useKeyMeasurementInconsistency(keyNumber);

  const onUpdateKeyProperty = useCallback(
    (keyProperty: keyof MeasuredKeyRequirements) => (value: OptionalNumber) => {
      updateKeyMeasure(keyIndex, keyProperty, value);
    },
    [keyIndex, updateKeyMeasure],
  );

  type MeasuredProperties = keyof Pick<
    MeasuredKeyRequirements,
    | 'downWeightWithSpringSupport'
    | 'downWeightWithoutSpringSupport'
    | 'frontWeight'
    | 'strikeWeight'
    | 'upWeight'
    | 'measuredStrikeWeightRatio'
  >;

  const tabGroups: MeasuredProperties[][] = [
    useSupportSpringMeasurements ? ['downWeightWithSpringSupport'] : [],
    ['downWeightWithoutSpringSupport', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
    useManualSWRMeasurements ? ['measuredStrikeWeightRatio'] : [],
  ].filter((group): group is MeasuredProperties[] => group.length > 0);

  const { getTabIndexFor, orderedProperties } =
    useKeyTabIndex<MeasuredProperties>(keyIndex, tabGroups);

  const measureSpecs: Record<
    MeasuredProperties,
    {
      placeholder: string;
      tooltip: string | React.ReactNode;
    }
  > = {
    downWeightWithSpringSupport: {
      placeholder: 'DWSS',
      tooltip: (
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="w-3 h-3 stroke-3" />
          {t('Down Weight (g) with wippen support spring attached')}
        </div>
      ),
    },
    downWeightWithoutSpringSupport: {
      placeholder: 'D',
      tooltip: (
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="w-3 h-3 stroke-3" />
          {t('Down Weight (g) without wippen support spring')}
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
      <div className={'group/key hover:bg-purple-50 p-1 px-3'}>
        <div className="flex gap-2 justify-start items-start">
          <div
            className={cn(
              'w-11 shrink text-sm font-medium text-gray-700 self-center',
              isKeyMeasurementInconsistent && 'text-red-500',
            )}
          >
            <span>#{keyNumber}</span>
            {isKeyMeasurementInconsistent && (
              <span className="inline-block pl-1.5">
                <Tooltip>
                  <TooltipTrigger>
                    <MessageCircleWarning className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    arrowClassName="bg-red-100 fill-red-100"
                    backgroundColor="bg-red-100"
                    textColor="text-red-900"
                  >
                    <p className="whitespace-pre-line">
                      {t(
                        'The measured SWR is not consistent with the computed SWR ({{computedStrikeWeightRatio}}). The difference is greater than {{difference}}.\nYou should check your measurements to find the source of the inconsistency.\nCheck the SWR chart on analyze page for more details.',
                        {
                          computedStrikeWeightRatio:
                            computedStrikeWeightRatio?.toFixed(2) ?? '',
                          difference: allowedDifference,
                        },
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </span>
            )}
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
