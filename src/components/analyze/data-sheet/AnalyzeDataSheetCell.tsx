import { formatRatio, formatWeightValue } from '@/lib/format/format-weight';

export interface AnalyzeDataSheetTableCellProps {
  /** Ratios carry two decimals and no unit. */
  isRatio?: boolean;
  locale: string;
  value: number | null;
}

/**
 * One figure of the sheet.
 *
 * The unit is in the column header, not in the cell: a column of numbers is
 * read by comparing their digits, which a repeated `g` only gets in the way of.
 */
export const AnalyzeDataSheetTableCell: React.FC<
  AnalyzeDataSheetTableCellProps
> = ({ isRatio, locale, value }) => (
  <td className="px-2 py-[7px] text-right font-mono text-[13px] tabular-nums">
    {isRatio ? formatRatio(value, locale) : formatWeightValue(value, locale)}
  </td>
);
