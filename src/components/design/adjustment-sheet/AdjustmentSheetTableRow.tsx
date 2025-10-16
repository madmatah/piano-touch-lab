import { TableCell, TableRow } from '@/components/ui/table';
import type { KeyAdjustmentPayload } from './AdjustmentSheet.types';
import type { KeyWith } from '@/lib/piano/keyboard';
import { AdjustmentSheetTableCell } from './AdjustmentSheetTableCell';

export interface AdjustmentSheetTableRowProps {
  item: KeyWith<KeyAdjustmentPayload | null>;
  hasWippenAssistSpringDesign: boolean;
}

export const AdjustmentSheetTableRow: React.FC<
  AdjustmentSheetTableRowProps
> = ({ item, hasWippenAssistSpringDesign }) => {
  return (
    <TableRow key={item.number} className="even:bg-accent hover:bg-primary/10">
      <TableCell className="font-medium">#{item.number}</TableCell>
      <AdjustmentSheetTableCell
        values={
          item.payload
            ? {
                actualValue: item.payload.actualFrontWeight,
                targetValue: item.payload.targetFrontWeight,
                unit: 'g',
              }
            : null
        }
      />
      <AdjustmentSheetTableCell
        values={
          item.payload
            ? {
                actualValue: item.payload.actualStrikeWeight,
                targetValue: item.payload.targetStrikeWeight,
                unit: 'g',
              }
            : null
        }
      />
      {hasWippenAssistSpringDesign && (
        <AdjustmentSheetTableCell
          values={
            item.payload
              ? {
                  actualValue: item.payload.actualSupportSpringBalanceWeight,
                  targetValue: item.payload.targetSupportSpringBalanceWeight,
                  unit: 'g',
                }
              : null
          }
        />
      )}
    </TableRow>
  );
};
