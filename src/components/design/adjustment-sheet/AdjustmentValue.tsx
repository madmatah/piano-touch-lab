import { ArrowRight } from 'lucide-react';
import { useValueFormatter } from './hooks/use-value-formatter';
import { useMemo } from 'react';

export interface AdjustmentValueProps {
  actualValue: number | null;
  targetValue: number | null;
  unit?: string;
}

export const AdjustmentValue: React.FC<AdjustmentValueProps> = ({
  actualValue,
  targetValue,
  unit,
}) => {
  const { formatWeight, formatDiff } = useValueFormatter();

  const isEmpty = actualValue === null || targetValue === null;

  const diff = useMemo(() => {
    return targetValue !== null && actualValue !== null
      ? targetValue - actualValue
      : null;
  }, [actualValue, targetValue]);

  const shouldShowDiff = useMemo(() => {
    if (targetValue && diff) {
      return Math.abs(diff) >= 0.1;
    }
  }, [targetValue, diff]);

  return !isEmpty ? (
    <>
      {actualValue ? <div>{formatWeight(actualValue)}</div> : null}
      {shouldShowDiff ? (
        <>
          <div>
            <ArrowRight style={{ height: 12, width: 12 }} />
          </div>
          <div>{formatWeight(targetValue)}</div>
          <div>({formatDiff(diff!, unit)})</div>
        </>
      ) : null}
    </>
  ) : null;
};
