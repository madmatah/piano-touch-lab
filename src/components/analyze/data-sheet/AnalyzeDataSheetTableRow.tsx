import { TableCell, TableRow } from '@/components/ui/table';
import type { KeyWith } from '@/lib/piano/keyboard';
import type { TouchWeightKeyAnalysis } from '@/lib/piano/touch-design/touch-weight-key-analysis';
import { AnalyzeDataSheetTableCell } from './AnalyzeDataSheetCell';

export interface AnalyzeDataSheetTableRowProps {
  item: KeyWith<TouchWeightKeyAnalysis>;
  shouldUseSupportSpringMeasurements: boolean;
}

export const AnalyzeDataSheetTableRow: React.FC<
  AnalyzeDataSheetTableRowProps
> = ({ item, shouldUseSupportSpringMeasurements }) => {
  return (
    <TableRow key={item.number} className="even:bg-accent hover:bg-primary/10">
      <TableCell className="font-medium">#{item.number}</TableCell>
      <AnalyzeDataSheetTableCell
        value={item.payload.downWeightWithoutSpringSupport}
        unit="g"
      />
      <AnalyzeDataSheetTableCell value={item.payload.balanceWeight} unit="g" />
      <AnalyzeDataSheetTableCell value={item.payload.upWeight} unit="g" />
      <AnalyzeDataSheetTableCell value={item.payload.frictionWeight} unit="g" />
      <AnalyzeDataSheetTableCell value={item.payload.frontWeight} unit="g" />
      <AnalyzeDataSheetTableCell value={item.payload.strikeWeight} unit="g" />
      <AnalyzeDataSheetTableCell value={item.payload.strikeWeightRatio} />
      {shouldUseSupportSpringMeasurements && (
        <AnalyzeDataSheetTableCell
          value={item.payload.supportSpringBalanceWeight}
          unit="g"
        />
      )}
    </TableRow>
  );
};
