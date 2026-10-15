import type { KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';

import { AnalyzeDataSheetTableCell } from './AnalyzeDataSheetCell';

export interface AnalyzeDataSheetTableRowProps {
  isBlackKey: boolean;
  item: KeyWith<TouchWeightKeyAnalysis>;
  locale: string;
  shouldUseSupportSpringMeasurements: boolean;
}

export const AnalyzeDataSheetTableRow: React.FC<
  AnalyzeDataSheetTableRowProps
> = ({ isBlackKey, item, locale, shouldUseSupportSpringMeasurements }) => (
  <tr className="border-b border-border last:border-b-0 even:bg-secondary/50 hover:bg-accent">
    <td className="px-2 py-[7px] font-mono text-[12px] text-ptl-ink-3">
      {item.number}
    </td>
    <td className="px-2 py-[7px] font-mono text-[13px]">
      {isBlackKey ? (
        <span className="inline-flex rounded-sm bg-ptl-key-black px-[5px] py-px text-ptl-key-white">
          {item.name}
        </span>
      ) : (
        item.name
      )}
    </td>
    <AnalyzeDataSheetTableCell
      locale={locale}
      value={item.payload.downWeightWithoutSpringSupport}
    />
    <AnalyzeDataSheetTableCell locale={locale} value={item.payload.upWeight} />
    <AnalyzeDataSheetTableCell
      locale={locale}
      value={item.payload.frontWeight}
    />
    <AnalyzeDataSheetTableCell
      locale={locale}
      value={item.payload.strikeWeight}
    />
    <AnalyzeDataSheetTableCell
      locale={locale}
      value={item.payload.balanceWeight}
    />
    <AnalyzeDataSheetTableCell
      locale={locale}
      value={item.payload.frictionWeight}
    />
    <AnalyzeDataSheetTableCell
      isRatio
      locale={locale}
      value={item.payload.strikeWeightRatio}
    />
    {shouldUseSupportSpringMeasurements && (
      <AnalyzeDataSheetTableCell
        locale={locale}
        value={item.payload.supportSpringBalanceWeight}
      />
    )}
  </tr>
);
