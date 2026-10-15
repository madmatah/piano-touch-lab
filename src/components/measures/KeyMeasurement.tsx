import { MessageCircleWarning } from 'lucide-react';
import { memo, useCallback } from 'react';

import {
  useMeasuredKeyFromStore,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { formatRatio } from '@/lib/format/format-weight';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import { cn } from '@/lib/utils';

import {
  useMeasurePasses,
  type MeasurePassId,
} from './hooks/use-measure-passes';
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
  currentPassId: MeasurePassId;

  isBlackKey: boolean;
  /** The key being filled, tinted as the mockup tints it. */
  isCurrent: boolean;
  keyName: string;
  keyNumber: number;
}

const cellClassName = 'h-[42px] border-b border-border px-3 align-middle';

/*
 * Below 1280px the table scrolls sideways in its frame, and once it has, the
 * front weight of which key? The number and the note stay put, on the row's
 * own background so the fields slide under them.
 */
const keyCellClassName = 'max-xl:sticky max-xl:z-[1] max-xl:bg-[inherit]';

/**
 * One key of the measure table: the fields to fill.
 *
 * Memoised: a Tab moves the focus, and with it the key the panel above
 * follows, but nothing a row shows — eighty-eight rows of four or six fields
 * have no business re-rendering for it.
 */
export const KeyMeasurement = memo(function KeyMeasurement({
  currentPassId,
  isBlackKey,
  isCurrent,
  keyName,
  keyNumber,
}: KeyMeasurementProps) {
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

  const passes = useMeasurePasses();

  const activeFields =
    passes.find((pass) => pass.id === currentPassId)?.fields ?? [];

  if (!keySpec) {
    return null;
  }

  // A key cannot come up under more weight than it goes down under: an up
  // weight above the down weight is two readings typed the wrong way round,
  // and it would throw the balance weight and the friction out with it.
  const isUpAboveDown =
    keySpec.upWeight !== null &&
    keySpec.downWeightWithoutSpringSupport !== null &&
    keySpec.upWeight > keySpec.downWeightWithoutSpringSupport;

  return (
    <tr
      id={`measure-key-${keyNumber}`}
      data-key-number={keyNumber}
      aria-current={isCurrent ? 'true' : undefined}
      className={
        // Solid rather than translucent: the key cells take the row's
        // background to cover the fields that scroll under them.
        isCurrent
          ? 'bg-[color-mix(in_oklab,var(--ptl-current)_7%,var(--card))] dark:bg-[color-mix(in_oklab,var(--ptl-current)_10%,var(--card))]'
          : 'bg-card even:bg-secondary'
      }
    >
      <td
        className={cn(
          cellClassName,
          keyCellClassName,
          'font-mono text-xs text-ptl-ink-3 max-xl:left-0',
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {keyNumber}
          {isKeyMeasurementInconsistent && (
            <Tooltip>
              <TooltipTrigger aria-label={t('Inconsistent measurement')}>
                <MessageCircleWarning className="size-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent side="right" variant="destructive">
                <p className="whitespace-pre-line">
                  {t(
                    'The measured SWR is not consistent with the computed SWR ({{computedStrikeWeightRatio}}). The difference is greater than {{difference}}.\nYou should check your measurements to find the source of the inconsistency.\nCheck the SWR chart on analyze page for more details.',
                    {
                      computedStrikeWeightRatio: formatRatio(
                        computedStrikeWeightRatio ?? null,
                        currentLanguage,
                      ),
                      difference: formatRatio(
                        allowedDifference,
                        currentLanguage,
                      ),
                    },
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </span>
      </td>
      <td
        className={cn(
          cellClassName,
          keyCellClassName,
          'font-mono text-[13px] max-xl:left-[52px]',
        )}
      >
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
            name={column.property}
            onUpdate={onUpdateKeyProperty(column.property)}
            placeholder={column.label}
            warning={
              column.property === 'upWeight' && isUpAboveDown
                ? t('Up weight above down weight: probably swapped')
                : undefined
            }
          />
        </td>
      ))}
    </tr>
  );
});
