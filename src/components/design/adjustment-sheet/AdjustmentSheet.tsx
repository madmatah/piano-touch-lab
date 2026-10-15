import { DesignPrintSummary } from '@/components/design/steps/DesignPrintSummary';
import { PrintHeader } from '@/components/print/PrintHeader';
import { useTranslation } from '@/hooks/use-translation';
import {
  formatSignedWeightValue,
  formatWeightValue,
} from '@/lib/format/format-weight';
import { KeyColor } from '@/lib/piano/keyboard';
import { ADJUSTMENT_THRESHOLD } from '@/lib/piano/touch-design/bench-adjustment';

import { type AdjustmentSheetProps } from './AdjustmentSheet.types';
import { AdjustmentSheetTableRow } from './AdjustmentSheetTableRow';
import { useAdjustmentRows } from './hooks/use-adjustment-rows';

const SummaryTile = ({
  detail,
  figure,
  label,
}: {
  detail: string;
  figure: string;
  label: string;
}) => (
  <div className="flex flex-[1_1_220px] flex-col gap-1.5 rounded-md border border-border bg-card px-[18px] py-4">
    <span className="text-[13px] text-muted-foreground">{label}</span>
    <span className="font-serif text-[26px] leading-[1.1] font-medium">
      {figure}
    </span>
    <span className="font-mono text-[12.5px] text-muted-foreground">
      {detail}
    </span>
  </div>
);

/**
 * The sheet that goes to the bench: for every key, what it reads now, what it
 * should read, and the weight to add or take off.
 */
export const AdjustmentSheet: React.FC<AdjustmentSheetProps> = ({
  analyzedKeyboard,
  designedKeyboard,
}) => {
  const { currentLanguage, t } = useTranslation();
  const { keyboard, summary } = useAdjustmentRows(
    analyzedKeyboard,
    designedKeyboard,
  );

  return (
    <div className="flex flex-col gap-6">
      <PrintHeader title={t('Adjustment Sheet', { ns: 'navigation' })} />
      <DesignPrintSummary />

      <div className="flex flex-wrap gap-3 print:hidden">
        <SummaryTile
          label={t('Front Weight', { ns: 'navigation' })}
          figure={t('{{count}} keys', {
            count: summary.frontWeightCount,
            ns: 'navigation',
          })}
          // A dash then a unit reads as a figure gone missing, when it
          // means there is nothing to do.
          detail={
            summary.frontWeightMean === null
              ? t('nothing to adjust')
              : t('{{weight}} g on average', {
                  weight: formatSignedWeightValue(
                    summary.frontWeightMean,
                    currentLanguage,
                  ),
                })
          }
        />
        <SummaryTile
          label={t('Strike Weight', { ns: 'navigation' })}
          figure={t('{{count}} hammers', { count: summary.strikeWeightCount })}
          detail={[
            summary.strikeWeightMin === null || summary.strikeWeightMax === null
              ? null
              : t('from {{min}} to {{max}} g', {
                  max: formatSignedWeightValue(
                    summary.strikeWeightMax,
                    currentLanguage,
                  ),
                  min: formatSignedWeightValue(
                    summary.strikeWeightMin,
                    currentLanguage,
                  ),
                }),
            t('{{count}} unchanged', { count: summary.strikeWeightUnchanged }),
          ]
            .filter(Boolean)
            .join(' · ')}
        />
        {summary.hasSprings ? (
          <SummaryTile
            label={t('Wippen Support Springs', { ns: 'navigation' })}
            figure={t('{{count}} springs', { count: summary.springCount })}
            detail={t('keys {{first}} to {{last}}', {
              first: summary.springFirstKey ?? 0,
              last: summary.springLastKey ?? 0,
            })}
          />
        ) : null}
      </div>

      <section className="overflow-hidden rounded-md border border-ptl-rule-strong bg-card print:overflow-visible print:rounded-none print:border-0">
        <div className="overflow-x-auto print:overflow-visible">
          {/*
           * The table scrolls sideways on screen rather than cram eight
           * columns into a narrow window; on paper there is nowhere to
           * scroll, so it gives up its floor width and fits the sheet.
           */}
          <table className="w-full min-w-[820px] table-fixed border-collapse print:table-auto print:min-w-0">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[64px]" />
              <col />
              <col />
              {summary.hasSprings ? <col /> : null}
              <col className="w-[64px]" />
            </colgroup>
            <thead>
              <tr>
                <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold text-ptl-ink-3">
                  {t('No.')}
                </th>
                <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold text-ptl-ink-3">
                  {t('Note')}
                </th>
                <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold">
                  <span className="mr-2 font-mono text-[11.5px] font-medium text-ptl-brass">
                    FW
                  </span>
                  {t('Front Weight', { ns: 'navigation' })}
                </th>
                <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold">
                  <span className="mr-2 font-mono text-[11.5px] font-medium text-ptl-brass">
                    SW
                  </span>
                  {t('Strike Weight', { ns: 'navigation' })}
                </th>
                {summary.hasSprings ? (
                  <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-left align-middle text-[13px] font-semibold">
                    <span className="mr-2 font-mono text-[11.5px] font-medium text-ptl-brass">
                      BWS
                    </span>
                    {t('Wippen Support Springs', { ns: 'navigation' })}
                  </th>
                ) : null}
                <th className="h-12 border-b border-ptl-rule-strong bg-card px-3 text-center align-middle text-[13px] font-semibold">
                  {t('Done')}
                </th>
                <th className="ptl-print-only h-12 border-b border-b-ptl-rule-strong border-l border-l-border px-3 text-left align-middle text-[13px] font-semibold">
                  {t('Notes')}
                </th>
              </tr>
            </thead>
            <tbody>
              {keyboard.mapToArray((key) => (
                <AdjustmentSheetTableRow
                  key={key.number}
                  hasWippenAssistSpringDesign={summary.hasSprings}
                  isBlackKey={key.color === KeyColor.Black}
                  item={key}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-border px-4 py-3.5 text-[13px] text-muted-foreground print:hidden">
          <span className="font-mono text-xs">
            {t('{{count}} keys', {
              count: keyboard.size,
              ns: 'navigation',
            })}
          </span>
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ptl-delta-plus px-[7px] py-0.5 text-xs text-ptl-delta-plus-foreground">
              +
            </span>
            {t('to add')}
            <span className="rounded-full bg-ptl-delta-minus px-[7px] py-0.5 text-xs text-ptl-delta-minus-foreground">
              −
            </span>
            {t('to remove')}
            <span className="text-ptl-ink-3">{t('values in grams')}</span>
          </span>
        </div>
      </section>

      <p className="ptl-print-only m-0 text-[12px] leading-[1.5] text-muted-foreground">
        {t(
          'Values in grams: current → target, then the difference to apply (+ to add, − to remove). “unchanged”: a difference below {{threshold}} g.',
          {
            threshold: formatWeightValue(ADJUSTMENT_THRESHOLD, currentLanguage),
          },
        )}
      </p>
    </div>
  );
};
