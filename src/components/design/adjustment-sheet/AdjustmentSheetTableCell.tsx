import { TableCell } from '@/components/ui/table';
import { AdjustmentValue } from './AdjustmentValue';

export interface AdjustmentSheetTableCellProps {
  values: {
    actualValue: number | null;
    targetValue: number | null;
    unit?: string;
  } | null;
}

export const AdjustmentSheetTableCell: React.FC<
  AdjustmentSheetTableCellProps
> = ({ values }) => {
  return (
    <TableCell>
      <div
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          gap: 4,
        }}
      >
        {values ? (
          <AdjustmentValue
            actualValue={values.actualValue}
            targetValue={values.targetValue}
            unit={values.unit}
          />
        ) : null}
      </div>
    </TableCell>
  );
};
