import { useValueFormatter } from '@/components/design/adjustment-sheet/hooks/use-value-formatter';
import { TableCell } from '@/components/ui/table';

export interface AnalyzeDataSheetTableCellProps {
  value: number | null;
  unit?: string;
}

export const AnalyzeDataSheetTableCell: React.FC<
  AnalyzeDataSheetTableCellProps
> = ({ value, unit }) => {
  const { formatWeight } = useValueFormatter();
  return (
    <TableCell>
      <div
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          gap: 4,
        }}
      >
        {value ? <div>{formatWeight(value, unit)}</div> : null}
      </div>
    </TableCell>
  );
};
