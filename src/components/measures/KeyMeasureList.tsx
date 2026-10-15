import { useMemo } from 'react';

import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useTranslation } from '@/hooks/use-translation';
import { KeyColor } from '@/lib/piano/keyboard';
import { cn } from '@/lib/utils';

import { KeyMeasurement } from './KeyMeasurement';
import { useMeasurePasses, type MeasurePassId } from './measure-passes';

export interface KeyMeasureListProps {
  currentPassId: MeasurePassId;
  onFocusKey: (keyNumber: number | null) => void;
}

const headerClassName =
  'h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold';

/**
 * The measure table.
 *
 * Measured columns first, then the two the tool derives from them — so a
 * technician entering a down weight and an up weight watches the balance
 * weight and the friction appear on the same line.
 */
export const KeyMeasureList = ({
  currentPassId,
  onFocusKey,
}: KeyMeasureListProps) => {
  const { t } = useTranslation();
  // The bare keyboard, which never changes while someone types: a row reads
  // its own key out of the store, so a keystroke re-renders that row alone.
  const { keyboard } = useKeyboard();
  const keys = useMemo(() => keyboard.getKeys(), [keyboard]);
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();

  const passes = useMeasurePasses();

  const activeFields = useMemo(
    () => passes.find((pass) => pass.id === currentPassId)?.fields ?? [],
    [currentPassId, passes],
  );

  const measuredColumns = [
    ...(useSupportSpringMeasurements
      ? [
          {
            abbreviation: 'DS',
            name: t('D with spring'),
            property: 'downWeightWithSpringSupport' as const,
          },
        ]
      : []),
    {
      abbreviation: 'D',
      name: t('Down weight'),
      property: 'downWeightWithoutSpringSupport' as const,
    },
    { abbreviation: 'U', name: t('Up weight'), property: 'upWeight' as const },
    {
      abbreviation: 'FW',
      name: t('Front weight'),
      property: 'frontWeight' as const,
    },
    {
      abbreviation: 'SW',
      name: t('Strike weight'),
      property: 'strikeWeight' as const,
    },
    ...(useManualSWRMeasurements
      ? [
          {
            abbreviation: 'SWR',
            name: t('Ratio'),
            property: 'measuredStrikeWeightRatio' as const,
          },
        ]
      : []),
  ];

  return (
    <section
      aria-label={t('For each note')}
      className="overflow-hidden rounded-md border border-ptl-rule-strong bg-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className={cn(headerClassName, 'w-[52px] text-ptl-ink-3')}>
                {t('No.')}
              </th>
              <th className={cn(headerClassName, 'w-[72px] text-ptl-ink-3')}>
                {t('Note')}
              </th>
              {measuredColumns.map((column) => (
                <th
                  key={column.property}
                  className={cn(
                    headerClassName,
                    !activeFields.includes(column.property) && 'text-ptl-ink-3',
                  )}
                >
                  <span className="mr-2 font-mono text-[11.5px] font-medium text-ptl-brass">
                    {column.abbreviation}
                  </span>
                  {column.name}
                </th>
              ))}
              <th
                className={cn(headerClassName, 'w-[88px] text-right')}
                scope="col"
              >
                <span className="font-mono text-[11.5px] font-medium text-ptl-brass">
                  BW
                </span>
              </th>
              <th
                className={cn(headerClassName, 'w-[88px] text-right')}
                scope="col"
              >
                <span className="font-mono text-[11.5px] font-medium text-ptl-brass">
                  F
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <KeyMeasurement
                key={key.number}
                currentPassId={currentPassId}
                isBlackKey={key.color === KeyColor.Black}
                keyName={key.name}
                keyNumber={key.number}
                onFocusKey={onFocusKey}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
