import { Check } from 'lucide-react';

import { formatWeightValue } from '@/lib/format/format-weight';
import { useTranslation } from '@/hooks/use-translation';

import { demoDesigned, demoKeyNames, demoMeasured } from './demo-sample';

/** As many rows as the panel shows before the sheet fades out. */
const ROWS = 5;
/** The rows already ticked off at the bench. */
const DONE = 2;

const ROW_COLUMNS = 'grid-cols-[14px_34px_minmax(0,1fr)_minmax(0,1fr)]';

/**
 * The first rows of the demonstration piano's own adjustment sheet: what each
 * key reads now and what it should read once it is weighed off.
 *
 * A picture of a sheet rather than a table to read — the figures are the
 * demonstration piano's, and the page it is torn from carries eighty-eight of
 * them.
 */
export const AdjustmentSheetPreview = () => {
  const { currentLanguage, t } = useTranslation();
  const weight = (value: number | null) =>
    formatWeightValue(value, currentLanguage);
  const change = (from: number | null, to: number | null) =>
    `${weight(from)} → ${weight(to)}`;

  return (
    <div
      role="img"
      aria-label={t(
        'An extract of an adjustment sheet: front weight and spring tension, key by key, with a box to tick off each one.',
      )}
      className="min-h-0 flex-1 overflow-hidden rounded-[3px] border border-border bg-card px-2.5 pt-2 [-webkit-mask-image:linear-gradient(#000_62%,transparent)] [mask-image:linear-gradient(#000_62%,transparent)]"
    >
      <div
        className={`grid ${ROW_COLUMNS} h-5 items-center gap-2 font-mono text-[9.5px] tracking-[0.06em] text-ptl-ink-3 uppercase`}
      >
        <span />
        <span>{t('Note')}</span>
        <span>{t('Front weight')}</span>
        <span>{t('Spring')}</span>
      </div>
      {Array.from({ length: ROWS }, (_, index) => {
        const isDone = index < DONE;
        return (
          <div
            key={demoKeyNames[index]}
            className={`grid ${ROW_COLUMNS} h-[26px] items-center gap-2 border-t border-border font-mono text-[11px] ${
              isDone ? 'text-ptl-ink-3 line-through decoration-input' : ''
            }`}
          >
            <span
              className={
                isDone
                  ? 'flex size-[11px] items-center justify-center rounded-[2px] bg-ptl-brass text-card'
                  : 'block size-[11px] rounded-[2px] border border-input'
              }
            >
              {isDone ? <Check className="size-2" strokeWidth={3} /> : null}
            </span>
            <span>{demoKeyNames[index]}</span>
            <span className="truncate">
              {change(
                demoMeasured.frontWeight[index] ?? null,
                demoDesigned.frontWeight[index] ?? null,
              )}
            </span>
            <span className="truncate">
              {change(
                demoMeasured.springBalance[index] ?? null,
                demoDesigned.springBalance[index] ?? null,
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};
