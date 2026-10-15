import { memo, useCallback, useMemo, useRef } from 'react';

import { useKeyboard } from '@/hooks/keyboard/use-keyboard';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { useStickyHeight } from '@/hooks/use-sticky-height';
import { useTranslation } from '@/hooks/use-translation';
import { KeyColor } from '@/lib/piano/keyboard';
import { cn } from '@/lib/utils';

import { KeyMeasurement } from './KeyMeasurement';
import {
  useMeasurePasses,
  type MeasurePassId,
} from './hooks/use-measure-passes';
import { nextMeasureField } from './measure-tab-order';

export interface KeyMeasureListProps {
  currentKeyNumber: number | null;
  currentPassId: MeasurePassId;
  onFocusKey: (keyNumber: number | null) => void;
}

const keyClassName =
  'inline-flex h-5 items-center rounded-[3px] border border-ptl-rule-strong px-1.5 font-mono text-[11px] text-foreground';

/** The field an event comes from: which key, which quantity. */
const fieldOf = (target: EventTarget) => {
  if (!(target instanceof HTMLInputElement) || !target.name) {
    return null;
  }
  const keyNumber = Number(
    target.closest<HTMLElement>('[data-key-number]')?.dataset.keyNumber,
  );
  return Number.isInteger(keyNumber)
    ? { keyNumber, property: target.name }
    : null;
};

/*
 * The head's rules are drawn inside its cells: a table's collapsed borders stay
 * where the table lays them, and would let the rows show through a line once
 * the head sticks.
 */
const groupClassName =
  'h-[30px] bg-card px-3 shadow-[inset_0_-1px_0_var(--border)] text-left align-middle font-mono text-[10.5px] font-normal tracking-[0.08em] text-ptl-ink-3 uppercase';

const headerClassName =
  'h-12 bg-card px-3 text-left align-middle text-[13px] font-semibold shadow-[inset_0_-1px_0_var(--ptl-rule-strong)]';

/*
 * From 1280px the table fits its page without scrolling sideways, so its frame
 * need not be a scroll box, and the head can stick under the panel: a filled
 * field shows no abbreviation, and without it the columns go unnamed as soon
 * as the page has scrolled. Narrower, the frame scrolls sideways, and a sticky
 * head could only stick to the frame.
 */
const headClassName = 'xl:sticky xl:top-[var(--ptl-sticky-top,0px)] xl:z-[1]';

/**
 * The measure table.
 *
 * Measured columns first, then the two the tool derives from them — so a
 * technician entering a down weight and an up weight watches the balance
 * weight and the friction appear on the same line.
 */
