import { MessageCircleWarning, TriangleAlert } from 'lucide-react';
import { memo, useCallback } from 'react';

import {
  useMeasuredKeyFromStore,
  useMeasureActions,
} from '@/hooks/store/use-measure-store';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { formatRatio, formatWeightValue } from '@/lib/format/format-weight';
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
import { useAnalyzedKey } from '@/hooks/keyboard/use-analyzed-key';
import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { frictionZoneAt } from '@/components/charts/touch-weight-chart/hooks/use-friction-zones-series';
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

const FRICTION_ZONE_DOTS = {
  high: 'bg-ptl-current',
  low: 'bg-ptl-brass',
  medium: 'bg-ptl-ink-3',
} as const;

const FRICTION_ZONE_LABELS = {
  high: 'High',
  low: 'Low',
  medium: 'Medium',
} as const;

/*
 * Below 1280px the table scrolls sideways in its frame, and once it has, the
 * front weight of which key? The number and the note stay put, on the row's
 * own background so the fields slide under them.
 */
const keyCellClassName = 'max-xl:sticky max-xl:z-[1] max-xl:bg-[inherit]';
const computedCellClassName = cn(
  cellClassName,
  'text-right font-mono text-sm text-muted-foreground',
);

/**
 * One key of the measure table: the fields to fill, then what they give.
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
  const { keyboard } = useKeyboard();

  const {
    allowedDifference,
    computedStrikeWeightRatio,
    isKeyMeasurementInconsistent,
  } = useKeyMeasurementInconsistency(keyNumber);
  // Read here rather than taken as a prop: the row then depends on its own
  // key alone, and the table does not rebuild the keyboard to fill them in.
  const { analyzedKey } = useAnalyzedKey(keyNumber);

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

  const frictionWeight = analyzedKey?.frictionWeight ?? null;
  const isFrictionNegative = frictionWeight !== null && frictionWeight < 0;
  // The zone the static balance figure puts the key in, as the mockup marks
  // it beside the value: a dot by colour, and its name for whoever cannot
  // tell the colours apart.
  const frictionZone = frictionZoneAt(frictionWeight, keyNumber, keyboard.size);

  if (!keySpec) {
    return null;
  }

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
          />
        </td>
      ))}
      <td className={computedCellClassName}>
        {formatWeightValue(analyzedKey?.balanceWeight ?? null, currentLanguage)}
      </td>
      <td className={computedCellClassName}>
        {/*
         * A key cannot come up under more weight than it goes down under: a
         * negative friction is two readings typed the wrong way round, and
         * it throws the balance weight out with it. Said in the cell rather
         * than in a tooltip, which no touch screen opens.
         */}
        {isFrictionNegative ? (
          <span
            title={t('Up weight above down weight: probably swapped')}
            className="inline-flex items-center gap-1.5 font-semibold text-destructive"
          >
            <TriangleAlert aria-hidden="true" className="size-3.5" />
            {formatWeightValue(frictionWeight, currentLanguage)}
            <span className="sr-only">
              {t('Up weight above down weight: probably swapped')}
            </span>
          </span>
        ) : frictionZone ? (
          <span
            title={t(FRICTION_ZONE_LABELS[frictionZone])}
            className="inline-flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className={cn(
                'size-1.5 rounded-full',
                FRICTION_ZONE_DOTS[frictionZone],
              )}
            />
            {formatWeightValue(frictionWeight, currentLanguage)}
            <span className="sr-only">
              {t(FRICTION_ZONE_LABELS[frictionZone])}
            </span>
          </span>
        ) : (
          formatWeightValue(frictionWeight, currentLanguage)
        )}
      </td>
    </tr>
  );
});
