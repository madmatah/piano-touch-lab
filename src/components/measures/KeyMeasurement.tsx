import { MessageCircleWarning } from 'lucide-react';
import { useCallback } from 'react';

import {
  useMeasuredKeyFromStore,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useKeyTabIndex } from '@/hooks/use-key-tab-index';
import { useTranslation } from '@/hooks/use-translation';
import { formatWeightValue } from '@/lib/format/format-weight';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { cn } from '@/lib/utils';

import { useMeasurePasses, type MeasurePassId } from './measure-passes';
import { MeasureInputField } from './MeasureInputField';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useKeyMeasurementInconsistency } from './hooks/use-key-measurement-inconsistency';

type MeasuredProperty = keyof Pick<
  MeasuredKeyRequirements,
  | 'downWeightWithSpringSupport'
  | 'downWeightWithoutSpringSupport'
  | 'frontWeight'
  | 'strikeWeight'
  | 'upWeight'
  | 'measuredStrikeWeightRatio'
>;

export interface KeyMeasurementProps {
  balanceWeight: OptionalNumber;
  currentPassId: MeasurePassId;
  frictionWeight: OptionalNumber;
  isBlackKey: boolean;
  keyName: string;
  keyNumber: number;
  onFocusKey: (keyNumber: number | null) => void;
}

const cellClassName = 'h-[42px] border-b border-border px-3 align-middle';
const computedCellClassName = cn(
  cellClassName,
  'text-right font-mono text-sm text-muted-foreground',
);

/** One key of the measure table: the fields to fill, then what they give. */
export const KeyMeasurement: React.FC<KeyMeasurementProps> = ({
  balanceWeight,
  currentPassId,
  frictionWeight,
  isBlackKey,
  keyName,
  keyNumber,
  onFocusKey,
}) => {
  const keyIndex = keyNumber - 1;
  const keySpec = useMeasuredKeyFromStore(keyIndex);
  const { updateKeyMeasure } = useMeasureActions();
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();
  const { currentLanguage, t } = useTranslation();

  const {
    allowedDifference,
    computedStrikeWeightRatio,
    isKeyMeasurementInconsistent,
  } = useKeyMeasurementInconsistency(keyNumber);

  const onUpdateKeyProperty = useCallback(
    (keyProperty: keyof MeasuredKeyRequirements) => (value: OptionalNumber) => {
      updateKeyMeasure(keyIndex, keyProperty, value);
    },
    [keyIndex, updateKeyMeasure],
  );

  const onFocusChange = useCallback(
    (isFocused: boolean) => {
      onFocusKey(isFocused ? keyNumber : null);
    },
    [keyNumber, onFocusKey],
  );

  const columns: { label: string; property: MeasuredProperty }[] = [
    ...(useSupportSpringMeasurements
      ? [
          {
            label: 'DS',
            property: 'downWeightWithSpringSupport' as const,
          },
        ]
      : []),
    { label: 'D', property: 'downWeightWithoutSpringSupport' },
    { label: 'U', property: 'upWeight' },
    { label: 'FW', property: 'frontWeight' },
    { label: 'SW', property: 'strikeWeight' },
    ...(useManualSWRMeasurements
      ? [{ label: 'SWR', property: 'measuredStrikeWeightRatio' as const }]
      : []),
  ];

  const tabGroups: MeasuredProperty[][] = [
    useSupportSpringMeasurements ? ['downWeightWithSpringSupport'] : [],
    ['downWeightWithoutSpringSupport', 'upWeight'],
    ['frontWeight'],
    ['strikeWeight'],
    useManualSWRMeasurements ? ['measuredStrikeWeightRatio'] : [],
  ].filter((group): group is MeasuredProperty[] => group.length > 0);

  const passes = useMeasurePasses();

  const { getTabIndexFor } = useKeyTabIndex<MeasuredProperty>(
    keyIndex,
    tabGroups,
  );

  const activeFields =
    passes.find((pass) => pass.id === currentPassId)?.fields ?? [];

  if (!keySpec) {
    return null;
  }

  return (
    <tr id={`measure-key-${keyNumber}`} className="even:bg-secondary">
      <td className={cn(cellClassName, 'font-mono text-xs text-ptl-ink-3')}>
        <span className="inline-flex items-center gap-1.5">
          {keyNumber}
          {isKeyMeasurementInconsistent && (
            <Tooltip>
              <TooltipTrigger>
                <MessageCircleWarning className="size-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent side="right" variant="destructive">
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
          )}
        </span>
      </td>
      <td className={cn(cellClassName, 'font-mono text-[13px]')}>
        {isBlackKey ? (
          <span className="inline-flex rounded-[3px] bg-ptl-key-black px-1.5 py-px text-[12.5px] text-ptl-key-white">
            {keyName}
          </span>
        ) : (
          keyName
        )}
      </td>
      {columns.map((column) => (
        <td
          key={column.property}
          className={cn(
            cellClassName,
            !activeFields.includes(column.property) && 'opacity-60',
          )}
        >
          <MeasureInputField
            aria-label={t('{{measure}}, key {{number}}', {
              measure: column.label,
              number: keyNumber,
            })}
            defaultValue={keySpec[column.property]}
            onFocusChange={onFocusChange}
            onUpdate={onUpdateKeyProperty(column.property)}
            placeholder={column.label}
            tabIndex={getTabIndexFor(column.property)}
          />
        </td>
      ))}
      <td className={computedCellClassName}>
        {formatWeightValue(balanceWeight, currentLanguage)}
      </td>
      <td className={computedCellClassName}>
        {formatWeightValue(frictionWeight, currentLanguage)}
      </td>
    </tr>
  );
};