export const KeyMeasureList = memo(function KeyMeasureList({
  currentKeyNumber,
  currentPassId,
  onFocusKey,
}: KeyMeasureListProps) {
  const { t } = useTranslation();
  // The bare keyboard, which never changes while someone types: a row reads
  // its own key out of the store, so a keystroke re-renders that row alone.
  const { keyboard } = useKeyboard();
  const keys = useMemo(() => keyboard.getKeys(), [keyboard]);
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();

  const passes = useMeasurePasses();
  const header = useRef<HTMLTableSectionElement>(null);
  useStickyHeight(header, '--ptl-sticky-header');

  const activeFields = useMemo(
    () => passes.find((pass) => pass.id === currentPassId)?.fields ?? [],
    [currentPassId, passes],
  );

  /*
   * Tab goes down the keyboard pass by pass, as the technician does, rather
   * than across a row. The table walks it itself: tab indexes would have to be
   * positive to get that order out of the browser, and positive tab indexes
   * put all of the table's fields before anything else on the page — the
   * navigation, the options, the pass switch — for every Tab of the session.
   */
  const passFields = useMemo(() => passes.map((pass) => pass.fields), [passes]);
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableSectionElement>) => {
      if (
        event.key !== 'Tab' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      const field = fieldOf(event.target);
      if (!field) {
        return;
      }
      const next = nextMeasureField(
        passFields,
        keys.length,
        field,
        event.shiftKey ? -1 : 1,
      );
      const input =
        next &&
        document.querySelector<HTMLInputElement>(
          `[data-key-number="${next.keyNumber}"] input[name="${next.property}"]`,
        );
      // At either end of the table, Tab leaves it the browser's way.
      if (input) {
        event.preventDefault();
        input.focus();
      }
    },
    [keys.length, passFields],
  );

  // One listener for the whole table: a row does not need to know about the
  // panel above, and does not re-render when the focus moves.
  const onFocus = useCallback(
    (event: React.FocusEvent<HTMLTableSectionElement>) => {
      const field = fieldOf(event.target);
      if (field) {
        onFocusKey(field.keyNumber);
      }
    },
    [onFocusKey],
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
      className="overflow-hidden rounded-md border border-ptl-rule-strong bg-card xl:overflow-visible print:overflow-visible print:rounded-none print:border-0"
    >
      {/*
       * On screen a narrow window scrolls the table sideways; a sheet cannot,
       * so on paper the table gives up its minimum width and fits the page.
       */}
      <div className="overflow-x-auto xl:overflow-visible print:overflow-visible">
        <table className="w-full min-w-[720px] border-collapse print:min-w-0">
          <thead ref={header} className={headClassName}>
            {/*
             * Which columns each pass fills, the pass in hand picked out, as
             * the mockup heads the table: the order Tab walks, read at a
             * glance.
             */}
            <tr>
              <th
                colSpan={2}
                className={cn(
                  groupClassName,
                  'max-xl:sticky max-xl:left-0 max-xl:z-[2]',
                )}
              />
              {passes.map((pass) => {
                const isCurrent = pass.id === currentPassId;
                return (
                  <th
                    key={pass.id}
                    colSpan={pass.fields.length}
                    scope="colgroup"
                    className={cn(
                      groupClassName,
                      // The accent is a tint: laid over the card, so the rows
                      // do not show through a head that sticks.
                      isCurrent &&
                        'bg-[linear-gradient(var(--accent),var(--accent))] text-foreground print:bg-none print:text-ptl-ink-3',
                    )}
                  >
                    {t('Pass {{number}}', { number: pass.number })}
                    {/* The pass in hand means nothing on paper. */}
                    {isCurrent ? (
                      <span className="print:hidden">{` · ${t('Current')}`}</span>
                    ) : null}
                  </th>
                );
              })}
              <th
                colSpan={2}
                scope="colgroup"
                className={cn(groupClassName, 'text-right')}
              >
                {t('Computed')}
              </th>
            </tr>
            <tr>
              <th
                className={cn(
                  headerClassName,
                  'w-[52px] text-ptl-ink-3 max-xl:sticky max-xl:left-0 max-xl:z-[2]',
                )}
              >
                {t('No.')}
              </th>
              <th
                className={cn(
                  headerClassName,
                  'w-[72px] text-ptl-ink-3 max-xl:sticky max-xl:left-[52px] max-xl:z-[2]',
                )}
              >
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
          <tbody onFocus={onFocus} onKeyDown={onKeyDown}>
            {keys.map((key) => (
              <KeyMeasurement
                key={key.number}
                currentPassId={currentPassId}
                isBlackKey={key.color === KeyColor.Black}
                isCurrent={key.number === currentKeyNumber}
                keyName={key.name}
                keyNumber={key.number}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border px-4 py-3 text-[12.5px] text-muted-foreground print:hidden">
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <kbd className={keyClassName}>Tab</kbd>
          {[
            ...activeFields.map(
              (field) =>
                measuredColumns.find((column) => column.property === field)
                  ?.abbreviation,
            ),
            t('next key'),
          ].join(' → ')}
          <span aria-hidden="true">·</span>
          <kbd className={keyClassName}>{t('Shift')}</kbd>
          <kbd className={keyClassName}>Tab</kbd>
          {t('back')}
        </span>
        <span className="font-mono text-[11.5px] text-ptl-ink-3">
          BW = (D + U) / 2 · F = (D − U) / 2
        </span>
      </div>
    </section>
  );
});
