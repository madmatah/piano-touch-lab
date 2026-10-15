import {
  NumericSelector,
  type NumericSelectorProps,
} from '@/components/app-ui/numeric-selector/NumericSelector';

export interface WippenDesignSpecificationProps {
  name: string;
  selectorProps: NumericSelectorProps;
}

/**
 * One setting of the spring design: what is being set on the left, its stepper
 * on the right.
 *
 * The row now lives inside the objective card, in a column barely wider than
 * the stepper itself, so it wraps instead of squeezing the stepper: a label
 * above its control still reads as one setting, a clipped stepper does not.
 */
export const WipenDesignSpecificationItem: React.FC<
  WippenDesignSpecificationProps
> = ({ name, selectorProps }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
      <span className="text-[13.5px] text-muted-foreground">{name}</span>
      <NumericSelector {...selectorProps} />
    </div>
  );
};
