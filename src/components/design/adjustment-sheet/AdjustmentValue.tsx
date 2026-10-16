import { useTranslation } from '@/hooks/use-translation';
import {
  benchAdjustment,
  isWorthAdjusting,
} from '@/lib/piano/touch-design/bench-adjustment';
import { cn } from '@/lib/utils';
import {
  formatSignedWeightValue,
  formatWeightValue,
} from '@/lib/format/format-weight';

export interface AdjustmentValueProps {
  actualValue: number | null;
  targetValue: number | null;
}

/*
 * The current weight and the target each take a slot four characters wide,
 * set to the right: down a column the units, the commas and the tenths stand
 * one under the other, and every change starts at the same place, just after
 * its target, rather than at the far edge of a wide column.
 */
const slotClassName = 'min-w-[4ch] text-right';

const Arrow = () => (
  <span aria-hidden="true" className="text-xs text-ptl-ink-3">
    →
  </span>
);

/**
 * One adjustment: where the key stands, where it should go, and by how much.
 *
 * The pill is coloured by the sign, never by the column — brass to add weight,
 * red to take it off — because that is the only thing a technician acts on. On
 * paper the pill flattens to plain text, as the printed sheet of the design
 * shows it: a tinted lozenge per row is a lot of toner for a sign. There it is
 * set smaller and lighter than the target, which is the figure in bold, so
 * that the two are not read for one another.
 *
 * A key that was never read still gets its target — springs fitted where
 * none were measured are set to it all the same — but no change to make.
 */
export const AdjustmentValue: React.FC<AdjustmentValueProps> = ({
  actualValue,
  targetValue,
}) => {
  const { currentLanguage, t } = useTranslation();

  if (targetValue === null) {
    return <span className={cn(slotClassName, 'text-ptl-ink-3')}>—</span>;
  }

  const difference = benchAdjustment(actualValue, targetValue);

  if (actualValue === null || difference === null) {
    return (
      <>
        <span className={cn(slotClassName, 'text-ptl-ink-3')}>—</span>
        <Arrow />
        <span className={cn(slotClassName, 'font-semibold text-foreground')}>
          {formatWeightValue(targetValue, currentLanguage)}
        </span>
      </>
    );
  }

  if (!isWorthAdjusting(difference)) {
    return (
      <>
        <span className={cn(slotClassName, 'text-muted-foreground')}>
          {formatWeightValue(actualValue, currentLanguage)}
        </span>
        <span className="font-sans text-xs text-ptl-ink-3">
          {t('unchanged')}
        </span>
      </>
    );
  }

  return (
    <>
      <span className={cn(slotClassName, 'text-muted-foreground')}>
        {formatWeightValue(actualValue, currentLanguage)}
      </span>
      <Arrow />
      <span className={cn(slotClassName, 'font-semibold text-foreground')}>
        {formatWeightValue(targetValue, currentLanguage)}
      </span>
      <span
        className={cn(
          'ml-1 rounded-full px-[7px] py-0.5 text-xs',
          'print:ml-0.5 print:bg-transparent print:px-0 print:text-[10.5px] print:text-muted-foreground',
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
