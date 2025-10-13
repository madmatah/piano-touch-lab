import { ArrowRight } from 'lucide-react';
import { useValueFormatter } from './hooks/use-value-formatter';

export interface AdjustmentValueProps {
  actualValue: number;
  targetValue: number;
  unit?: string;
}

export const AdjustmentValue: React.FC<AdjustmentValueProps> = ({
  actualValue,
  targetValue,
  unit,
}) => {
  const { formatWeight, formatDiff } = useValueFormatter();
  const diff = targetValue - actualValue;

  if (diff < 0.1) {
    return <div>{formatWeight(actualValue)}</div>;
  }

  return (
    <>
      <div>{formatWeight(actualValue)}</div>
      <div>
        <ArrowRight style={{ height: 12, width: 12 }} />
      </div>
      <div>{formatWeight(targetValue)}</div>
      <div>({formatDiff(targetValue - actualValue, unit)})</div>
    </>
  );
};
