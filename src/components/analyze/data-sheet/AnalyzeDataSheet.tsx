import { useTranslation } from '@/hooks/use-translation';
import { useMeasureOptions } from '@/hooks/store/use-measure-options-store';
import { KeyColor } from '@/lib/piano/keyboard';
import type { TouchWeightAnalyzedKeyboard } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { PrintTableFooter } from '@/components/print/PrintTableFooter';

import { AnalyzeDataSheetTableRow } from './AnalyzeDataSheetTableRow';

/**
 * Every value of the instrument, key by key.
 *
 * The columns are grouped under two banners — what was measured and what the
 * tool worked out from it — because that distinction is the whole point of
 * the sheet: a reader checking a surprising figure needs to know at once
 * whether to doubt their gauge or their arithmetic.
 */
export const AnalyzeDataSheet: React.FC<{
  analyzedKeyboard: TouchWeightAnalyzedKeyboard;
}> = ({ analyzedKeyboard }) => {
  const { currentLanguage, t } = useTranslation();
  const { useManualSWRMeasurements, useSupportSpringMeasurements } =
    useMeasureOptions();

  // The same columns, in the same order and under the same names, as the
  // measuring table: what was read at the bench goes under "Measured", and
  // only what was worked out from it under "Computed".
  const measuredColumns = [
    ...(useSupportSpringMeasurements
      ? [{ abbreviation: 'DS', name: t('D with spring') }]
      : []),
    { abbreviation: 'D', name: t('Down weight') },
    { abbreviation: 'U', name: t('Up weight') },
    { abbreviation: 'FW', name: t('Front weight') },
    { abbreviation: 'SW', name: t('Strike weight') },
    ...(useManualSWRMeasurements
      ? [{ abbreviation: 'SWR', name: t('Ratio') }]
      : []),
  ];
  const computedColumns = [
    { abbreviation: 'BW', name: t('Balance') },
    { abbreviation: 'F', name: t('Friction') },
    { abbreviation: 'R', name: t('Ratio') },
    ...(useSupportSpringMeasurements
      ? [{ abbreviation: 'BWS', name: t('Springs') }]
      : []),
  ];

  return (
    <div className="overflow-hidden rounded-md border border-ptl-rule-strong bg-card print:overflow-visible print:rounded-none print:border-0">
      {/*
       * The sheet is read by scrolling inside its own frame; on paper the
       * frame is the sheet, so the height cap and the sticky header go, and
       * the browser repeats the header on every page instead.
       */}
      <div
        role="region"
        aria-label={t('Every value of the instrument, key by key')}
        tabIndex={0}
        className="max-h-[70vh] overflow-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none print:max-h-none print:overflow-visible"
      >
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-card print:static">
            <tr>
              <th className="border-b border-border bg-card" colSpan={2} />
              <th
                colSpan={measuredColumns.length}
                scope="colgroup"
                className="ptl-label border-b border-border bg-ptl-brass-soft px-2 py-2 text-left text-foreground"
              >
                {t('Measured')}
              </th>
              <th
                colSpan={computedColumns.length}
                scope="colgroup"
                className="ptl-label border-b border-border px-2 py-2 text-left"
              >
                {t('Computed')}
              </th>
            </tr>
            <tr className="border-b border-ptl-rule-strong">
              <th
                scope="col"
                className="px-2 pt-2.5 pb-2 text-left align-bottom font-mono text-[11px] text-ptl-ink-3"
              >
                {t('No.')}
              </th>
              <th
                scope="col"
                className="px-2 pt-2.5 pb-2 text-left align-bottom font-mono text-[11px] text-ptl-ink-3"
              >
                {t('Note')}
              </th>
              {[...measuredColumns, ...computedColumns].map((column) => (
                <th
                  key={column.abbreviation}
                  scope="col"
                  className="px-2 pt-2.5 pb-2 text-right align-bottom"
                >
                  <span className="block font-mono text-[12px] font-semibold text-ptl-brass">
                    {column.abbreviation}
                  </span>
                  <span className="block text-[11px] font-normal text-ptl-ink-3">
                    {column.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analyzedKeyboard.mapToArray((key) => (
              <AnalyzeDataSheetTableRow
                key={key.number}
                isBlackKey={key.color === KeyColor.Black}
                item={key}
                locale={currentLanguage}
                shouldUseManualSWRMeasurements={useManualSWRMeasurements}
                shouldUseSupportSpringMeasurements={
                  useSupportSpringMeasurements
                }
              />
            ))}
          </tbody>
          <PrintTableFooter
            colSpan={2 + measuredColumns.length + computedColumns.length}
          />
        </table>
      </div>
    </div>
  );
};
