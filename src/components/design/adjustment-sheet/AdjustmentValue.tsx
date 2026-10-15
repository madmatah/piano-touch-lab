import { useTranslation } from '@/hooks/use-translation';
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
 * red to take it off — because that is the only thing a technician acts on.
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
        className={
          difference > 0
            ? 'ml-auto rounded-full bg-ptl-delta-plus px-[7px] py-0.5 text-xs text-ptl-delta-plus-foreground'
            : 'ml-auto rounded-full bg-ptl-delta-minus px-[7px] py-0.5 text-xs text-ptl-delta-minus-foreground'
        }
      >
        {formatSignedWeightValue(difference, currentLanguage)}
      </span>
    </>
  );
};
