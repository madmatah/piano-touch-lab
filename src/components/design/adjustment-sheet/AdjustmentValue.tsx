import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import {
  formatSignedWeightValue,
  formatWeightValue,
} from '@/lib/format/format-weight';

export interface AdjustmentValueProps {
  actualValue: number | null;
  targetValue: number | null;
  /** Below this, the change is not worth a trip to the bench. */
  threshold?: number;
}

/**
 * One adjustment: where the key stands, where it should go, and by how much.
 *
 * The pill is coloured by the sign, never by the column — brass to add weight,
 * red to take it off — because that is the only thing a technician acts on. On
 * paper the pill flattens to plain bold text, as the printed sheet of the
 * design shows it: a tinted lozenge per row is a lot of toner for a sign.
 */
export const AdjustmentValue: React.FC<AdjustmentValueProps> = ({
  actualValue,
  targetValue,
  threshold = 0.1,
}) => {
  const { currentLanguage, t } = useTranslation();

  if (actualValue === null || targetValue === null) {
    return <span className="text-ptl-ink-3">—</span>;
  }

  const difference = targetValue - actualValue;

  if (Math.abs(difference) < threshold) {
    return (
      <>
        <span className="text-muted-foreground">
          {formatWeightValue(actualValue, currentLanguage)}
        </span>
        <span className="ml-auto font-sans text-xs text-ptl-ink-3">
          {t('unchanged')}
        </span>
      </>
    );
  }

  return (
    <>
      <span className="text-muted-foreground">
        {formatWeightValue(actualValue, currentLanguage)}
      </span>
      <span aria-hidden="true" className="text-xs text-ptl-ink-3">
        →
      </span>
      <span className="font-semibold text-foreground">
        {formatWeightValue(targetValue, currentLanguage)}
      </span>
      <span
        className={cn(
          'ml-auto rounded-full px-[7px] py-0.5 text-xs',
          'print:bg-transparent print:px-0 print:font-semibold print:text-foreground',
          difference > 0
            ? 'bg-ptl-delta-plus text-ptl-delta-plus-foreground'
            : 'bg-ptl-delta-minus text-ptl-delta-minus-foreground',
        )}
      >
        {formatSignedWeightValue(difference, currentLanguage)}
      </span>
    </>
  );
};
